'use client';

import Button from '@/components/buttons/Button';
import Dialog from '@/components/dialog/Dialog';
import FormFooterAction from '@/components/dialog/FormFooterAction';
import Form from '@/components/form/Form';
import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import Input from '@/components/form/Input';
import { IPage, IUserSummary } from '@/lib/interfaces/interfaces';
import client from '@/lib/mongo/initMongoClient';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { IMasterTemplate } from '@/lib/TemplateBuilder/interfaces';
import { toastPromise } from '@/lib/toast/toastPromise';
import { faEdit } from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { v4 } from 'uuid';
import { usePageBuilderStore } from './usePageBuilderStore';

type Props = {
  initialMasterTemplate?: IMasterTemplate;
  user: IUserSummary;
};
function MasterTemplateForm({ initialMasterTemplate, user }: Props) {
  const [open, setOpen] = useState(false);
  const t = useTranslations('GlobalSection.actions');
  const tMaster = useTranslations('TemplateSection.master');
  const organizationId = usePageBuilderStore((state) => state.organizationId);
  const selectedPage = usePageBuilderStore((state) => state.selectedPage);

  const setMasterTemplates = usePageBuilderStore(
    (state) => state.setMasterTemplates
  );
  const masterTemplates = usePageBuilderStore((state) => state.masterTemplates);
  const [masterTemplate, setMasterTemplate] = useState<IMasterTemplate | null>(
    null
  );

  useEffect(() => {
    if (!organizationId) return;
    const defaultMasterTemplate: IMasterTemplate = {
      _id: v4(),
      title: '',
      publishedVersion: null,
      createdAt: new Date(),
      createdBy: user,
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
    } else {
      await toastPromise(
        client.create<IMasterTemplate>(
          ENUM_COLLECTIONS.TEMPLATES_MASTER,
          masterTemplate
        ),
        tMaster,
        'create'
      );
    }
    let updatedMasterTemplates: IMasterTemplate[] = masterTemplates;
    if (!initialMasterTemplate) {
      updatedMasterTemplates = [...masterTemplates, masterTemplate];
      setMasterTemplates(updatedMasterTemplates);
    } else {
      updatedMasterTemplates = masterTemplates.map((template) =>
        template._id === masterTemplate._id ? masterTemplate : template
      );
      setMasterTemplates(updatedMasterTemplates);
    }
    if (selectedPage) {
      const updatedPage = {
        ...selectedPage,
        masterTemplates: updatedMasterTemplates.map((template) => template._id)
      };
      await client.update<IPage>(
        ENUM_COLLECTIONS.PAGES,
        { _id: selectedPage._id },
        { $set: updatedPage }
      );
    }
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!masterTemplate) return;
    const { name, value } = e.target;
    setMasterTemplate({ ...masterTemplate, [name]: value });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      title='Create master template'
      Trigger={
        <Button>
          {initialMasterTemplate ? (
            <FontAwesomeIcon icon={faEdit} />
          ) : (
            tMaster('create.action')
          )}
        </Button>
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
