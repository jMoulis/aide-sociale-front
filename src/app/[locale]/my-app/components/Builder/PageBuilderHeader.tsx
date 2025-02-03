import SaveButton from '@/components/buttons/SaveButton';
import { useState } from 'react';
import { IPageTemplateVersion } from '@/lib/interfaces/interfaces';
import { usePageBuilderStore } from '../stores/pagebuilder-store-provider';

function PageBuilderHeader() {
  const [loading, setLoading] = useState<
    'saving' | 'publishing' | 'duplicating' | 'deleting' | null
  >(null);
  const pageVersion = usePageBuilderStore((state) => state.pageVersion);
  const onSavePageTemplate = usePageBuilderStore(
    (state) => state.onSavePageTemplate
  );
  const onDeletePageTemplate = usePageBuilderStore(
    (state) => state.onDeletePageVersion
  );

  const onPublish = usePageBuilderStore((state) => state.onPublish);

  const handleSave = async () => {
    setLoading('saving');
    await onSavePageTemplate();
    setLoading(null);
  };

  // const handleCopy = async () => {
  //   setLoading('duplicating');
  //   await onDuplicatePageVersion();
  //   setLoading(null);
  // };

  const handlePublish = async () => {
    setLoading('publishing');
    await onPublish();
    setLoading(null);
  };
  const handleDelete = async (version: IPageTemplateVersion) => {
    setLoading('deleting');
    await onDeletePageTemplate(version);
    setLoading(null);
  };

  if (!pageVersion) return null;

  return (
    <header className='flex items-center p-4 bg-white'>
      <h1>Page builder - {pageVersion?.version}</h1>
      <SaveButton
        disabled={Boolean(loading)}
        loading={loading === 'saving'}
        onClick={handleSave}
      />
      {pageVersion?.isDirty ? <span>Unsaved changes</span> : null}
      <div className='flex items-center'>
        <SaveButton
          disabled={Boolean(loading)}
          loading={loading === 'publishing'}
          onClick={handlePublish}>
          <span>Publish</span>
        </SaveButton>
        {/* {isPublishedVersion ? <FontAwesomeIcon icon={faGlobe} /> : null} */}
      </div>
      {pageVersion?.hasUnpublishedChanges ? (
        <span>Unpublished changes</span>
      ) : null}
      {pageVersion ? (
        <SaveButton
          disabled={Boolean(loading)}
          loading={loading === 'deleting'}
          onClick={() => handleDelete(pageVersion)}>
          <span>Delete</span>
        </SaveButton>
      ) : null}
    </header>
  );
}
export default PageBuilderHeader;
