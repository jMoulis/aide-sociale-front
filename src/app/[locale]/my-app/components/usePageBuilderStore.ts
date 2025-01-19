import { create } from 'zustand'
import { ENUM_COMPONENTS, ENUM_COMPONENTS_TYPE, IElementConfig, IVDOMNode } from './interfaces';
import { findNodeById, updateNodeById } from './utils';
import { v4 } from 'uuid';
import client from '@/lib/mongo/initMongoClient';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { IPageTemplateVersion } from '@/lib/interfaces/interfaces';

interface PageBuilderContextProps {
  pageVersion: IPageTemplateVersion | null;
  designMode: boolean;
  elementConfig: IElementConfig | null;
  gridDisplay: boolean;
  elementsConfig: IElementConfig[];
  selectedNodeId: string | null;
  onSelectNode: (event: React.MouseEvent, node: IVDOMNode | null) => void;
  onUpdateNodeProperty: (name: string, value: string) => void;
  setDesignMode: (mode: boolean) => void;
  setGridDisplay: (status: boolean) => void;
  onSelectConfig: (config: IElementConfig | null) => void;
  onAddComponent: (component: ENUM_COMPONENTS) => void;
  fetchElementsConfig: () => Promise<void>;
  onPublish: () => Promise<void>;
  organizationId: string | null;
  onInitPageVersion: (page: IPageTemplateVersion, organizationId: string) => void;
}
export const usePageBuilderStore = create<PageBuilderContextProps>((set, get) => ({
  designMode: true,
  gridDisplay: false,
  selectedNodeId: null,
  pageVersion: null,
  elementsConfig: [],
  elementConfig: null,
  organizationId: null,
  fetchElementsConfig: async () => {
    const { data } = await client.list<IElementConfig>(ENUM_COLLECTIONS.WEB_APP_ELEMENTS);
    set({ elementsConfig: data || [] });
  },
  onSelectConfig: (config: IElementConfig | null) => set({ elementConfig: config }),
  setDesignMode: (mode: boolean) => set({ designMode: mode }),
  setGridDisplay: (status: boolean) => set({ gridDisplay: status }),
  onInitPageVersion: (page: IPageTemplateVersion, organizationId: string) => {
    set({ pageVersion: page })
    set({ organizationId })
  },
  onSelectNode: (event: React.MouseEvent, node: IVDOMNode | null) => {
    event.stopPropagation();
    if (node) {
      const elementsConfig = get().elementsConfig;
      const config = elementsConfig.find(
        (el) => el.component === node?.component
      );

      set({ selectedNodeId: node._id, elementConfig: config });
    } else {
      set({ selectedNodeId: null, elementConfig: null });
    }
  },
  onUpdateNodeProperty: (name: string, value: any) => {
    const pageVersion = get().pageVersion;

    const selectedNodeId = get().selectedNodeId;
    if (!selectedNodeId || !pageVersion) return;
    const updatedVDOM = updateNodeById(pageVersion.vdom, selectedNodeId, (node) => {
      return { ...node, props: { ...node.props, [name]: value } };
    });
    set({ pageVersion: { ...pageVersion, vdom: updatedVDOM } });
  },
  onAddComponent: (component: any) => {
    const pageVersion = get().pageVersion;
    if (!pageVersion) return;
    const config =
      get().elementsConfig.find((el) => el.component === component) || null;

    const newElement = {
      _id: v4(),
      type: config?.type || ENUM_COMPONENTS_TYPE.BLOCK,
      component: component,
      props: {},
      children: component === ENUM_COMPONENTS.BLOCK ? [] : undefined
    };
    const selectedNodeId = get().selectedNodeId;
    const vdom = pageVersion.vdom;

    if (!vdom) return;
    let updatedVDOM = { ...vdom };

    if (selectedNodeId) {
      const targetNode = findNodeById(updatedVDOM, selectedNodeId);
      if (targetNode && targetNode.type === 'block') {
        updatedVDOM = updateNodeById(updatedVDOM, selectedNodeId, (node) => {
          const children = node.children || [];
          return { ...node, children: [...children, newElement] };
        });
      } else {
        updatedVDOM.children?.push(newElement);
      }
    } else {
      updatedVDOM.children?.push(newElement);
    }
    set({
      pageVersion: {
        ...pageVersion,
        vdom: updatedVDOM
      }, elementConfig: config, selectedNodeId: newElement._id
    });
  },
  onPublish: async () => {
    const pageVersion = get().pageVersion;
    if (!pageVersion) return;
    await client.updateMany(
      ENUM_COLLECTIONS.PAGE_TEMPLATES,
      { masterTemplateId: pageVersion.masterTemplateId, published: true },
      { $set: { published: false } }
    );
    await client.update(
      ENUM_COLLECTIONS.TEMPLATES,
      { _id: pageVersion._id },
      { $set: { published: true, hasBeenPublished: true } }
    );
    await client.update(
      ENUM_COLLECTIONS.TEMPLATES_MASTER,
      {
        _id: pageVersion.masterTemplateId
      },
      {
        $set: {
          latestVersion: pageVersion.version,
          publishedVersionId: pageVersion._id,
          forceUpdate: pageVersion.forceUpdate
        }
      }
    );
    set({ pageVersion: { ...pageVersion, published: true, hasBeenPublished: true } });
  }
}))
