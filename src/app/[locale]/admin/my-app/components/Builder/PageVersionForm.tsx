import Button from '@/components/buttons/Button';
import Dialog from '@/components/dialog/Dialog';
import Form from '@/components/form/Form';
import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import Input from '@/components/form/Input';
import { useTranslations } from 'next-intl';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { usePageBuilderStore } from '../stores/pagebuilder-store-provider';
import Textarea from '@/components/form/Textarea';
import FormFooterAction from '@/components/dialog/FormFooterAction';
import SaveButton from '@/components/buttons/SaveButton';
import { IPageTemplateVersion } from '@/lib/interfaces/interfaces';
import CancelButton from '@/components/buttons/CancelButton';

type Props = {
  initialPageVersion: IPageTemplateVersion;
};
function PageVersionForm({ initialPageVersion }: Props) {
  const [open, setOpen] = useState(false);

  const onEditPageTemplateVersion = usePageBuilderStore(
    (state) => state.onEditPageTemplateVersion
  );

  const [pageVersion, setPageVersion] = useState(initialPageVersion);

  const t = useTranslations('WebsiteSection.pageVersionForm');

  useEffect(() => {
    setPageVersion(initialPageVersion);
  }, [initialPageVersion]);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setPageVersion((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setPageVersion(initialPageVersion);
    setOpen(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!pageVersion) return;
    await onEditPageTemplateVersion(pageVersion);
    setOpen(false);
  };
  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      title={t('edit.title')}
      Trigger={
        <Button className='flex items-center justify-center'>
          <h1>Page builder - {pageVersion.title}</h1>
        </Button>
      }>
      <Form onSubmit={handleSubmit}>
        <FormField>
          <FormLabel required>{t('labels.title')}</FormLabel>
          <Input
            name='title'
            onChange={handleInputChange}
            value={pageVersion.title || ''}
            required
          />
        </FormField>
        <FormField>
          <FormLabel>{t('labels.description')}</FormLabel>
          <Textarea
            name='description'
            onChange={handleInputChange}
            value={pageVersion.description || ''}
          />
        </FormField>
        <FormFooterAction>
          <SaveButton />
          <CancelButton onClick={handleCancel} />
        </FormFooterAction>
      </Form>
    </Dialog>
  );
}
export default PageVersionForm;
