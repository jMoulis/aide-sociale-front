import Button from '@/components/buttons/Button';
import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import { Checkbox } from '@/components/ui/checkbox';
import { useTemplateBuilder } from '../TemplateBuilderContext';
import { useTranslations } from 'next-intl';
import { CheckedState } from '@radix-ui/react-checkbox';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { IDraftAlert, IFormData } from '../interfaces';
import ExistingDraftAlert from './ExistingDraftAlert';
import DeleteButtonWithConfirmation from '@/components/buttons/DeleteButtonWithConfirmation';
import client from '@/lib/mongo/initMongoClient';
import Input from '@/components/form/Input';
import { useMongoUser } from '@/lib/mongo/MongoUserContext/MongoUserContext';
import { toast } from '@/lib/hooks/use-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPaste,
  faTrash,
  faUpload
} from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { useRouter } from 'next/navigation';
import ConfirmationDeleteContent from './ConfirmationDeleteContent';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { ENUM_APP_ROUTES } from '@/lib/interfaces/enums';
import { usePublishedTemplate } from '../usePublishedTemplate';
import DataConnexionSelect from './DataConnexionTemplateMenu/DataConnexionSelect';
import { ICollection } from '@/lib/interfaces/interfaces';

function TemplatePropertiesMenu() {
  const {
    onPublish,
    template,
    setTemplate,
    onCreateNewVersion,
    isEditable,
    onSelectGlobalConnexion,
    selectedGlobalCollection
  } = useTemplateBuilder();
  const [draftAlert, setDraftAlert] = useState<IDraftAlert | null>(null);
  const [relatedDocuments, setRelatedDocuments] = useState<IFormData[]>([]);
  const tGlobal = useTranslations('GlobalSection');
  const t = useTranslations('TemplateSection');
  const [confirmString, setConfirmString] = useState('');
  const [canDelete, setCanDelete] = useState(false);
  const user = useMongoUser();
  const { getPublishedTemplate } = usePublishedTemplate(template.masterId);
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const confirmationStringPattern = useMemo(
    () => `${template.title}-${template.version}`,
    [template.title, template.version]
  );
  useEffect(() => {
    if (template.globalCollectionName && !selectedGlobalCollection) {
      client
        .get<ICollection>(ENUM_COLLECTIONS.COLLECTIONS, {
          name: template.globalCollectionName
        })
        .then(({ data }) => {
          if (data) {
            onSelectGlobalConnexion(data);
          }
        });
    }
  }, [
    onSelectGlobalConnexion,
    selectedGlobalCollection,
    template.globalCollectionName
  ]);

  const handleForceUpdate = (checked: CheckedState) => {
    setTemplate({
      ...template,
      forceUpdate: typeof checked === 'boolean' ? checked : false
    });
  };
  const handleCreateNewVersion = async () => {
    const draftVersion = await onCreateNewVersion();
    if (draftVersion) {
      setDraftAlert(draftVersion);
    }
  };
  const handleDialogChange = (status: boolean) => {
    if (!status) {
      setDraftAlert(null);
    }
  };
  const handleContinue = async () => {
    if (typeof draftAlert?.create === 'function') {
      draftAlert.create();
      setDraftAlert(null);
    }
  };
  const handleEdit = () => {
    if (typeof draftAlert?.edit === 'function') {
      draftAlert.edit();
      setDraftAlert(null);
    }
  };
  const handleDelete = async () => {
    if (!user?.organizationId) return;
    if (canDelete) {
      setDeleting(true);
      await client.delete(ENUM_COLLECTIONS.TEMPLATES, template._id);
      setDeleting(false);
      setConfirmString('');
      const publishedTemplate = await getPublishedTemplate();
      if (!publishedTemplate) return;

      if (publishedTemplate._id === template._id) {
        toast({
          title: t('delete.action'),
          description:
            'Vous ne pouvez supprimer un template en cours de publication',
          variant: 'destructive'
        });
        return;
      }
      if (relatedDocuments.length) {
        await client.updateMany<IFormData>(
          ENUM_COLLECTIONS.DOCUMENTS,
          {
            _id: { $in: relatedDocuments.map((doc) => doc._id) }
          },
          {
            $set: {
              templateVersionId: publishedTemplate._id,
              templateVersionNumber: publishedTemplate.version
            }
          }
        );
      }

      router.push(`${ENUM_APP_ROUTES.TEMPLATES}/${template.masterId}`);
    } else {
      throw new Error('Invalid confirmation string');
    }
  };
  const handleFetchRelatedDocuments = async (open: boolean) => {
    if (open) {
      const { data: documents } = await client.list<IFormData>(
        ENUM_COLLECTIONS.DOCUMENTS,
        {
          templateVersionId: template._id
        }
      );
      setRelatedDocuments(documents || []);
    }
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
  const handleSelectCollection = (collection: ICollection | null) => {
    onSelectGlobalConnexion(collection);
  };
  return (
    <>
      <div className='p-2 space-y-2'>
        {template.published ? (
          <span className='text-xs bg-green-600 w-fit flex items-center justify-center rounded px-2 text-white py-1'>
            {tGlobal('actions.onLine')}
          </span>
        ) : null}
        <span className='text-slate-400 text-xs'>{`version: ${template.version}`}</span>
        <FormField>
          <FormLabel required>{t('templateName')}</FormLabel>
          <Input
            type='text'
            required
            placeholder={t('templateName')}
            className='border p-2 w-full'
            value={template.title}
            onChange={(e) =>
              setTemplate({ ...template, title: e.target.value })
            }
            disabled={!isEditable}
          />
        </FormField>
        {!isEditable ? (
          <Button onClick={handleCreateNewVersion}>
            <FontAwesomeIcon icon={faPaste} />
            {t('createNewVersion')}
          </Button>
        ) : null}
        {isEditable ? (
          <FormField className='flex-row items-center'>
            <FormLabel className='mb-0 mr-2'>{t('forceUpdate')}</FormLabel>
            <Checkbox
              checked={template.forceUpdate}
              onCheckedChange={handleForceUpdate}
            />
          </FormField>
        ) : null}
        {!template.published ? (
          <Button onClick={onPublish}>
            <FontAwesomeIcon icon={faUpload} />
            {tGlobal('actions.publish')}
          </Button>
        ) : null}
        <DataConnexionSelect
          onSelectCollection={handleSelectCollection}
          selectedCollection={selectedGlobalCollection}
        />
        <DeleteButtonWithConfirmation
          onDelete={handleDelete}
          title={t('delete.title')}
          // disabled={publishedTemplate?._id === template._id}
          buttonActionText={
            <div>
              <FontAwesomeIcon icon={faTrash} />
              <span>{t('delete.action')}</span>
            </div>
          }
          deleteActionText={t('delete.action')}
          deleting={deleting}
          onOpenChange={handleFetchRelatedDocuments}>
          <ConfirmationDeleteContent
            relatedDocumentsLength={relatedDocuments.length}
            confirmationStringPattern={confirmationStringPattern}
            onConfirmStringChange={handleConfirmString}
            confirmString={confirmString}
          />
        </DeleteButtonWithConfirmation>
      </div>
      <ExistingDraftAlert
        draftAlert={draftAlert}
        onOpenChange={handleDialogChange}
        onCreate={handleContinue}
        onEdit={handleEdit}
      />
    </>
  );
}
export default TemplatePropertiesMenu;
