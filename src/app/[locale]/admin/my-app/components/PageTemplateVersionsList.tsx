import Button from '@/components/buttons/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAdd,
  faBoxArchive
} from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { usePageBuilderStore } from './stores/pagebuilder-store-provider';
import client from '@/lib/mongo/initMongoClient';
import { IPageTemplateVersion, ITreePage } from '@/lib/interfaces/interfaces';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { generatePageVersion } from './generators';
import { useMemo } from 'react';
import { IMasterTemplate } from '@/lib/TemplateBuilder/interfaces';
import { PublishedDot } from './PublishedDot';

type Props = {
  masterTemplate: IMasterTemplate | null;
  page: ITreePage;
};
function PageTemplateVersionsList({ masterTemplate, page }: Props) {
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
      console.error('error', error);
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
  const handleSelectPageVersion = (version: IPageTemplateVersion) => {
    setSelectedVersionPage(version, masterTemplate, page);
  };
  return (
    <ul className='ml-2'>
      <li className='gap-2 items-center justify-between'>
        <Button
          className='w-full justify-between'
          onClick={handleCreateVersion}>
          <span className='text-xs '>Versions</span>
          <FontAwesomeIcon icon={faAdd} />
        </Button>
        <ul className='ml-4'>
          {pageTemplateVersions?.map((pageTemplateVersion) => (
            <li key={pageTemplateVersion._id} className='mt-1'>
              <Button
                className={`w-full justify-between ${
                  pageTemplateVersion.archived
                    ? 'bg-indigo-500 text-white'
                    : selectedVersionPage?._id === pageTemplateVersion._id
                    ? 'bg-black text-white'
                    : ''
                }`}
                onClick={() => handleSelectPageVersion(pageTemplateVersion)}>
                <span className='text-xs'>
                  Version: {pageTemplateVersion.version}
                </span>
                {pageTemplateVersion.published ? <PublishedDot /> : null}
                <div>
                  {pageTemplateVersion.archived ? (
                    <FontAwesomeIcon icon={faBoxArchive} />
                  ) : null}
                </div>
              </Button>
            </li>
          ))}
        </ul>
      </li>
    </ul>
  );
}
export default PageTemplateVersionsList;
