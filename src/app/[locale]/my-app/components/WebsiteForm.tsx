'use client';

import Button from '@/components/buttons/Button';
import Dialog from '@/components/dialog/Dialog';
import FormFooterAction from '@/components/dialog/FormFooterAction';
import Form from '@/components/form/Form';
import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import Input from '@/components/form/Input';
import { Link } from '@/i18n/routing';
import { ENUM_APP_ROUTES } from '@/lib/interfaces/enums';
import { IUserSummary, IWebsite } from '@/lib/interfaces/interfaces';
import client from '@/lib/mongo/initMongoClient';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { toastPromise } from '@/lib/toast/toastPromise';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { v4 } from 'uuid';
import PageForm from './PageForm';
import TemplateMasters from './TemplateMasters';
import TailwindConfig from './TailwindConfig';
import WebsitePages from './WebsitePages';
import { usePageBuilderStore } from './usePageBuilderStore';

type Props = {
  organizationId: string;
  user: IUserSummary;
  initialWebsite?: IWebsite | null;
  create?: boolean;
};
function WebsiteForm({ initialWebsite, organizationId, create, user }: Props) {
  const setWebsite = usePageBuilderStore((state) => state.setWebsite);
  const website = usePageBuilderStore((state) => state.website);
  const [open, setOpen] = useState(false);
  const t = useTranslations('WebsiteSection');

  const setOrganizationId = usePageBuilderStore(
    (state) => state.setOrganizationId
  );

  useEffect(() => {
    if (!organizationId) return;
    const defaultWebsite: IWebsite = {
      _id: v4(),
      name: '',
      createdAt: new Date(),
      organizationId
    };
    setWebsite(initialWebsite || defaultWebsite);
  }, [initialWebsite, organizationId, setWebsite]);

  useEffect(() => {
    if (organizationId) {
      setOrganizationId(organizationId);
    }
  }, [organizationId, setOrganizationId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!website) return;
    const { name, value } = e.target;
    setWebsite({ ...website, [name]: value });
  };

  const handleSave = async (updatedWebsite: IWebsite, isNew: boolean) => {
    if (isNew) {
      await toastPromise(
        client.create(ENUM_COLLECTIONS.WEBSITES, updatedWebsite),
        t,
        'create'
      );
    } else {
      toastPromise(
        client.update(
          ENUM_COLLECTIONS.WEBSITES,
          {
            _id: updatedWebsite._id
          },
          { $set: updatedWebsite }
        ),
        t,
        'edit'
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (website) {
      handleSave(website, create || false);
    }
  };

  const handleUpdateTailwindConfig = (tailwindConfig: string) => {
    if (website) {
      const updatedWebsite: IWebsite = {
        ...website,
        tailwindConfig
      };
      setWebsite(updatedWebsite);
      handleSave(updatedWebsite, create || false);
    }
  };
  if (!initialWebsite && !create) {
    return <Link href={`${ENUM_APP_ROUTES.MY_APP}/create`}>Create</Link>;
  }

  if (!website) return null;
  return (
    <div className='flex'>
      <div>
        <h1>Pages</h1>
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
        <TailwindConfig
          prevScript={website.tailwindConfig || ''}
          onUpdateWebsite={handleUpdateTailwindConfig}
          path={`${organizationId}`}
        />
        <Dialog
          open={open}
          onOpenChange={setOpen}
          Trigger={<Button>Create</Button>}>
          <PageForm create onClose={() => setOpen(false)} />
        </Dialog>
        <WebsitePages websiteId={website._id} />
      </div>
      <div>
        <PageForm />
        <TemplateMasters user={user} />
      </div>
    </div>
  );
}
export default WebsiteForm;
