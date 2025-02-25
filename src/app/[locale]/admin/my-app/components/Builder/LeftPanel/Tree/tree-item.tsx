import {
  Fragment,
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';

import { createRoot } from 'react-dom/client';
import invariant from 'tiny-invariant';
import {
  type Instruction,
  type ItemMode
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/tree-item';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
  draggable,
  dropTargetForElements,
  monitorForElements
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { pointerOutsideOfPreview } from '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import type { DragLocationHistory } from '@atlaskit/pragmatic-drag-and-drop/types';
import { indentPerLevel } from './constants';
import { DependencyContext, TreeContext } from './tree-context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faChevronRight
} from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { IVDOMNode } from '../../../interfaces';
import { useProperties } from '../../Properties/useProperties';

const iconColor = '#44546F';

function ChildIcon() {
  return (
    <svg aria-hidden={true} width={24} height={24} viewBox='0 0 24 24'>
      <circle cx={12} cy={12} r={2} fill={iconColor} />
    </svg>
  );
}

function GroupIcon({ isOpen }: { isOpen: boolean }) {
  const Icon = isOpen ? (
    <FontAwesomeIcon color={iconColor} icon={faChevronDown} />
  ) : (
    <FontAwesomeIcon color={iconColor} icon={faChevronRight} />
  );
  return Icon;
}

function Icon({ item }: { item: IVDOMNode }) {
  if (!item.children.length) {
    return <ChildIcon />;
  }
  return <GroupIcon isOpen={(item as any).isOpen ?? false} />;
}

function Preview({ item }: { item: IVDOMNode }) {
  return <div className='p-2 rounded bg-white text-xs'>{item.type}</div>;
}

function getParentLevelOfInstruction(instruction: Instruction): number {
  if (instruction.type === 'instruction-blocked') {
    return getParentLevelOfInstruction(instruction.desired);
  }
  if (instruction.type === 'reparent') {
    return instruction.desiredLevel - 1;
  }
  return instruction.currentLevel - 1;
}

function delay({
  waitMs: timeMs,
  fn
}: {
  waitMs: number;
  fn: () => void;
}): () => void {
  let timeoutId: number | null = window.setTimeout(() => {
    timeoutId = null;
    fn();
  }, timeMs);
  return function cancel() {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      timeoutId = null;
    }
  };
}

