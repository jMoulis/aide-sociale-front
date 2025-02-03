import { useEffect, useState } from 'react';
import { IVDOMNode } from '../interfaces';
import { usePageBuilderStore } from '../stores/pagebuilder-store-provider';
import { useCssLive } from '../stores/useCssLive';
import { RenderBuilder } from './RenderBuilder';
import PageBuilderSkeleton from './PageBuilderSkeleton';

function Preview() {
  const pageVersion = usePageBuilderStore((state) => state.pageVersion);
  const pageStyle = useCssLive((state) => state.pageStyle);
  const websiteStyle = useCssLive((state) => state.websiteStyle);
  const liveTailwindCss = useCssLive((state) => state.tailwindStyles);
  const website = usePageBuilderStore((state) => state.website);
  const utilsStyle = useCssLive((state) => state.utilsStyle);
  const selectedPage = usePageBuilderStore((state) => state.selectedPage);
  const setPageStyle = useCssLive((state) => state.setPageStyle);
  const setWebsiteStyle = useCssLive((state) => state.setWebsiteStyle);
  const setUtilsStyle = useCssLive((state) => state.setUtilsStyle);
  const [init, setInit] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setInit(true);
    if (!init) {
      setLoading(true);
    }
    const contextualStylesheets = ['utils', 'main', selectedPage?.name];
    const stylesheetsToFetch =
      website?.stylesheets?.filter((stylesheet) =>
        contextualStylesheets.includes(stylesheet.name)
      ) || [];
    Promise.all(
      stylesheetsToFetch?.map(async (stylesheet) => {
        const res = await fetch(stylesheet.uri);
        return {
          name: stylesheet.name,
          style: await res.text()
        };
      })
    )
      .then((stylesheets) => {
        stylesheets.forEach((stylesheet) => {
          switch (stylesheet.name) {
            case 'utils':
              setUtilsStyle(stylesheet.style);
              break;
            case 'main':
              setWebsiteStyle(stylesheet.style);
              break;
            default:
              setPageStyle(stylesheet.style);
              break;
          }
        });
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPage?.name, website?.stylesheets, init]);

  if (loading) return <PageBuilderSkeleton />;

  if (!pageVersion)
    return <h1 className='flex flex-1 justify-center'>Select page version</h1>;

  return (
    <div className='flex flex-1 p-4 overflow-auto'>
      <div className='flex-1' id={`page-${selectedPage?._id}`}>
        <style
          dangerouslySetInnerHTML={{
            __html: `#page-${selectedPage?._id} {${utilsStyle}}`
          }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: websiteStyle
          }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: pageStyle
          }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: liveTailwindCss
          }}
        />
        <RenderBuilder node={pageVersion?.vdom || ({} as IVDOMNode)} />
      </div>
    </div>
  );
}
export default Preview;
