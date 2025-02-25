'use server';

import { AsyncPayloadMap, IPage, IUser } from "@/lib/interfaces/interfaces";
import clientMongoServer from "@/lib/mongo/initMongoServer";
import { ENUM_COLLECTIONS } from "@/lib/mongo/interfaces";
import { IMasterTemplate } from "@/lib/TemplateBuilder/interfaces";
import { getServerSideCurrentUserOrganizationId, hasPermissions } from "@/lib/utils/auth/serverUtils";
import { notFound } from "next/navigation";
import { ENUM_COMPONENTS, IVDOMNode } from "../admin/my-app/components/interfaces";
import { FormType } from "../admin/my-app/components/Builder/Components/FormContext";
import { mergePermissions } from "@/lib/utils/auth/utils";
import { isValidJSON } from "@/lib/utils/utils";
import { matchRoute } from "./matchRouter";

export const fetchTemplateVersions = async (templateId: string, user: IUser) => {
  const { data: masterTemplates } = await clientMongoServer.list<IMasterTemplate>(
    ENUM_COLLECTIONS.TEMPLATES_MASTER,
    { _id: templateId, roles: { $in: user.roles.map((role) => role._id) } }
  );
  if (!masterTemplates?.length) {
    notFound();
  }
  return masterTemplates.filter((masterTemplate) => !!masterTemplate.publishedVersion);
};
export const resolveTemplates = async (page: IPage, user: IUser) => {
  const permissions = mergePermissions(user?.roles || []);
  const masterTemplateIds = page.masterTemplateIds;
  if (!masterTemplateIds?.length) {
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
export async function getPublishedMasterTemplates({ slug, user, templateSearch }: { slug: string[], user: IUser, templateSearch?: string | null }) {
  // const { rootRoute, childRoute } = isDetailPage(slug);
  const organizationId = await getServerSideCurrentUserOrganizationId();
  if (!organizationId) {
    notFound();
  }
  try {
    const { page, params } = await matchRoute(slug, organizationId);
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

const extractAndReplacePlaceholders = (query: string | null, systemParams: Record<string, string>): Record<string, any> | null => {
  if (!query) return null;
  const placeholders = query.match(/{{:([a-zA-Z0-9]+)}}/g);
  if (!placeholders) {
    if (isValidJSON(query)) {
      return JSON.parse(query);
    }
    return null;
  }
  const queryBuilt = placeholders.reduce((acc, placeholder) => {
    const key = placeholder.replace(/{{:|}}/g, '');
    return acc.replace(placeholder, systemParams[key]);
  }, query);

  if (isValidJSON(queryBuilt)) {
    return JSON.parse(queryBuilt);
  }
  return null;
};

const getParamValue = (param: string, systemParams: Record<string, string>, routeParams: Record<string, string>, staticDataOptions?: string[]) => {
  if (systemParams[param]) {
    return systemParams[param];
  }
  return routeParams[param] || staticDataOptions?.find((option) => option === param);
}

// This function recursively traverses the vDOM and builds the payload map.
export const collectAsyncPayloads = async (
  vdom: IVDOMNode,
  routeParams: Record<string, string>,
  systemParams: Record<string, string>
): Promise<AsyncPayloadMap> => {
  const resultMap: AsyncPayloadMap = {
    forms: {},
    lists: {}
  };

  const listTypeComponents = [ENUM_COMPONENTS.LIST, ENUM_COMPONENTS.RADIO, ENUM_COMPONENTS.SELECT];
  // Recursive helper function.
  const traverse = async (node: IVDOMNode) => {
    const dataset = node.context?.dataset;
    const query = extractAndReplacePlaceholders(dataset?.connexion?.query || null, systemParams);

    if (listTypeComponents.includes(node.type) && dataset) {
      if (
        dataset.collectionSlug &&
        dataset.connexion?.externalDataOptions?.labelField &&
        dataset.connexion?.externalDataOptions?.valueField
      ) {
        const { collectionSlug } = dataset.connexion.externalDataOptions;
        if (query) {
          const { data } = await clientMongoServer.list<FormType>(
            collectionSlug as ENUM_COLLECTIONS,
            query
          );
          if (data) {
            resultMap.lists[collectionSlug] = data;
          }
        }
      } else if (query) {
        await clientMongoServer
          .list<FormType>(dataset.collectionSlug as ENUM_COLLECTIONS, query)
          .then(({ data }) => {
            if (data) {
              resultMap.lists[dataset.collectionSlug] = data;
            }
          });
      }
    } else if (dataset) {
      const { collectionSlug, connexion } = dataset;
      if (collectionSlug && connexion) {
        const { routeParam } = connexion;
        const param = getParamValue(routeParam as string, systemParams, routeParams, connexion.staticDataOptions);

        if (param) {
          try {
            const { data: form } = await clientMongoServer.get<FormType>(
              collectionSlug as ENUM_COLLECTIONS,
              { _id: param }
            );
            if (form) {
              resultMap.forms[collectionSlug] = form;
            }
          } catch (error) {
            console.error(`Error fetching data for node ${node._id}:`, error);
          }
        }
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