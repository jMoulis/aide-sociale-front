'use client';

import Button from '@/components/buttons/Button';
import Dialog from '@/components/dialog/Dialog';
import FormFooterAction from '@/components/dialog/FormFooterAction';
import Form from '@/components/form/Form';
import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import Input from '@/components/form/Input';
import { IPage, IRole, ITreePage } from '@/lib/interfaces/interfaces';
import client from '@/lib/mongo/initMongoClient';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { IMasterTemplate } from '@/lib/TemplateBuilder/interfaces';
import { toastPromise } from '@/lib/toast/toastPromise';
import { faAdd, faEdit } from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import { getUserSummary, removeObjectFields } from '@/lib/utils/utils';
import { usePageBuilderStore } from './stores/pagebuilder-store-provider';
import { useMongoUser } from '@/lib/mongo/MongoUserContext/MongoUserContext';
import RolesCheckboxesList from '@/components/RolesCheckboxesList/RolesCheckboxesList';
import Textarea from '@/components/form/Textarea';
import Actions from '../../admin/ressources/components/Actions';
import { ActionKey } from '@/lib/interfaces/enums';

type Props = {
  initialMasterTemplate?: IMasterTemplate | null;
  page: ITreePage;
};
function MasterTemplateForm({ initialMasterTemplate, page }: Props) {
  const [open, setOpen] = useState(false);
  const t = useTranslations('GlobalSection.actions');
  const tMaster = useTranslations('TemplateSection.master');
  const organizationId = usePageBuilderStore((state) => state.organizationId);
  const setSelectedPage = usePageBuilderStore((state) => state.setSelectedPage);
  const onEditPage = usePageBuilderStore((state) => state.onEditPage);
  const onAddMasterTemplate = usePageBuilderStore(
    (state) => state.onAddMasterTemplate
  );
  const onEditMasterTemplate = usePageBuilderStore(
    (state) => state.onEditMasterTemplate
  );

  const user = useMongoUser();
  const [masterTemplate, setMasterTemplate] = useState<IMasterTemplate | null>(
    null
  );
  useEffect(() => {
    if (!organizationId || !user) return;
    const defaultMasterTemplate: IMasterTemplate = {
      _id: nanoid(),
      title: '',
      publishedVersion: null,
      createdAt: new Date(),
      createdBy: getUserSummary(user),
      latestVersion: 0,
      organizationId
    };
    setMasterTemplate(initialMasterTemplate || defaultMasterTemplate);
  }, [initialMasterTemplate, organizationId, user]);

  const updatePage = async (masterTemplateId: string) => {
    const updatedMasterTemplateIds = [
      ...new Set([...(page.masterTemplateIds || []), masterTemplateId])
    ];

    const updatedPage = removeObjectFields(
      {
        ...page,
        masterTemplateIds: updatedMasterTemplateIds
      },
      ['children']
    );
    await client.update<IPage>(
      ENUM_COLLECTIONS.PAGES,
      { _id: page._id },
      { $set: updatedPage }
    );
    onEditPage({
      ...page,
      masterTemplateIds: updatedMasterTemplateIds
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!masterTemplate) return;

    if (initialMasterTemplate) {
      await toastPromise(
        client.update<IMasterTemplate>(
          ENUM_COLLECTIONS.TEMPLATES_MASTER,
          {
            _id: masterTemplate._id
          },
          {
            $set: masterTemplate
          }
        ),
        tMaster,
        'edit'
      );

      onEditMasterTemplate(masterTemplate);
    } else {
      await toastPromise(
        client.create<IMasterTemplate>(
          ENUM_COLLECTIONS.TEMPLATES_MASTER,
          masterTemplate
        ),
        tMaster,
        'create'
      );
      await updatePage(masterTemplate._id);
      onAddMasterTemplate(masterTemplate);
    }
    setOpen(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!masterTemplate) return;
    const { name, value } = e.target;
    setMasterTemplate({ ...masterTemplate, [name]: value });
  };

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
    setSelectedPage(page);
  };

  const handleSelectRole = (role: IRole) => {
    if (!masterTemplate) return;
    setMasterTemplate({
      ...masterTemplate,
      roles: masterTemplate.roles?.includes(role._id)
        ? masterTemplate.roles?.filter((id) => id !== role._id)
        : [...(masterTemplate.roles || []), role._id]
    });
  };
  const handleSelectAction = (action: ActionKey) => {
    if (!masterTemplate) return;
    setMasterTemplate({
      ...masterTemplate,
      mandatoryPermissions: masterTemplate.mandatoryPermissions?.includes(
        action
      )
        ? masterTemplate.mandatoryPermissions?.filter((a) => a !== action)
        : [...(masterTemplate.mandatoryPermissions || []), action]
    });
  };
  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      title={tMaster('create.title')}
      Trigger={
        <button onClick={handleOpen}>
          {initialMasterTemplate ? (
            <FontAwesomeIcon icon={faEdit} />
          ) : (
            <FontAwesomeIcon icon={faAdd} />
          )}
        </button>
      }>
      <Form onSubmit={handleSubmit}>
        <FormField>
          <FormLabel required>{tMaster('labels.title')}</FormLabel>
          <Input
            name='title'
            required
            value={masterTemplate?.title || ''}
            onChange={handleInputChange}
          />
        </FormField>
        <FormField>
          <FormLabel required>{tMaster('labels.description')}</FormLabel>
          <Textarea
            name='description'
            required
            value={masterTemplate?.description || ''}
            onChange={handleInputChange}
          />
        </FormField>
        <div className='flex space-x-3'>
          <FormField>
            <FormLabel>{tMaster('labels.mandatoryPermissions')}</FormLabel>
            <Actions
              selectedPermissions={masterTemplate?.mandatoryPermissions || []}
              onSelectAction={handleSelectAction}
            />
          </FormField>
          <FormField>
            <FormLabel>{tMaster('labels.roles')}</FormLabel>
            <RolesCheckboxesList
              prevRoles={masterTemplate?.roles || []}
              onSelectRole={handleSelectRole}
              shouldFetch={true}
              organizationId={organizationId}
              filter={page?.slug}
            />
          </FormField>
        </div>
        <FormFooterAction>
          <Button type='submit'>{t('save')}</Button>
        </FormFooterAction>
      </Form>
    </Dialog>
  );
}
export default MasterTemplateForm;
