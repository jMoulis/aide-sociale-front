'use server';

import { AsyncPayloadMap, IPage, IUser } from "@/lib/interfaces/interfaces";
import clientMongoServer from "@/lib/mongo/initMongoServer";
import { ENUM_COLLECTIONS } from "@/lib/mongo/interfaces";
import { IMasterTemplate } from "@/lib/TemplateBuilder/interfaces";
import { getServerSideCurrentUserOrganizationId, hasPermissions } from "@/lib/utils/auth/serverUtils";
import { notFound } from "next/navigation";
import { pathToRegexp } from "path-to-regexp";
import { ENUM_COMPONENTS, IVDOMNode } from "../my-app/components/interfaces";
import { FormType } from "../my-app/components/Builder/Components/FormContext";
import { mergePermissions } from "@/lib/utils/auth/utils";


export async function matchRoute(segments: string[], organizationId: string) {
  const { data: pages } = await clientMongoServer.list<IPage>(ENUM_COLLECTIONS.PAGES, {
    organizationId,
  });
  if (!pages) {
    return {
      page: null,
      params: {}
    };
  }
  const path = `${segments.join("/")}`;
  for (const page of pages) {
    const { regexp, keys } = pathToRegexp(page.route);
    const match = regexp.exec(path);

    if (match) {
      // Extract dynamic parameters
      const params = keys.reduce((acc: any, key, index) => {
        acc[key.name] = match[index + 1];
        return acc;
      }, {});
      return { page, params };
    }
  }
  return { page: null, params: {} };
}
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
    const permissions = mergePermissions(user?.roles || []);
    if (!page) {
      notFound();
    }

    if (!permissions[page?.slug]?.length) {
      console.error('No permissions found for page', page);
      notFound();
    }

    const publishedMasterTemplateVersions = await resolveTemplates(page, user);

    if (templateSearch) {
      const masterTemplate = publishedMasterTemplateVersions.find((masterTemplate) => masterTemplate.publishedVersion?._id === templateSearch);

      if (!masterTemplate) {
        notFound();
      }
      return { templates: [masterTemplate], routeParams: params };
    }
    return { templates: publishedMasterTemplateVersions, routeParams: params };
  } catch (error) {
    throw error;
  }
}



// This function recursively traverses the vDOM and builds the payload map.
export const collectAsyncPayloads = async (
  vdom: IVDOMNode,
  routeParams: Record<string, string>
): Promise<AsyncPayloadMap> => {
  const resultMap: AsyncPayloadMap = {
    forms: {},
    lists: {}
  };

  const listTypeComponents = [ENUM_COMPONENTS.LIST, ENUM_COMPONENTS.RADIO];
  // Recursive helper function.
  const traverse = async (node: IVDOMNode) => {
    const dataset = node.context?.dataset;

    if (listTypeComponents.includes(node.type) && dataset) {
      if (
        dataset.collectionSlug &&
        dataset.connexion?.externalDataOptions?.labelField &&
        dataset.connexion?.externalDataOptions?.valueField
      ) {
        const { collectionSlug } = dataset.connexion.externalDataOptions;

        const { data } = await clientMongoServer.list<FormType>(
          collectionSlug as ENUM_COLLECTIONS
        );

        if (data) {
          resultMap.lists[collectionSlug] = data;
        }
      } else {
        await clientMongoServer
          .list<FormType>(dataset.collectionSlug as ENUM_COLLECTIONS)
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
        const param = routeParam ? routeParams[routeParam] : undefined;
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