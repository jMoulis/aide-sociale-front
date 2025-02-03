import { isValidJSON } from '@/lib/utils/utils';
import { createTailwindcss } from '@mhsdesign/jit-browser-tailwindcss';
import { create } from 'zustand'
import { IWebsite } from '@/lib/interfaces/interfaces';
import { extractClassSelectorsFromString } from '../utils';

interface PageBuilderContextProps {
  pageStyle: string;
  websiteStyle: string;
  utilsStyle: string;
  classSelectors: string[];
  tailwindStyles: string;
  setPageStyle: (style: string) => void;
  setWebsiteStyle: (style: string) => void;
  setTailwindStyles: (website: IWebsite, content: string) => void;
  setUtilsStyle: (style: string) => void;
}
export const useCssLive = create<PageBuilderContextProps>((set, _get) => ({
  pageStyle: '',
  websiteStyle: '',
  tailwindStyles: '',
  utilsStyle: '',
  classSelectors: [],
  setPageStyle: (style: string) => set({ pageStyle: style }),
  setWebsiteStyle: (style: string) => set({ websiteStyle: style }),
  setTailwindStyles: (website: IWebsite, content: string) => {
    const tailwindConfig = isValidJSON(website.tailwindConfig || '')
      ? JSON.parse(website.tailwindConfig as string)
      : {};
    const tailwindcss = createTailwindcss({
      tailwindConfig: {
        ...tailwindConfig,
        corePlugins: { preflight: false }
      }
    });
    tailwindcss
      .generateStylesFromContent(
        `
  @tailwind components;
  @tailwind utilities;
  `,
        [content]
      )
      .then((css) => {
        set({ tailwindStyles: css });
      });
  },
  setUtilsStyle: (style: string) => {
    const classSelectors = extractClassSelectorsFromString(style);
    set({ utilsStyle: style, classSelectors })
  }
}))
