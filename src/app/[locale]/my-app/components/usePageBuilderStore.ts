import { create } from 'zustand'
import { ENUM_COMPONENTS, ENUM_COMPONENTS_TYPE, IElementConfig, IVDOMNode } from './interfaces';
import { findNodeById, updateNodeById } from './utils';
import { v4 } from 'uuid';
import client from '@/lib/mongo/initMongoClient';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { IPageTemplateVersion, IWebsite, IPage } from '@/lib/interfaces/interfaces';
import { IMasterTemplate } from '@/lib/TemplateBuilder/interfaces';
import { toastPromise } from '@/lib/toast/toastPromise';

interface PageBuilderContextProps {
  pageVersion: IPageTemplateVersion | null;
  website: IWebsite | null;
  designMode: boolean;
  elementConfig: IElementConfig | null;
  gridDisplay: boolean;
  elementsConfig: IElementConfig[];
  selectedNodeId: string | null;
  masterTemplates: IMasterTemplate[];
  selectedPage: IPage | null;
  selectedMasterTemplate: IMasterTemplate | null;
  setSelectMasterTemplate: (masterTemplate: IMasterTemplate) => void;
  setSelectedPage: (page: IPage | null) => void;
  onSelectNode: (event: React.MouseEvent, node: IVDOMNode | null) => void;
  onUpdateNodeProperty: (name: string, value: string) => void;
  setMasterTemplates: (templates: IMasterTemplate[]) => void;
  setDesignMode: (mode: boolean) => void;
  setGridDisplay: (status: boolean) => void;
  onSelectConfig: (config: IElementConfig | null) => void;
  onAddComponent: (component: ENUM_COMPONENTS) => void;
  fetchElementsConfig: () => Promise<void>;
  onPublish: () => Promise<void>;
  setWebsite: (website: IWebsite) => void;
  organizationId: string | null;
  setOrganizationId: (id: string) => void;
  setSelectedVersionPage: (page: IPageTemplateVersion | null) => void;
  setTemplateVersions: (templates: IPageTemplateVersion[]) => void;
  addTemplateVersion: (template: IPageTemplateVersion) => void;
  onSaveWebsite: (create: boolean, t: any) => void;
  pageTemplateVersions: IPageTemplateVersion[];
}
export const usePageBuilderStore = create<PageBuilderContextProps>((set, get) => ({
  website: null,
  selectedMasterTemplate: null,
  selectedPage: null,
  designMode: true,
  gridDisplay: false,
  selectedNodeId: null,
  pageVersion: null,
  elementsConfig: [],
  elementConfig: null,
  masterTemplates: [],
  organizationId: null,
  pageTemplateVersions: [],
  onSaveWebsite: async (create, t) => {
    const website = get().website;
    if (!website) return;
    if (create) {
      await toastPromise(
        client.create(ENUM_COLLECTIONS.WEBSITES, website),
        t,
        'create'
      );
    } else {
      toastPromise(
        client.update(
          ENUM_COLLECTIONS.WEBSITES,
          {
            _id: website._id
          },
          { $set: website }
        ),
        t,
        'edit'
      );
    }
  },
  addTemplateVersion: (template: IPageTemplateVersion) => {
    set({ pageTemplateVersions: [...get().pageTemplateVersions, template] });
  },
  setSelectMasterTemplate: async (masterTemplate: IMasterTemplate) => {
    const { data } = await client.list<IPageTemplateVersion>(
      ENUM_COLLECTIONS.PAGE_TEMPLATES,
      {
        masterTemplateId: masterTemplate._id
      }
    );
    set({ pageTemplateVersions: data || [], selectedMasterTemplate: masterTemplate });

  },
  setSelectedPage: async (page: IPage | null) => {
    set({ selectedPage: page });
    if (!page) {
      set({ masterTemplates: [] });
      return
    };
    const { data } = await client.list<IMasterTemplate>(
      ENUM_COLLECTIONS.TEMPLATES_MASTER,
      {
        _id: {
          $in: page.masterTemplates
        }
      }
    );
    set({ masterTemplates: data || [] });

  },
  setTemplateVersions: (templates: IPageTemplateVersion[]) => set({ pageTemplateVersions: templates }),
  setOrganizationId: (id: string) => set({ organizationId: id }),
  setWebsite: (website: IWebsite) => set({ website }),
  fetchElementsConfig: async () => {
    const { data } = await client.list<IElementConfig>(ENUM_COLLECTIONS.WEB_APP_ELEMENTS);
    set({ elementsConfig: data || [] });
  },
  onSelectConfig: (config: IElementConfig | null) => set({ elementConfig: config }),
  setDesignMode: (mode: boolean) => set({ designMode: mode }),
  setGridDisplay: (status: boolean) => set({ gridDisplay: status }),
  setSelectedVersionPage: (page: IPageTemplateVersion | null) => {
    set({ pageVersion: page })
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

    const updatePublishedVersion = {
      published: true,
      hasBeenPublished: true,
    }
    await client.update<IPageTemplateVersion>(
      ENUM_COLLECTIONS.PAGE_TEMPLATES,
      { _id: pageVersion._id },
      { $set: updatePublishedVersion }
    );
    await client.update<IMasterTemplate>(
      ENUM_COLLECTIONS.TEMPLATES_MASTER,
      {
        _id: pageVersion.masterTemplateId
      },
      {
        $set: {
          latestVersion: pageVersion.version,
          publishedVersion: { ...pageVersion, ...updatePublishedVersion },
          forceUpdate: pageVersion.forceUpdate
        }
      }
    );
    set({ pageVersion: { ...pageVersion, ...updatePublishedVersion } });
  },
  setMasterTemplates: (templates: IMasterTemplate[]) => set({ masterTemplates: templates }),

}))
