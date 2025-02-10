import { useEffect, useState } from "react";
import { usePageBuilderStore } from "../stores/pagebuilder-store-provider";
import { useCssLive } from "../stores/useCssLive";
import { IStylesheet } from "@/lib/interfaces/interfaces";

export const useInitializeBuilder = () => {
  const [loading, setLoading] = useState<{ elements: boolean, stylesheets: boolean, parentStylesheets: boolean }>({
    elements: false,
    stylesheets: false,
    parentStylesheets: false
  });
  const setDynamicStyles = useCssLive((state) => state.setDynamicStyles);
  const setParentStylesheets = useCssLive((state) => state.setParentStylesheets);
  const website = usePageBuilderStore((state) => state.website);
  const selectedPage = usePageBuilderStore((state) => state.selectedPage);
  const [init, setInit] = useState(false);

  const fetchElements = usePageBuilderStore(
    (state) => state.fetchElementsConfig
  );
  const fetchStylesheets = async (stylesheets: IStylesheet[]) => {
    setLoading((prev) => ({ ...prev, stylesheets: true }));
    const payload = await Promise.all(
      stylesheets?.map(async (stylesheet) => {
        const res = await fetch(stylesheet.uri);
        return {
          name: stylesheet.name,
          style: await res.text()
        };
      })
    );
    setDynamicStyles(payload);
    setTimeout(() => {
      setLoading((prev) => ({ ...prev, stylesheets: false }));
    }, 500)
  };
  useEffect(() => {
    setLoading((prev) => ({ ...prev, elements: true }));
    fetchElements().finally(() => setLoading((prev) => ({ ...prev, elements: false })));
  }, [fetchElements]);

  useEffect(() => {
    if (init) return;
    setInit(true);
    const contextualStylesheets = ['utils', 'main', selectedPage?.name];
    const stylesheetsToFetch =
      website?.stylesheets?.filter((stylesheet) =>
        contextualStylesheets.includes(stylesheet.name)
      ) || [];
    fetchStylesheets(stylesheetsToFetch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPage?.name, website?.stylesheets, init]);

  useEffect(() => {
    setLoading((prev) => ({ ...prev, parentStylesheets: true }));
    const parentStylesheets =
      Array.from(document.head.querySelectorAll('link[rel="stylesheet"]')).map(
        (el) => el.cloneNode(true) as HTMLLinkElement
      ).reduce((acc: string[], el: HTMLLinkElement) => el.href ? [...acc, el.href] : acc, []);
    setParentStylesheets(parentStylesheets);
    setTimeout(() => {
      setLoading((prev) => ({ ...prev, parentStylesheets: false }));
    }, 500)
  }, [setParentStylesheets]);
  return Object.values(loading).some((loading) => loading);
};