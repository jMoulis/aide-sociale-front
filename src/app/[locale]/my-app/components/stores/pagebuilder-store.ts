
import { IPage, IPageTemplateVersion, ITreePage, IWebsite, } from '@/lib/interfaces/interfaces'
import { createStore } from 'zustand/vanilla'
import { nanoid } from "nanoid";
import client from '@/lib/mongo/initMongoClient';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { IMasterTemplate } from '@/lib/TemplateBuilder/interfaces';
import { toastPromise } from '@/lib/toast/toastPromise';
import { toast } from '@/lib/hooks/use-toast';
import { ENUM_COMPONENTS, IElementConfig, IVDOMNode } from '../interfaces';
import { defaultTailwindConfig } from '../defaultTailwindConfig';
import { deleteNodeById, findNodeById, updateNodeById } from '../utils';
import { generatePageVersion } from '../generators';

export type PageBuilderState = {
  pageVersion: IPageTemplateVersion | null;
  website: IWebsite | null;
  designMode: boolean;
  elementConfig: IElementConfig | null;
  gridDisplay: boolean;
  elementsConfig: IElementConfig[];
  selectedNode: IVDOMNode | null;
  selectedPage: IPage | null;
  selectedMasterTemplate: IMasterTemplate | null;
  pageTemplateVersions: IPageTemplateVersion[];
  organizationId: string | null;
  pages: IPage[];
  masterTemplates: IMasterTemplate[];
  selectedBreakPoint: {
    name: string;
    size: {
      width: number;
      height: number;
    }
  };
}

export type PageBuilderActions = {
  initializeWebsite: (translation: any) => Promise<string>;
  setOrganizationId: (id: string) => void;
  setSelectedVersionPage: (pageVersion: IPageTemplateVersion | null, masterTemplate: IMasterTemplate | null, page: ITreePage | null) => void;
  onSaveWebsite: (create: boolean, t: any) => Promise<void>;
  onDuplicatePageVersion: () => Promise<void>;
  setSelectMasterTemplate: (masterTemplate: IMasterTemplate) => void;
  setSelectedPage: (page: IPage | null) => void;
  onTreeUpdate: (
    newTree: IVDOMNode | ((prevTree: IVDOMNode) => IVDOMNode)
  ) => void;
  onSelectNode: (event: React.MouseEvent, node: IVDOMNode | null) => void;
  onUpdateNodeProperty: (value: Record<string, any>, isContext: boolean, rootParams?: boolean) => void;
  onDeleteNode: (nodeId: string | null) => void;
  setDesignMode: (mode: boolean) => void;
  setGridDisplay: (status: boolean) => void;
  onSelectConfig: (config: IElementConfig | null) => void;
  onAddComponent: (component: ENUM_COMPONENTS) => void;
  fetchElementsConfig: () => Promise<void>;
  onAddPageTemplateVersion: (version: IPageTemplateVersion) => Promise<void>;
  onDeletePageVersion: (pageVersion: IPageTemplateVersion, softDelete?: boolean) => Promise<void>;
  onEditPageTemplateVersion: (version: Partial<IPageTemplateVersion>) => Promise<void>;
  onAppendAiToPage: (value: IVDOMNode) => void;
  onSavePageTemplate: (silent?: boolean) => Promise<void>;
  onPublish: () => Promise<void>;
  setWebsite: (website: IWebsite) => void;
  addPage: (page: IPage) => void;
  onEditPage: (page: IPage) => void;
  onAddMasterTemplate: (masterTemplate: IMasterTemplate) => void;
  onEditMasterTemplate: (masterTemplate: IMasterTemplate) => void;
  onDeleteMasterTemplate: (masterTemplate: IMasterTemplate) => void;
  onSelectBreakpoint: (breakpoint: 'mobile' | 'tablet' | 'desktop') => void;
}

export type PageBuilderStore = PageBuilderState & PageBuilderActions

export const breakPoints: {
  [key: string]: {
    width: number;
    height: number;
  };
} = {
  mobile: {
    width: 375,
    height: 812
  },
  tablet: {
    width: 768,
    height: 1024
  },
  desktop: {
    width: 1440,
    height: 1024
  }
}

