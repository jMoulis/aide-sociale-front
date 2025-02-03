'use server';

import { IPage, IWebsite } from "@/lib/interfaces/interfaces";
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

const fetchTemplateVersion = async (templateId: string) => {
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

export async function getPublishedTemplateVersion({ slug }: { slug: string[] }) {
  const { rootRoute, childRoute } = isDetailPage(slug);
  const organizationId = await getServerSideCurrentUserOrganizationId();
  try {
    const { data: organizationApp } = await clientMongoServer.get<IWebsite>(
      ENUM_COLLECTIONS.WEBSITES,
      {
        organizationId,
        published: true
      }
    );

    if (!organizationApp) {
      throw {
        status: 404,
        message: 'Organization not found'
      }
    }
    const { data: pages } = await clientMongoServer.list<IPage>(ENUM_COLLECTIONS.PAGES, {
      websiteId: organizationApp._id
    });

    const page = (pages || []).find((page) => page.route === `${rootRoute}`);
    if (!page) {
      throw {
        status: 404,
        message: 'No page found'
      }
    }
    const resolveTemplate = async (page: IPage) => {
      const masterTemplateId = page.masterTemplateId;
      if (!masterTemplateId) {
        throw { status: 404, message: 'No master template id found' };
      }
      return fetchTemplateVersion(masterTemplateId);
    };

    // if (childRoute && page.subPages) {
    //   const subRoute = findSubRoute(page.subPages, childRoute);
    //   if (!subRoute) {
    //     throw { status: 404, message: 'No sub route found' };
    //   }
    //   const publishedTemplateVersion = await resolveTemplate(subRoute);
    //   return { page, publishedTemplateVersion };
    // }

    const publishedTemplateVersion = await resolveTemplate(page);
    return { page, publishedTemplateVersion };
  } catch (error) {
    throw error;
  }
}
