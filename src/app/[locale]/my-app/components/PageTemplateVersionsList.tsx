import Button from '@/components/buttons/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faGlobe } from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { usePageBuilderStore } from './stores/pagebuilder-store-provider';
import client from '@/lib/mongo/initMongoClient';
import { IPageTemplateVersion } from '@/lib/interfaces/interfaces';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { generatePageVersion } from './generators';
import { useMemo } from 'react';
import { IMasterTemplate } from '@/lib/TemplateBuilder/interfaces';

type Props = {
  masterTemplate: IMasterTemplate | null;
};
function PageTemplateVersionsList({ masterTemplate }: Props) {
  const setSelectedVersionPage = usePageBuilderStore(
    (state) => state.setSelectedVersionPage
  );
  const onAddPageTemplateVersion = usePageBuilderStore(
    (state) => state.onAddPageTemplateVersion
  );
  const selectedVersionPage = usePageBuilderStore((state) => state.pageVersion);

  const templateVersions = usePageBuilderStore(
    (state) => state.pageTemplateVersions
  );
  const publishedVersion = masterTemplate?.publishedVersion;

  const pageTemplateVersions = useMemo(() => {
    return templateVersions.filter(
      (templateVersion) =>
        templateVersion.masterTemplateId === masterTemplate?._id
    );
  }, [masterTemplate, templateVersions]);

  const handleCreateVersion = async () => {
    if (!masterTemplate) return null;

    let newVersion = 1;
    try {
      const { data: lastPageTemplateVersion } =
        await client.get<IPageTemplateVersion>(
          ENUM_COLLECTIONS.PAGE_TEMPLATES,
          {
            masterTemplateId: masterTemplate._id
          },
          { sort: { version: -1 } }
        );
      newVersion = (lastPageTemplateVersion?.version || newVersion) + 1;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('error', error);
    }

    const pageTemplateVersion: IPageTemplateVersion = generatePageVersion(
      masterTemplate._id,
      newVersion
    );
    await client.create<IPageTemplateVersion>(
      ENUM_COLLECTIONS.PAGE_TEMPLATES,
      pageTemplateVersion
    );
    onAddPageTemplateVersion(pageTemplateVersion);
    // fetchPageTemplateVersions();
  };
  return (
    <ul className='ml-2'>
      <li className='flex gap-2 items-center justify-between'>
        <span className='text-sm'>Versions</span>
        <Button onClick={handleCreateVersion}>
          <FontAwesomeIcon icon={faAdd} />
        </Button>
      </li>
      {pageTemplateVersions?.map((pageTemplateVersion) => (
        <li key={pageTemplateVersion._id} className='mt-1'>
          <Button
            className={`w-full ${
              selectedVersionPage?._id === pageTemplateVersion._id
                ? 'bg-black text-white'
                : ''
            }`}
            onClick={() => setSelectedVersionPage(pageTemplateVersion)}>
            <span className='text-sm'>
              Version: {pageTemplateVersion.version}
            </span>
            {publishedVersion?._id === pageTemplateVersion._id ? (
              <FontAwesomeIcon icon={faGlobe} />
            ) : null}
          </Button>
        </li>
      ))}
    </ul>
  );
}
export default PageTemplateVersionsList;
