import SaveButton from '@/components/buttons/SaveButton';
import { FormEvent, useMemo, useState } from 'react';
import { usePageBuilderStore } from '../stores/pagebuilder-store-provider';
import DeleteButtonWithConfirmation from '@/components/buttons/DeleteButtonWithConfirmation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBoxArchive,
  faTrash
} from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import ConfirmationDeleteContent from '@/lib/TemplateBuilder/PropertiesMenu/ConfirmationDeleteContent';
import { PublishedDot } from '../PublishedDot';
import PageVersionForm from './PageVersionForm';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('WebsiteSection.pageVersionForm');

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
      await onDeletePageTemplate(pageVersion, pageVersion.hasBeenPublished);
      setLoading(null);
      setConfirmString('');
    } else {
      throw new Error('Invalid confirmation string');
    }
  };

  if (!pageVersion) return null;

  return (
    <header className='flex items-center p-4 bg-white'>
      <PageVersionForm initialPageVersion={pageVersion} />
      <SaveButton
        disabled={Boolean(loading)}
        loading={loading === 'saving'}
        onClick={handleSave}
      />
      {pageVersion?.isDirty ? <span>{t('labels.unsavedChanges')}</span> : null}
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
        <span>{t('labels.unpublishedChanges')}</span>
      ) : null}
      <DeleteButtonWithConfirmation
        onDelete={handleDelete}
        title={t('delete.title')}
        buttonActionText={
          <FontAwesomeIcon
            icon={pageVersion.hasBeenPublished ? faBoxArchive : faTrash}
          />
        }
        deleteActionText={
          pageVersion.hasBeenPublished
            ? t('archive.action')
            : t('delete.action')
        }
        deleting={loading === 'deleting'}>
        <ConfirmationDeleteContent
          confirmationStringPattern={confirmationStringPattern}
          onConfirmStringChange={handleConfirmString}
          confirmString={confirmString}>
          <p className='whitespace-pre-line text-sm'>
            {pageVersion.hasBeenPublished
              ? `Cette version a été publiée et utilisée.
              Vous ne pourrez plus la supprimer, mais vous pouvez l'archiver`
              : ''}
          </p>
        </ConfirmationDeleteContent>
      </DeleteButtonWithConfirmation>
    </header>
  );
}
export default PageBuilderHeader;
