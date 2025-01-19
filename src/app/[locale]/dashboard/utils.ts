'use server';

import { IPageTemplateVersion, IWebsite } from "@/lib/interfaces/interfaces";
import clientMongoServer from "@/lib/mongo/initMongoServer";
import { ENUM_COLLECTIONS } from "@/lib/mongo/interfaces";
import { IMasterTemplate } from "@/lib/TemplateBuilder/interfaces";
import { getServerSideCurrentUserOrganizationId } from "@/lib/utils/auth/serverUtils";

const KNOWN_LOCALES = ['en', 'fr', 'es', 'de']; // etc.

const isDetailPage = (slug: string[]) => {
  // 1. Copy the original slug so we don’t mutate the caller’s array.
  const tempSlug = [...slug];

  // 2. If the first segment is a known locale, remove it.
  //    e.g. /en/customers/123 => slug = ["en", "customers", "123"]
  //        after shift => ["customers", "123"]
  // if (KNOWN_LOCALES.includes(tempSlug[0])) {
  //   tempSlug.shift();
  // }

  // 3. Now apply your detail/list logic to the updated array.
  if (tempSlug.length < 1) {
    // No meaningful segments left
    return {
      route: '',
      isDetail: false
    };
  }

  console.log(tempSlug)
  // If there’s only 1 segment left, that’s our collection.
  if (tempSlug.length === 1) {
    return {
      route: tempSlug[0],
      isDetail: false
    };
  }

  // Otherwise, assume the last one is a document ID, and the one before is the collection.
  const route = tempSlug[tempSlug.length - 2];
  const documentId = tempSlug[tempSlug.length - 1];
  console.log(route, documentId)
  return {
    route,
    isDetail: true,
    documentId
  };
};


export async function getPublishedTemplateVersion({ slug }: { slug: string[] }) {

  const { route } = isDetailPage(slug);
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
    console.log(route)
    const page = organizationApp.pages.find((p) => p.route === slug.join('/'));
    if (!page) {
      throw {
        status: 404,
        message: 'No page found'
      }
    }
    const masterTemplateId = page?.masterTemplates?.[0];
    if (!masterTemplateId) {
      throw {
        status: 404,
        message: 'No master template id found'
      }
    }
    const { data: masterTemplate } = await clientMongoServer.get<IMasterTemplate>(
      ENUM_COLLECTIONS.TEMPLATES_MASTER,
      {
        _id: masterTemplateId
      }
    );
    if (!masterTemplate) {
      throw {
        status: 404,
        message: 'No master template found'
      }
    }
    if (!masterTemplate?.publishedVersionId) {
      throw {
        status: 404,
        message: 'No published version id found'
      }
    }
    const { data: publishedTemplateVersion } =
      await clientMongoServer.get<IPageTemplateVersion>(
        ENUM_COLLECTIONS.PAGE_TEMPLATES,
        {
          _id: masterTemplate.publishedVersionId
        }
      );
    if (!publishedTemplateVersion) {
      throw {
        status: 404,
        message: 'No published template version found'
      }
    }
    return { page, publishedTemplateVersion };
  } catch (error) {
    throw error;
  }
}
/**
 * import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [],
    prefix: "u-",
  safelist: [
      // Spacing (margin + padding).
    // e.g.: m-0, mt-2, mx-4, p-5, px-2, etc.
    { pattern: /^m([trblxy]?)-(\d+|auto|px)$/ },
    { pattern: /^p([trblxy]?)-(\d+|auto|px)$/ },

    // Flexbox.
    // e.g.: flex, inline-flex, flex-col, items-center, justify-between, gap-2, etc.
    { pattern: /^(flex|inline-flex)$/ },
    { pattern: /^flex-(row|col|wrap|nowrap|wrap-reverse)$/ },
    { pattern: /^items-(start|center|end|baseline|stretch)$/ },
    { pattern: /^justify-(start|center|end|between|around|evenly)$/ },
    { pattern: /^gap-(\d+|px)$/ },
    { pattern: /^flex-(\d)$/ },

    // Display / Position.
    { pattern: /^(block|inline-block|inline|grid|inline-grid)$/ },
    { pattern: /^(absolute|relative|fixed|sticky)$/ },

    // Width / Height / Min / Max (limited numeric scale example).
    { pattern: /^w-(\d+|auto|px|full|screen)$/ },
    { pattern: /^h-(\d+|auto|px|full|screen)$/ },
    { pattern: /^(min-w|min-h|max-w|max-h)-(\d+|full|screen)$/ },

    // Typography: text-size, font-weight, leading, etc.
    { pattern: /^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl)$/ },
    { pattern: /^font-(thin|extralight|light|normal|medium|semibold|bold|black)$/ },
    { pattern: /^leading-(none|tight|snug|normal|relaxed|loose)$/ },

    // Borders / Roundness.
    { pattern: /^border(-\d+)?$/ },
    { pattern: /^border-(solid|dashed|dotted|double|none)$/ },
    { pattern: /^border-(\w+)-(\d+)$/ }, // e.g. border-red-500 (depends on your color scale)
    { pattern: /^rounded(-(none|sm|md|lg|xl|2xl|3xl|full))?$/ },

    // Shadows.
    { pattern: /^shadow(-(sm|md|lg|xl|2xl|inner))?$/ },

    // Background colors (limited to certain palette slices).
    {
      pattern: /^bg-(red|green|blue|gray|indigo|yellow)-(100|200|300|400|500|600|700|800|900)$/,
    },

    // Text colors (similarly limited).
    {
      pattern: /^text-(red|green|blue|gray|indigo|yellow)-(100|200|300|400|500|600|700|800|900)$/,
    },

    // (Optional) Hover/focus states for some categories
    // e.g. hover:bg-blue-500, focus:bg-blue-500
    {
      pattern: /^hover:(bg|text)-(red|green|blue|gray|indigo|yellow)-(100|200|300|400|500|600|700|800|900)$/,
    },
    {
      pattern: /^focus:(bg|text)-(red|green|blue|gray|indigo|yellow)-(100|200|300|400|500|600|700|800|900)$/,
    },
  ],
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/aspect-ratio'),
    require('tailwindcss-animate'), // 3rd party
  ],
} satisfies Config;

 */