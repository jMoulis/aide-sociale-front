'use server';

import { IPage } from "@/lib/interfaces/interfaces";
import clientMongoServer from "@/lib/mongo/initMongoServer";
import { ENUM_COLLECTIONS } from "@/lib/mongo/interfaces";
import { IMasterTemplate } from "@/lib/TemplateBuilder/interfaces";
import { getServerSideCurrentUserOrganizationId } from "@/lib/utils/auth/serverUtils";
import { notFound } from "next/navigation";
import { pathToRegexp } from "path-to-regexp";
import { IVDOMNode } from "../my-app/components/interfaces";
import { FormType } from "../my-app/components/Builder/Components/FormContext";


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
  const path = `/${segments.join("/")}`;
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
export const fetchTemplateVersion = async (templateId: string) => {
  const { data: template } = await clientMongoServer.get<IMasterTemplate>(
    ENUM_COLLECTIONS.TEMPLATES_MASTER,
    { _id: templateId }
  );
  if (!template) {
    throw { status: 404, message: 'No master template found' };
  }

  if (!template.publishedVersion) {
    throw { status: 404, message: 'No published version id found' };
  }

  return template.publishedVersion;
};
export const resolveTemplate = async (page: IPage) => {
  const masterTemplateId = page.masterTemplateId;
  if (!masterTemplateId) {
    throw { status: 404, message: 'No master template id found' };
  }
  return fetchTemplateVersion(masterTemplateId);
};
export async function getPublishedTemplateVersion({ slug }: { slug: string[] }) {
  // const { rootRoute, childRoute } = isDetailPage(slug);
  const organizationId = await getServerSideCurrentUserOrganizationId();
  try {
    const { page, params } = await matchRoute(slug, organizationId);
    if (!page) {
      notFound();
    }
    const publishedTemplateVersion = await resolveTemplate(page);
    return { template: publishedTemplateVersion, routeParams: params };
    //   const { data: organizationApp } = await clientMongoServer.get<IWebsite>(
    //     ENUM_COLLECTIONS.WEBSITES,
    //     {
    //       organizationId,
    //       published: true
    //     }
    //   );

    //   if (!organizationApp) {
    //     throw {
    //       status: 404,
    //       message: 'Organization not found'
    //     }
    //   }
    //   const { data: pages } = await clientMongoServer.list<IPage>(ENUM_COLLECTIONS.PAGES, {
    //     websiteId: organizationApp._id
    //   });

    //   const page = (pages || []).find((page) => page.route === `${rootRoute}`);
    //   if (!page) {
    //     throw {
    //       status: 404,
    //       message: 'No page found'
    //     }
    //   }


    //   // if (childRoute && page.subPages) {
    //   //   const subRoute = findSubRoute(page.subPages, childRoute);
    //   //   if (!subRoute) {
    //   //     throw { status: 404, message: 'No sub route found' };
    //   //   }
    //   //   const publishedTemplateVersion = await resolveTemplate(subRoute);
    //   //   return { page, publishedTemplateVersion };
    //   // }

    //   const publishedTemplateVersion = await resolveTemplate(page);
    //   return { page, publishedTemplateVersion };
  } catch (error) {
    throw error;
  }
}


type AsyncPayloadMap = Record<string, FormType>;

// This function recursively traverses the vDOM and builds the payload map.
export const collectAsyncPayloads = async (
  vdom: IVDOMNode,
  routeParams: Record<string, string>
): Promise<AsyncPayloadMap> => {
  const resultMap: AsyncPayloadMap = {};

  // Recursive helper function.
  const traverse = async (node: IVDOMNode) => {
    const dataset = node.context?.dataset;

    if (dataset) {
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
              resultMap[collectionSlug] = form;
            }
          } catch (error) {
            // eslint-disable-next-line no-console
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