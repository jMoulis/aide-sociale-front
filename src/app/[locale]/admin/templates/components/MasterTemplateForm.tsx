'use client';

import Button from '@/components/buttons/Button';
import Dialog from '@/components/dialog/Dialog';
import FormFooterAction from '@/components/dialog/FormFooterAction';
import Form from '@/components/form/Form';
import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import Input from '@/components/form/Input';
import { IUserSummary } from '@/lib/interfaces/interfaces';
import client from '@/lib/mongo/initMongoClient';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { IMasterTemplate } from '@/lib/TemplateBuilder/interfaces';
import { toastPromise } from '@/lib/toast/toastPromise';
import { faEdit } from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { v4 } from 'uuid';

type Props = {
  initialMasterTemplate?: IMasterTemplate;
  onSubmit: (masterTemplate: IMasterTemplate, create: boolean) => void;
  user: IUserSummary;
  organizationId: string;
};
function MasterTemplateForm({
  initialMasterTemplate,
  onSubmit,
  user,
  organizationId
}: Props) {
  const [open, setOpen] = useState(false);
  const t = useTranslations('GlobalSection.actions');
  const tMaster = useTranslations('TemplateSection.master');

  const defaultMasterTemplate: IMasterTemplate = {
    _id: v4(),
    title: '',
    publishedVersionId: null,
    createdAt: new Date(),
    createdBy: user,
    latestVersion: 0,
    organizationId
  };

  const [masterTemplate, setMasterTemplate] = useState<IMasterTemplate>(
    initialMasterTemplate || defaultMasterTemplate
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      onSubmit(masterTemplate, false);
    } else {
      await toastPromise(
        client.create<IMasterTemplate>(
          ENUM_COLLECTIONS.TEMPLATES_MASTER,
          masterTemplate
        ),
        tMaster,
        'create'
      );
      onSubmit(masterTemplate, true);
    }
    setOpen(false);
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
            required
            value={masterTemplate.title}
            onChange={(e) =>
              setMasterTemplate({ ...masterTemplate, title: e.target.value })
            }
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
