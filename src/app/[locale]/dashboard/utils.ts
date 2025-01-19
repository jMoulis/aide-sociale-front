'use server';

import { IPage, IPageTemplateVersion, IWebsite } from "@/lib/interfaces/interfaces";
import clientMongoServer from "@/lib/mongo/initMongoServer";
import { ENUM_COLLECTIONS } from "@/lib/mongo/interfaces";
import { IMasterTemplate } from "@/lib/TemplateBuilder/interfaces";
import { getServerSideCurrentUserOrganizationId } from "@/lib/utils/auth/serverUtils";

const isDetailPage = (slug: string[]) => {
  if (slug.length === 0) {
    return { rootRoute: '' };
  }

  if (slug.length === 1) {
    return { rootRoute: slug[0] };
  }

  return {
    rootRoute: slug[slug.length - 2],
    childRoute: slug[slug.length - 1],
  };
};

const findSubRoute = (subRoutes: IPage[], slug: string): IPage | null => {
  return (
    subRoutes.find((sr) => sr.route === slug) ||
    subRoutes.find((sr) => sr.route === '[id]') ||
    null
  );
};
const fetchTemplateVersion = async (templateId: string) => {
  const { data: template } = await clientMongoServer.get<IMasterTemplate>(
    ENUM_COLLECTIONS.TEMPLATES_MASTER,
    { _id: templateId }
  );
  if (!template) {
    throw { status: 404, message: 'No master template found' };
  }

  if (!template.publishedVersionId) {
    throw { status: 404, message: 'No published version id found' };
  }

  const { data: version } = await clientMongoServer.get<IPageTemplateVersion>(
    ENUM_COLLECTIONS.PAGE_TEMPLATES,
    { _id: template.publishedVersionId }
  );

  if (!version) {
    throw { status: 404, message: 'No published template version found' };
  }

  return version;
};
export async function getPublishedTemplateVersion({ slug }: { slug: string[] }) {
  const { rootRoute, childRoute } = isDetailPage(slug);
  const organizationId = await getServerSideCurrentUserOrganizationId();
  try {
    const { data: organizationApp } = await clientMongoServer.get<IWebsite>(
      ENUM_COLLECTIONS.WEBSITES,
      {
        organizationId
      }
    );

    if (!organizationApp) {
      throw {
        status: 404,
        message: 'Organization not found'
      }
    }
    const page = organizationApp.pages.find((p) => p.route === rootRoute);
    if (!page) {
      throw {
        status: 404,
        message: 'No page found'
      }
    }
    const resolveTemplate = async (page: IPage) => {
      const masterTemplateId = page.masterTemplates?.[0];
      if (!masterTemplateId) {
        throw { status: 404, message: 'No master template id found' };
      }
      return fetchTemplateVersion(masterTemplateId);
    };
    if (childRoute && page.subPages) {
      const subRoute = findSubRoute(page.subPages, childRoute);
      if (!subRoute) {
        throw { status: 404, message: 'No sub route found' };
      }
      const publishedTemplateVersion = await resolveTemplate(subRoute);
      return { page, publishedTemplateVersion };
    }

    const publishedTemplateVersion = await resolveTemplate(page);
    return { page, publishedTemplateVersion };
  } catch (error) {
    throw error;
  }
}