export const createPageBuilderStore = (
  initState: PageBuilderState,
) => {
  return createStore<PageBuilderStore>()((set, get) => ({
    ...initState,
    selectedBreakPoint: {
      name: 'desktop',
      size: breakPoints.desktop
    },
    onSelectBreakpoint: (breakpoint: 'mobile' | 'tablet' | 'desktop') => {
      set({ selectedBreakPoint: { name: breakpoint, size: breakPoints[breakpoint] } });
    },
    initializeWebsite: async (t: any) => {
      const defaultWebsite: IWebsite = {
        name: 'Nouveau site',
        organizationId: get().organizationId || '',
        createdAt: new Date(),
        stylesheets: [],
        menus: [],
        tailwindConfig: defaultTailwindConfig,
        _id: nanoid(),
        published: false
      }
      await toastPromise(
        client.create(ENUM_COLLECTIONS.WEBSITES, defaultWebsite),
        t,
        'create'
      );
      set({ website: defaultWebsite, pages: [] });
      return defaultWebsite._id;
    },
    onAddMasterTemplate(masterTemplate) {
      const masterTemplates = get().masterTemplates;
      set({ masterTemplates: [...masterTemplates, masterTemplate] });
    },
    onEditMasterTemplate(masterTemplate) {
      const previousMasterTemplates = get().masterTemplates;

      if (previousMasterTemplates.length === 0) {
        set({ masterTemplates: [masterTemplate] });
        return;
      };
      const updatedMasterTemplates = previousMasterTemplates.map((template) => template._id === masterTemplate._id ? masterTemplate : template);
      set({ masterTemplates: updatedMasterTemplates });
    },
    onDeleteMasterTemplate(masterTemplate) {
      const masterTemplates = get().masterTemplates.filter((template) => template._id !== masterTemplate._id);
      set({ masterTemplates });
    },
    onAddPageTemplateVersion: async (version: IPageTemplateVersion) => {
      const pageTemplateList = get().pageTemplateVersions;
      const updatedPageTemplateList = [...pageTemplateList, version];
      set({ pageTemplateVersions: updatedPageTemplateList });
    },
    onEditPageTemplateVersion: async (version: Partial<IPageTemplateVersion>) => {
      const pageVersion = get().pageVersion;
      if (!pageVersion) return;
      const updatedPageVersion = { ...pageVersion, ...version, hasUnpublishedChanges: pageVersion.published ? true : pageVersion.hasUnpublishedChanges };

      await client.update(
        ENUM_COLLECTIONS.PAGE_TEMPLATES,
        { _id: pageVersion._id },
        { $set: updatedPageVersion }
      );
      const updatedPageTemplateList = get().pageTemplateVersions.map((template) =>
        template._id === updatedPageVersion._id ? updatedPageVersion : template
      );
      set({ pageTemplateVersions: updatedPageTemplateList, pageVersion: updatedPageVersion });
    },
    onDeletePageVersion: async (pageVersion: IPageTemplateVersion, softDelete) => {
      const getMasterPublishedVersion = get().selectedMasterTemplate?.publishedVersion;
      if (pageVersion.published) {
        toast({
          title: 'Error',
          description: 'Cannot delete published version',
          variant: 'destructive'
        });
        return;
      }
      if (softDelete) {
        const updatedPageVersion: IPageTemplateVersion = { ...pageVersion, archived: true };
        await client.update(
          ENUM_COLLECTIONS.PAGE_TEMPLATES,
          { _id: pageVersion._id },
          { $set: updatedPageVersion }
        );
        const updatedPageTemplateList = get().pageTemplateVersions.map((template) =>
          template._id === updatedPageVersion._id ? updatedPageVersion : template
        );
        set({ pageTemplateVersions: updatedPageTemplateList, pageVersion: updatedPageVersion });
        return;
      }
      await client.delete(ENUM_COLLECTIONS.PAGE_TEMPLATES, pageVersion._id);
      const updatedPageTemplateList = get().pageTemplateVersions.filter(
        (template) => template._id !== pageVersion._id
      );

      set({ pageTemplateVersions: updatedPageTemplateList, pageVersion: getMasterPublishedVersion || null });
    },
    onDuplicatePageVersion: async () => {
      const pageVersion = get().pageVersion;
      if (!pageVersion?.masterTemplateId) return;
      const newVersion = pageVersion.version + 1;
      const generateDefaultPageVersion = generatePageVersion(
        pageVersion.masterTemplateId,
        newVersion
      );
      const newPageVersion: IPageTemplateVersion = {
        ...generateDefaultPageVersion,
        vdom: pageVersion.vdom
      };
      await client.create<IPageTemplateVersion>(
        ENUM_COLLECTIONS.PAGE_TEMPLATES,
        newPageVersion
      );
      const pageTemplateList = get().pageTemplateVersions;
      const updatedPageTemplateList = [...pageTemplateList, newPageVersion];
      set({ pageVersion: newPageVersion, pageTemplateVersions: updatedPageTemplateList });
    },
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
    onSavePageTemplate: async (silent?: boolean) => {
      const pageVersion = get().pageVersion;
      if (pageVersion) {
        const cleanPageVersion = { ...pageVersion, isDirty: false };
        await client.update(
          ENUM_COLLECTIONS.PAGE_TEMPLATES,
          {
            _id: cleanPageVersion._id
          },
          {
            $set: cleanPageVersion
          }
        );
        const updatedPageTemplateList = get().pageTemplateVersions.map((template) =>
          template._id === cleanPageVersion._id ? cleanPageVersion : template
        );
        set({ pageTemplateVersions: updatedPageTemplateList, pageVersion: cleanPageVersion });
        if (!silent) {

          toast({
            title: 'Saved',
            description: 'Page saved',
            variant: 'success'
          });
        }
      }
    },
    setSelectMasterTemplate: async (masterTemplate: IMasterTemplate) => {
      set({ selectedMasterTemplate: masterTemplate });
    },
    setSelectedPage: async (page: IPage | null) => {
      set({ selectedPage: page, selectedNode: null, pageVersion: null, selectedMasterTemplate: null });
    },
    setOrganizationId: (id: string) => set({ organizationId: id }),
    setWebsite: (website: IWebsite) => set({ website }),
    fetchElementsConfig: async () => {
      const { data } = await client.list<IElementConfig>(ENUM_COLLECTIONS.WEB_APP_ELEMENTS);
      set({ elementsConfig: data || [] });
    },
    onSelectConfig: (config: IElementConfig | null) => set({ elementConfig: config }),
    setDesignMode: (mode: boolean) => set({ designMode: mode }),
    setGridDisplay: (status: boolean) => set({ gridDisplay: status }),
    setSelectedVersionPage: (version: IPageTemplateVersion | null, masterTemplate: IMasterTemplate | null, page: ITreePage | null) => {
      set({ pageVersion: version, selectedPage: page, selectedMasterTemplate: masterTemplate, selectedNode: null });
    },
    onSelectNode: (event: React.MouseEvent, node: IVDOMNode | null) => {
      event.stopPropagation();
      if (node) {
        const elementsConfig = get().elementsConfig;
        const config = elementsConfig.find(
          (el) => el.type === node?.type
        );
        set({ selectedNode: node, elementConfig: config });
      } else {
        set({ selectedNode: null, elementConfig: null });
      }
    },
    onDeleteNode: (nodeId: string | null) => {
      const pageVersion = get().pageVersion;
      if (!nodeId || !pageVersion) return;
      const updatedVDOM = deleteNodeById(pageVersion.vdom, nodeId);
      if (updatedVDOM === null) return;
      set({
        pageVersion: {
          ...pageVersion,
          vdom: updatedVDOM,
          isDirty: true
        }
      });
    },
    onTreeUpdate: (vdom) => {
      if (typeof vdom === 'function') {
        const pageVersion = get().pageVersion;
        if (!pageVersion) return;
        const updatedVDOM = vdom(pageVersion.vdom);
        set({
          pageVersion: {
            ...pageVersion,
            vdom: updatedVDOM,
            isDirty: true,
            hasUnpublishedChanges: pageVersion.published ? true : pageVersion.hasUnpublishedChanges
          }
        });
        return;
      }
      const pageVersion = get().pageVersion;
      const root = pageVersion?.vdom;
      if (!root) return;
      set({
        pageVersion: {
          ...pageVersion,
          vdom: vdom,
          isDirty: true,
          hasUnpublishedChanges: pageVersion.published ? true : pageVersion.hasUnpublishedChanges
        },
      });
    },
    onUpdateNodeProperty: (value: Record<string, any>, isContext: boolean, rootParams?: boolean) => {
      const pageVersion = get().pageVersion;
      const selectedNodeId = get().selectedNode?._id;
      if (!selectedNodeId || !pageVersion) return;

      const updatedVDOM = updateNodeById(pageVersion.vdom, selectedNodeId, (node) => {
        if (rootParams) {
          const updatedvDom = { ...node, ...value };
          return updatedvDom;
        }
        if (isContext) {
          const updatedvDom = { ...node, context: { ...node.context, ...value } };
          return updatedvDom;
        }
        return { ...node, props: { ...node.props, ...value } };
      });
      let updatedStatePageVersions = {
        ...pageVersion,
        vdom: updatedVDOM,
        isDirty: true
      }
      if (pageVersion.published) {
        updatedStatePageVersions = {
          ...updatedStatePageVersions,
          hasUnpublishedChanges: true,
        }
      }
      set({ pageVersion: updatedStatePageVersions });
    },
    onAppendAiToPage: (value: IVDOMNode) => {
      const pageVersion = get().pageVersion;
      const selectedNode = get().selectedNode;
      if (!pageVersion) return;
      if (selectedNode) {
        const updatedVDOM = updateNodeById(pageVersion.vdom, selectedNode._id, (node) => {
          const children = node?.children as IVDOMNode[] || [];
          return { ...node, children: [...children, value] };
        });
        set({
          pageVersion: {
            ...pageVersion,
            vdom: updatedVDOM,
            isDirty: true
          }
        });
        return;
      }
      const updatedVDOM = { ...pageVersion.vdom, children: [...pageVersion.vdom.children, value] };
      set({
        pageVersion: {
          ...pageVersion,
          vdom: updatedVDOM,
          isDirty: true
        }
      });
    },
    onAddComponent: (component: ENUM_COMPONENTS) => {
      const pageVersion = get().pageVersion;
      if (!pageVersion) return;
      const config =
        get().elementsConfig.find((el) => el.type === component) || null;

      if (!config) return;

      const setNewVdomId = (vdom: IVDOMNode) => {
        let updatedVdom = { ...vdom, _id: nanoid() };
        if (Array.isArray(updatedVdom?.children)) {
          updatedVdom = {
            ...updatedVdom,
            children: updatedVdom.children.map((child) =>
              setNewVdomId(child)
            )
          }
        }
        return updatedVdom
      };
      const newElement: IVDOMNode = { ...setNewVdomId(config.vdom) };
      const selectedNodeId = get().selectedNode?._id;
      const vdom = pageVersion.vdom;

      if (!vdom) return;
      let updatedVDOM = { ...vdom, children: vdom.children || [] };

      if (Array.isArray(updatedVDOM?.children)) {
        if (selectedNodeId) {
          const targetNode = findNodeById(updatedVDOM, selectedNodeId);
          if (targetNode && !targetNode.inline) {
            updatedVDOM = updateNodeById(updatedVDOM, selectedNodeId, (node) => {
              const children = node?.children as IVDOMNode[] || [];
              return { ...node, children: [...children, newElement] };
            });
          } else {
            updatedVDOM?.children.push(newElement);
          }
        } else {
          updatedVDOM.children.push(newElement);
        }
      }
      set({
        pageVersion: {
          ...pageVersion,
          vdom: updatedVDOM,
          isDirty: true,
          hasUnpublishedChanges: pageVersion.published ? true : pageVersion.hasUnpublishedChanges
        },
        elementConfig: config,
        selectedNode: newElement
      });
    },
    onPublish: async () => {
      const pageVersion = get().pageVersion;
      if (!pageVersion) return;

      try {
        await client.updateMany(
          ENUM_COLLECTIONS.PAGE_TEMPLATES,
          { masterTemplateId: pageVersion.masterTemplateId, published: true },
          { $set: { published: false } }
        );

        const updatePublishedVersion: IPageTemplateVersion = {
          ...pageVersion,
          published: true,
          hasBeenPublished: true,
          hasUnpublishedChanges: false,
          isDirty: false
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
              publishedVersion: updatePublishedVersion,
              forceUpdate: pageVersion.forceUpdate
            }
          }
        );
        const previousPageVersion = get().pageTemplateVersions;
        const updatedVersions = [...previousPageVersion]
          .reduce((acc: IPageTemplateVersion[], version) => {
            if (version.masterTemplateId !== pageVersion.masterTemplateId) {
              return [...acc, version];
            }
            if (version._id === pageVersion._id) {
              return [...acc, updatePublishedVersion];
            }
            return [...acc, { ...version, published: false }];
          }, []);
        toast({
          title: 'Published',
          description: 'Page has been published',
          variant: 'success'
        });
        let updatedState: PageBuilderState = {
          ...get(),
          pageVersion: updatePublishedVersion,
          pageTemplateVersions: updatedVersions
        }
        // Don't forget to update the selected master template ui
        const updatedMasterTemplate = get().selectedMasterTemplate;
        if (updatedMasterTemplate) {
          updatedState = {
            ...updatedState,
            selectedMasterTemplate: {
              ...updatedMasterTemplate,
              publishedVersion: updatePublishedVersion,
            },
          }
        }
        set(updatedState);
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive'
        });
      }

    },
    addPage: (page: IPage) => {
      const pages = get().pages;
      set({ pages: [...pages, page] })
    },
    onEditPage: (page: IPage) => {
      const pages = get().pages;
      const updatedPages = pages.map((prevPage) => prevPage._id === page._id ? page : prevPage);
      set({ pages: updatedPages })
    }
  }))
}
