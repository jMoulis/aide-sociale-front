import { useCssLive } from '../stores/useCssLive';

function SceneDynamicStyle() {
  const pageStyle = useCssLive((state) => state.pageStyle);
  const websiteStyle = useCssLive((state) => state.websiteStyle);
  const liveTailwindCss = useCssLive((state) => state.tailwindStyles);
  const utilsStyle = useCssLive((state) => state.utilsStyle);
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: utilsStyle
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
    </>
  );
}
export default SceneDynamicStyle;
