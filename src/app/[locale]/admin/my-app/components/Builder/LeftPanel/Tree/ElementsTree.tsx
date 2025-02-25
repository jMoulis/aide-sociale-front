import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState
} from 'react';

import memoizeOne from 'memoize-one';
import invariant from 'tiny-invariant';
import {
  type Instruction,
  type ItemMode
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/tree-item';
import * as liveRegion from '@atlaskit/pragmatic-drag-and-drop-live-region';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { getInitialTreeState, tree, treeStateReducer } from './tree';
import {
  DependencyContext,
  TreeContext,
  type TreeContextValue
} from './tree-context';
import TreeItem from './tree-item';
import { IVDOMNode } from '../../../interfaces';
import { usePageBuilderStore } from '../../../stores/pagebuilder-store-provider';
import { IPageTemplateVersion } from '@/lib/interfaces/interfaces';
import Button from '@/components/buttons/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRefresh } from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';

type CleanupFn = () => void;

function createTreeItemRegistry() {
  const registry = new Map<string, { element: HTMLElement }>();

  const registerTreeItem = ({
    itemId,
    element
  }: {
    itemId: string;
    element: HTMLElement;
  }): CleanupFn => {
    registry.set(itemId, { element });
    return () => {
      registry.delete(itemId);
    };
  };

  return { registry, registerTreeItem };
}

export default function Tree() {
  const pageVersion = usePageBuilderStore((state) => state.pageVersion);
  const updatePageVersion = usePageBuilderStore((state) => state.onTreeUpdate);
  const onSelectNode = usePageBuilderStore((state) => state.onSelectNode);

  const [state, updateState] = useReducer(
    treeStateReducer,
    pageVersion?.vdom ? [pageVersion.vdom] : [],
    getInitialTreeState
  );

  useEffect(() => {
    if (state.lastAction?.type === 'instruction') {
      updatePageVersion(state.data?.[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
  const loadedVersion = useRef<IPageTemplateVersion | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const { extractInstruction } = useContext(DependencyContext);
  const [{ registerTreeItem }] = useState(createTreeItemRegistry);

  const { data } = state;

  const lastStateRef = useRef<IVDOMNode[]>(data);

  useEffect(() => {
    lastStateRef.current = data;
  }, [data]);

  useEffect(() => {
    return () => {
      liveRegion.cleanup();
    };
  }, []);

  useEffect(() => {
    if (
      loadedVersion.current &&
      loadedVersion.current._id !== pageVersion?._id
    ) {
      const newData = pageVersion?.vdom ? [pageVersion.vdom] : [];
      updateState({ type: 'reset', data: newData });
    }
    loadedVersion.current = pageVersion;
  }, [pageVersion]);

  const refreshTree = useCallback(() => {
    if (!pageVersion?.vdom) return;
    updateState({ type: 'reset', data: [pageVersion.vdom] });
    loadedVersion.current = pageVersion;
  }, [pageVersion]);
  /**
   * Returns the items that the item with `itemId` can be moved to.
   *
   * Uses a depth-first search (DFS) to compile a list of possible targets.
   */
  const getMoveTargets = useCallback(({ itemId }: { itemId: string }) => {
    const data = lastStateRef.current;

    const targets = [];

    const searchStack = Array.from(data);
    while (searchStack.length > 0) {
      const node = searchStack.pop();

      if (!node) {
        continue;
      }

      /**
       * If the current node is the item we want to move, then it is not a valid
       * move target and neither are its children.
       */
      if (node._id === itemId) {
        continue;
      }

      /**
       * Draft items cannot have children.
       */
      if (node.inline) {
        continue;
      }

      targets.push(node);

      node.children.forEach((childNode) => searchStack.push(childNode));
    }

    return targets;
  }, []);

  const getChildrenOfItem = useCallback((itemId: string) => {
    const data = lastStateRef.current;
    /**
     * An empty string is representing the root
     */
    if (itemId === '') {
      return data;
    }

    const item = tree.find(data, itemId);
    invariant(item);
    return item.children;
  }, []);

  const context = useMemo<TreeContextValue>(
    () => ({
      dispatch: updateState,
      uniqueContextId: Symbol('unique-id'),
      // memoizing this function as it is called by all tree items repeatedly
      // An ideal refactor would be to update our data shape
      // to allow quick lookups of parents
      getPathToItem: memoizeOne(
        (targetId: string) =>
          tree.getPathToItem({ current: lastStateRef.current, targetId }) ?? []
      ),
      getMoveTargets,
      getChildrenOfItem,
      registerTreeItem
    }),
    [getChildrenOfItem, getMoveTargets, registerTreeItem]
  );

  useEffect(() => {
    invariant(ref.current);
    return combine(
      monitorForElements({
        canMonitor: ({ source }) =>
          source.data.uniqueContextId === context.uniqueContextId,
        onDrop(args) {
          const { location, source } = args;
          // didn't drop on anything
          if (!location.current.dropTargets.length) {
            return;
          }
          if (source.data.type === 'tree-item') {
            const itemId = source.data.id as string;

            const target = location.current.dropTargets[0];
            const targetId = target.data.id as string;

            const instruction: Instruction | null = extractInstruction(
              target.data
            );

            if (instruction !== null) {
              updateState({
                type: 'instruction',
                instruction,
                itemId,
                targetId
              });
            }
          }
        }
      })
    );
  }, [context, extractInstruction]);

  return (
    <TreeContext.Provider value={context}>
      <div className='flex justify-center p-3 max-h-[70vh] overflow-y-auto'>
        <Button onClick={refreshTree}>
          <FontAwesomeIcon icon={faRefresh} />
        </Button>
        <div
          className='flex w-[280px] p-3 flex-col bg-[#F7F8F9]'
          id='tree'
          ref={ref}>
          {data.map((item, index, array) => {
            const type: ItemMode = (() => {
              if (item.children.length && item.isOpen) {
                return 'expanded';
              }
              if (index === array.length - 1) {
                return 'last-in-group';
              }
              return 'standard';
            })();

            return (
              <TreeItem
                item={item}
                level={0}
                key={item._id}
                mode={type}
                index={index}
                onSelectNode={onSelectNode}
              />
            );
          })}
        </div>
      </div>
    </TreeContext.Provider>
  );
}
