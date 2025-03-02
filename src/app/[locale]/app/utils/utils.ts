'use server';

import { AsyncPayloadMap, IPage, IStore, IUser } from "@/lib/interfaces/interfaces";
import clientMongoServer from "@/lib/mongo/initMongoServer";
import { ApiResponse, ENUM_COLLECTIONS } from "@/lib/mongo/interfaces";
import { IMasterTemplate } from "@/lib/TemplateBuilder/interfaces";
import { getServerSideCurrentUserOrganizationId, hasPermissions } from "@/lib/utils/auth/serverUtils";
import { notFound } from "next/navigation";
import { ENUM_COMPONENTS, IVDOMNode } from "../../admin/my-app/components/interfaces";
import { FormType } from "../../admin/my-app/components/Builder/Components/FormContext";
import { mergePermissions } from "@/lib/utils/auth/utils";
import { isValidJSON } from "@/lib/utils/utils";
import { matchRoute } from "../matchRouter";
import { IQuery } from "@/lib/interfaces/interfaces";
import { getMethod } from "./sharedUtils";

export const fetchTemplateVersions = async (templateId: string, user: IUser) => {
  const { data: masterTemplates } = await clientMongoServer.list<IMasterTemplate>(
    ENUM_COLLECTIONS.TEMPLATES_MASTER,
    { _id: templateId, roles: { $in: user.roles.map((role) => role._id) } }
  );
  if (!masterTemplates?.length) {
    console.warn('No master templates found for user roles', templateId);
    notFound();
  }
  return masterTemplates.filter((masterTemplate) => !!masterTemplate.publishedVersion);
};
export const resolveTemplates = async (page: IPage, user: IUser) => {
  const permissions = mergePermissions(user?.roles || []);
  const masterTemplateIds = page.masterTemplateIds;
  if (!masterTemplateIds?.length) {
    console.warn('No master templates found for page', page);
    notFound();
  }
  const masterTemplates = await Promise.all(
    masterTemplateIds.map((masterTemplateId) => fetchTemplateVersions(masterTemplateId, user))
  );
  // Flatten the array of templates
  const flatTemplates = masterTemplates.flat();

  // Check permissions asynchronously and map to template or null
  const allowedTemplatesPromises = flatTemplates.map(async (masterTemplate) => {
    const isAllowed = await hasPermissions(
      permissions[page.slug],
      masterTemplate?.mandatoryPermissions || [],
      true
    );
    return isAllowed ? masterTemplate : null;
  });

  const allowedTemplates = await Promise.all(allowedTemplatesPromises);
  const filteredTemplates = allowedTemplates.filter(Boolean) as IMasterTemplate[];

  return filteredTemplates.reduce((acc: IMasterTemplate[], masterTemplate) => {
    if (masterTemplate.publishedVersion) {
      acc.push(masterTemplate);
    }
    return acc;
  }, []);
};
export async function getPublishedMasterTemplates({ slug, user, templateSearch, websiteId }: { websiteId: string, slug: string[], user: IUser, templateSearch?: string | null }) {
  // const { rootRoute, childRoute } = isDetailPage(slug);
  const organizationId = await getServerSideCurrentUserOrganizationId();
  if (!organizationId) {
    console.warn('No organization found for user', user);
    notFound();
  }
  try {
    const { page, params } = await matchRoute(slug, organizationId, websiteId);
    // Check is user can access to route page. (in roles admin page)
    if (!page) {
      console.warn('No page found for slug', slug);
      notFound();
    }

    const permissions = mergePermissions(user?.roles || []);
    if (!permissions[page?.slug]?.length) {
      console.error('No permissions found for page', page);
      notFound();
    }
    const publishedMasterTemplateVersions = await resolveTemplates(page, user);

    if (templateSearch) {
      const masterTemplate = publishedMasterTemplateVersions.find((masterTemplate) => masterTemplate.publishedVersion?._id === templateSearch);

      if (!masterTemplate) {
        console.warn('No template found for slug', slug);
        notFound();
      }
      return { templates: [masterTemplate], routeParams: params };
    }
    return { templates: publishedMasterTemplateVersions, routeParams: params };
  } catch (error) {
    throw error;
  }
}



// Helper function to recursively replace placeholders in any value.

const extractAndReplacePlaceholders = (query: string | null, systemParams: Record<string, string>): Promise<ApiResponse<any> | null> | null => {
  if (!query) return null;

  if (isValidJSON(query)) {
    const queryParsed = JSON.parse(query) as IQuery;
    const data = {};
    const method = getMethod(clientMongoServer, queryParsed, data, systemParams);

    return method;
  }
  return null;
};

const getParamValue = (param: string, systemParams: Record<string, string>, routeParams: Record<string, string>) => {
  if (systemParams[param]) {
    return systemParams[param];
  }
  return routeParams[param];
}

const getStoreData = async (store: IStore, systemParams: Record<string, string>, routeParams: Record<string, string>): Promise<{ store: IStore, form: FormType | null } | null> => {
  const { routeParam, collection } = store;

  if (!collection?.name) {
    if (!store?.virtual) {
      console.warn('No collection found for store', store?.slug);
      return null;
    }
    // Virtual store no db persistence
    return {
      store,
      form: {} as FormType
    };
  };


  const param = getParamValue(routeParam as string, systemParams, routeParams);

  if (!param) {
    console.info('No param found for store', store?.slug);
    return {
      store,
      form: {} as FormType
    };
  };

  try {
    const { data: form } = await clientMongoServer.get<FormType>(
      collection.slug as ENUM_COLLECTIONS,
      { _id: param }
    );

    return {
      store,
      form
    };
  } catch (error) {
    console.error(`Error fetching data for node:`, error);
    return null;
  };
}
// This function recursively traverses the vDOM and builds the payload map.
export const collectAsyncPayloads = async (
  vdom: IVDOMNode,
  routeParams: Record<string, string>,
  systemParams: Record<string, string>,
  stores: IStore[] = []
): Promise<AsyncPayloadMap> => {
  const resultMap: AsyncPayloadMap = {

  };

  if (stores.length) {
    await Promise.all(stores.map(async (store) => {
      const storeData = getStoreData(store, systemParams, routeParams);
      if (storeData) {
        resultMap[store.slug] = await storeData || {} as any;
      }
    }));
  }

  const listTypeComponents = [ENUM_COMPONENTS.LIST, ENUM_COMPONENTS.RADIO, ENUM_COMPONENTS.SELECT];
  // Recursive helper function.
  const traverse = async (node: IVDOMNode) => {
    const dataset = node.context?.dataset;
    const query = await extractAndReplacePlaceholders(dataset?.connexion?.input?.query || null, systemParams);

    if (listTypeComponents.includes(node.type) && dataset) {
      if (
        dataset.connexion?.input?.externalDataOptions?.collectionSlug &&
        dataset.connexion?.input?.externalDataOptions?.labelField &&
        dataset.connexion?.input?.externalDataOptions?.valueField
      ) {
        const { collectionSlug } = dataset.connexion.input?.externalDataOptions;
        if (query?.data) {
          resultMap[collectionSlug] = query.data;
        }
      } else if (query?.data && dataset.connexion?.input?.storeId) {
        const store = stores.find((store) => store.slug === dataset.connexion?.input?.storeId) as IStore || {};
        resultMap[dataset.connexion?.input?.storeId] = {
          store,
          data: query.data
        };
      }
    }
    // Process all children recursively.
    if (node.children && Array.isArray(node.children)) {
      await Promise.all(node.children.map((child) => traverse(child)));
    }
  };

  await traverse(vdom);

  return resultMap;
};