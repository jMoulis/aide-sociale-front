import Button from '@/components/buttons/Button';
import { usePageBuilderStore } from './usePageBuilderStore';

function PageTemplateVersionsList() {
  const setSelectedVersionPage = usePageBuilderStore(
    (state) => state.setSelectedVersionPage
  );
  const selectedVersionPage = usePageBuilderStore((state) => state.pageVersion);
  const pageTemplateVersions = usePageBuilderStore(
    (state) => state.pageTemplateVersions
  );

  return (
    <>
      {pageTemplateVersions.length && !selectedVersionPage ? (
        <ul>
          {pageTemplateVersions.map((pageTemplateVersion) => (
            <li key={pageTemplateVersion._id}>
              <Button
                onClick={() => setSelectedVersionPage(pageTemplateVersion)}>
                {pageTemplateVersion.version}
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}
export default PageTemplateVersionsList;
