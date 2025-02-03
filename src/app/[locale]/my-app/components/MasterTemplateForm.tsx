'use client';

import Button from '@/components/buttons/Button';
import Dialog from '@/components/dialog/Dialog';
import FormFooterAction from '@/components/dialog/FormFooterAction';
import Form from '@/components/form/Form';
import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import Input from '@/components/form/Input';
import { IPage, ITreePage } from '@/lib/interfaces/interfaces';
import client from '@/lib/mongo/initMongoClient';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { IMasterTemplate } from '@/lib/TemplateBuilder/interfaces';
import { toastPromise } from '@/lib/toast/toastPromise';
import { faAdd, faEdit } from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { v4 } from 'uuid';
import { getUserSummary, removeObjectFields } from '@/lib/utils/utils';
import { usePageBuilderStore } from './stores/pagebuilder-store-provider';
import { useMongoUser } from '@/lib/mongo/MongoUserContext/MongoUserContext';

type Props = {
  initialMasterTemplate?: IMasterTemplate | null;
  page: ITreePage;
  onSubmit?: (masterTemplate: IMasterTemplate) => void;
};
function MasterTemplateForm({ initialMasterTemplate, page, onSubmit }: Props) {
  const [open, setOpen] = useState(false);
  const t = useTranslations('GlobalSection.actions');
  const tMaster = useTranslations('TemplateSection.master');
  const organizationId = usePageBuilderStore((state) => state.organizationId);
  const setSelectedPage = usePageBuilderStore((state) => state.setSelectedPage);

  const user = useMongoUser();
  const [masterTemplate, setMasterTemplate] = useState<IMasterTemplate | null>(
    null
  );
  useEffect(() => {
    if (!organizationId || !user) return;
    const defaultMasterTemplate: IMasterTemplate = {
      _id: v4(),
      title: '',
      publishedVersion: null,
      createdAt: new Date(),
      createdBy: getUserSummary(user),
      latestVersion: 0,
      organizationId
    };
    setMasterTemplate(initialMasterTemplate || defaultMasterTemplate);
  }, [initialMasterTemplate, organizationId, user]);

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
      onSubmit?.(masterTemplate);
    } else {
      await toastPromise(
        client.create<IMasterTemplate>(
          ENUM_COLLECTIONS.TEMPLATES_MASTER,
          masterTemplate
        ),
        tMaster,
        'create'
      );
      onSubmit?.(masterTemplate);
    }

    const updatedPage = removeObjectFields(
      {
        ...page,
        masterTemplateId: masterTemplate._id
      },
      ['children']
    );
    await client.update<IPage>(
      ENUM_COLLECTIONS.PAGES,
      { _id: page._id },
      { $set: updatedPage }
    );
    setSelectedPage({ ...page, masterTemplateId: masterTemplate._id });
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      title='Create master template'
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
          <FormLabel required>Title</FormLabel>
          <Input
            name='title'
            required
            value={masterTemplate?.title || ''}
            onChange={handleInputChange}
          />
        </FormField>
        <FormFooterAction>
          <Button type='submit'>{t('save')}</Button>
        </FormFooterAction>
      </Form>
    </Dialog>
  );
}
export default MasterTemplateForm;
