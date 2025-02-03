'use client';

import Button from '@/components/buttons/Button';
import FormFooterAction from '@/components/dialog/FormFooterAction';
import Form from '@/components/form/Form';
import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import Input from '@/components/form/Input';
import { useTranslations } from 'next-intl';
import { usePageBuilderStore } from '../stores/pagebuilder-store-provider';

type Props = {
  create?: boolean;
};

function WebsiteForm({ create }: Props) {
  const setWebsite = usePageBuilderStore((state) => state.setWebsite);
  const website = usePageBuilderStore((state) => state.website);
  const t = useTranslations('WebsiteSection');
  const onSaveWebsite = usePageBuilderStore((state) => state.onSaveWebsite);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!website) return;
    const { name, value } = e.target;
    setWebsite({ ...website, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSaveWebsite(create || false, t);
  };

  if (!website) return null;
  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <FormField>
          <FormLabel>Name</FormLabel>
          <Input
            name='name'
            value={website.name}
            onChange={handleInputChange}
          />
        </FormField>
        <FormFooterAction>
          <Button type='submit'>Save</Button>
        </FormFooterAction>
      </Form>
    </div>
  );
}
export default WebsiteForm;
