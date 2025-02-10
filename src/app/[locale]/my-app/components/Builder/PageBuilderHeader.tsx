import SaveButton from '@/components/buttons/SaveButton';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { usePageBuilderStore } from '../stores/pagebuilder-store-provider';
import DeleteButtonWithConfirmation from '@/components/buttons/DeleteButtonWithConfirmation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import ConfirmationDeleteContent from '@/lib/TemplateBuilder/PropertiesMenu/ConfirmationDeleteContent';
import { PublishedDot } from '../PublishedDot';

function PageBuilderHeader() {
  const [loading, setLoading] = useState<
    'saving' | 'publishing' | 'duplicating' | 'deleting' | null
  >(null);
  const pageVersion = usePageBuilderStore((state) => state.pageVersion);
  const onSavePageTemplate = usePageBuilderStore(
    (state) => state.onSavePageTemplate
  );
  const [canDelete, setCanDelete] = useState(false);
  const [confirmString, setConfirmString] = useState('');
  const onDeletePageTemplate = usePageBuilderStore(
    (state) => state.onDeletePageVersion
  );

  const onPublish = usePageBuilderStore((state) => state.onPublish);
  const confirmationStringPattern = useMemo(
    () => `version-${pageVersion?.version}`,
    [pageVersion?.version]
  );
  const handleSave = async () => {
    setLoading('saving');
    await onSavePageTemplate();
    setLoading(null);
  };

  const handlePublish = async () => {
    setLoading('publishing');
    await onPublish();
    setLoading(null);
  };

  useEffect(() => {}, [pageVersion]);
  const handleConfirmString = (e: FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setConfirmString(value);
    if (value === confirmationStringPattern) {
      setCanDelete(true);
    } else {
      setCanDelete(false);
    }
  };
  const handleDelete = async () => {
    if (canDelete && pageVersion) {
      setLoading('deleting');
      await onDeletePageTemplate(pageVersion);
      setLoading(null);
      setConfirmString('');
    } else {
      throw new Error('Invalid confirmation string');
    }
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
          {pageVersion?.published ? <PublishedDot /> : null}
        </SaveButton>
      </div>
      {pageVersion?.hasUnpublishedChanges ? (
        <span>Unpublished changes</span>
      ) : null}
      <DeleteButtonWithConfirmation
        onDelete={handleDelete}
        title={"t('delete.title')"}
        buttonActionText={
          <div>
            <FontAwesomeIcon icon={faTrash} />
            <span>{"t('delete.action')"}</span>
          </div>
        }
        deleteActionText={"t('delete.action')"}
        deleting={loading === 'deleting'}>
        <ConfirmationDeleteContent
          confirmationStringPattern={confirmationStringPattern}
          onConfirmStringChange={handleConfirmString}
          confirmString={confirmString}
        />
      </DeleteButtonWithConfirmation>
    </header>
  );
}
export default PageBuilderHeader;