type Props = {
  item: IVDOMNode;
  mode: ItemMode;
  level: number;
  index: number;
  onSelectNode: (event: React.MouseEvent, node: IVDOMNode | null) => void;
};
const TreeItem = memo(function TreeItem({
  item,
  mode,
  level,
  index,
  onSelectNode
}: Props) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const { selectedNode } = useProperties();
  const [instruction, setInstruction] = useState<Instruction | null>(null);
  const cancelExpandRef = useRef<(() => void) | null>(null);
  const { dispatch, uniqueContextId, getPathToItem, registerTreeItem } =
    useContext(TreeContext);
  const { DropIndicator, attachInstruction, extractInstruction } =
    useContext(DependencyContext);

  const toggleOpen = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      onSelectNode(event, item);
      dispatch({ type: 'toggle', itemId: item._id });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, item]
  );

  useEffect(() => {
    invariant(buttonRef.current);
    return registerTreeItem({
      itemId: item._id,
      element: buttonRef.current
    });
  }, [item._id, registerTreeItem]);

  const cancelExpand = useCallback(() => {
    cancelExpandRef.current?.();
    cancelExpandRef.current = null;
  }, []);

  // When an item has an instruction applied
  // we are highlighting it's parent item for improved clarity
  const shouldHighlightParent = useCallback(
    (location: DragLocationHistory): boolean => {
      const target = location.current.dropTargets[0];

      if (!target) {
        return false;
      }

      const instruction = extractInstruction(target.data);

      if (!instruction) {
        return false;
      }

      const targetId = target.data.id;
      invariant(typeof targetId === 'string');

      const path = getPathToItem(targetId);
      const parentLevel: number = getParentLevelOfInstruction(instruction);
      const parentId = path[parentLevel];
      return parentId === item._id;
    },
    [getPathToItem, extractInstruction, item]
  );

  useEffect(() => {
    invariant(buttonRef.current);

    function updateIsParentOfInstruction({
      location
    }: {
      location: DragLocationHistory;
    }) {
      if (shouldHighlightParent(location)) {
        return;
      }
    }

    return combine(
      draggable({
        element: buttonRef.current,
        getInitialData: () => {
          return {
            id: item._id,
            type: 'tree-item',
            isOpenOnDragStart: item.isOpen,
            uniqueContextId,
            componentType: item.type
          };
        },
        onGenerateDragPreview: ({ nativeSetDragImage }) => {
          setCustomNativeDragPreview({
            getOffset: pointerOutsideOfPreview({ x: '16px', y: '8px' }),
            render: ({ container }) => {
              const root = createRoot(container);
              root.render(<Preview item={item} />);
              return () => root.unmount();
            },
            nativeSetDragImage
          });
        },
        onDragStart: ({ source }) => {
          // collapse open items during a drag
          if (source.data.isOpenOnDragStart) {
            dispatch({ type: 'collapse', itemId: item._id });
          }
        },
        onDrop: ({ source }) => {
          if (source.data.isOpenOnDragStart) {
            dispatch({ type: 'expand', itemId: item._id });
          }
        }
      }),
      dropTargetForElements({
        element: buttonRef.current,
        getData: ({ input, element }) => {
          const data = { id: item._id };
          return attachInstruction(data, {
            input,
            element,
            indentPerLevel,
            currentLevel: level,
            mode,
            block: ['make-child']
            // block: item.inline ? ['make-child'] : []
          });
        },
        canDrop: ({ source }) => {
          // console.log('source', source);
          return (
            source.data.type === 'tree-item' &&
            source.data.uniqueContextId === uniqueContextId
          );
        },
        getIsSticky: () => true,
        onDrag: ({ self, source }) => {
          const instruction = extractInstruction(self.data);

          if (source.data.id !== item._id) {
            // expand after 500ms if still merging
            if (
              instruction?.type === 'make-child' &&
              item.children.length &&
              !item.isOpen &&
              !cancelExpandRef.current
            ) {
              cancelExpandRef.current = delay({
                waitMs: 500,
                fn: () => dispatch({ type: 'expand', itemId: item._id })
              });
            }
            if (instruction?.type !== 'make-child' && cancelExpandRef.current) {
              cancelExpand();
            }

            setInstruction(instruction);
            return;
          }
          if (instruction?.type === 'reparent') {
            setInstruction(instruction);
            return;
          }
          setInstruction(null);
        },
        onDragLeave: () => {
          cancelExpand();
          setInstruction(null);
        },
        onDrop: () => {
          cancelExpand();
          setInstruction(null);
        }
      }),
      monitorForElements({
        canMonitor: ({ source }) =>
          source.data.uniqueContextId === uniqueContextId,
        onDragStart: updateIsParentOfInstruction,
        onDrag: updateIsParentOfInstruction,
        onDrop() {}
      })
    );
  }, [
    dispatch,
    item,
    mode,
    level,
    cancelExpand,
    uniqueContextId,
    extractInstruction,
    attachInstruction,
    getPathToItem,
    shouldHighlightParent
  ]);

  useEffect(
    function mount() {
      return function unmount() {
        cancelExpand();
      };
    },
    [cancelExpand]
  );

  useEffect(() => {
    if (selectedNode?._id === item._id) {
      if (!!selectedNode?.name && selectedNode?.name !== item.name) {
        dispatch({
          type: 'update-item',
          itemId: item._id,
          updatedNode: {
            ...item,
            name: selectedNode.name
          }
        });
      }
    }
  }, [selectedNode, item, dispatch]);

  const aria = (() => {
    if (!item.children.length) {
      return undefined;
    }
    return {
      'aria-expanded': item.isOpen,
      'aria-controls': `tree-item-${item._id}--subtree`
    };
  })();

  return (
    <Fragment>
      <div style={{ position: 'relative' }}>
        <div
          {...aria}
          ref={buttonRef}
          id={`tree-item-${item._id}`}
          data-testid={`tree-item-${item._id}`}
          data-index={index}
          data-level={level}
          className={`flex items-center p-2 rounded ${
            selectedNode?._id === item._id ? 'bg-gray-200' : 'bg-white'
          }`}
          style={{
            paddingLeft: level * indentPerLevel
          }}>
          <button type='button' onClick={toggleOpen}>
            <span className='grid grid-cols-[20px_1fr] items-center px-2'>
              <Icon item={item} />
              <div className='flex flex-col items-center'>
                <span className='text-xs'>{item.type}</span>
                <span className='text-[10px] text-gray-500'>{item?.name}</span>
              </div>
            </span>
            {instruction ? <DropIndicator instruction={instruction} /> : null}
          </button>
        </div>
      </div>
      {item.children?.length && item.isOpen ? (
        <div id={aria?.['aria-controls']}>
          {item.children?.map((child, index, array) => {
            const childType: ItemMode = (() => {
              if (child.children?.length && child.isOpen) {
                return 'expanded';
              }

              if (index === array.length - 1) {
                return 'last-in-group';
              }

              return 'standard';
            })();
            return (
              <TreeItem
                item={child}
                key={child._id}
                level={level + 1}
                mode={childType}
                index={index}
                onSelectNode={onSelectNode}
              />
            );
          })}
        </div>
      ) : null}
    </Fragment>
  );
});

export default TreeItem;
