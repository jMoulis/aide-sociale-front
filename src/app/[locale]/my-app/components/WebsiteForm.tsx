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
import {
  IPage,
  IPageTemplateVersion,
  IUserSummary,
  IWebsite
} from '@/lib/interfaces/interfaces';
import client from '@/lib/mongo/initMongoClient';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { toastPromise } from '@/lib/toast/toastPromise';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { v4 } from 'uuid';
import PageForm from './PageForm';
import { PageBuilderEditor } from './PageBuilder';
import PageListItem from './PageListItem';
import { IMasterTemplate } from '@/lib/TemplateBuilder/interfaces';
import TemplateMasters from '../../admin/templates/components/TemplateMasters';
import TailwindConfig from './TailwindConfig';

type Props = {
  organizationId: string;
  user: IUserSummary;
  initialWebsite?: IWebsite | null;
  create?: boolean;
};
function WebsiteForm({ initialWebsite, organizationId, create, user }: Props) {
  const defaultWebsite: IWebsite = {
    _id: v4(),
    name: '',
    createdAt: new Date(),
    organizationId,
    pages: []
  };
  const [website, setWebsite] = useState<IWebsite>(
    initialWebsite || defaultWebsite
  );
  const [open, setOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<IPage | null>(null);
  const t = useTranslations('WebsiteSection');
  const [masterTemplates, setMasterTemplates] = useState<IMasterTemplate[]>([]);
  const [pageTemplateVersions, setTemplateVersions] = useState<
    IPageTemplateVersion[]
  >([]);
  const [selectedVersionPage, setSelectedVersionPage] =
    useState<IPageTemplateVersion | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    handleSave(website, create || false);
  };

  const handleUpsertPage = async (page: IPage) => {
    const prevPage = website.pages.find((p) => p._id === page._id);
    let updatedWebpage: IWebsite = website;
    if (prevPage) {
      updatedWebpage = {
        ...website,
        pages: website.pages.map((p) => (p._id === page._id ? page : p))
      };
    } else {
      updatedWebpage = {
        ...website,
        pages: [...website.pages, page]
      };
    }
    setWebsite(updatedWebpage);
    await handleSave(updatedWebpage, false);
    setOpen(false);
  };

  const handleSelectPage = async (page: IPage) => {
    setSelectedPage(page);
    const { data } = await client.list<IMasterTemplate>(
      ENUM_COLLECTIONS.TEMPLATES_MASTER,
      {
        _id: {
          $in: page.masterTemplates
        }
      }
    );
    setMasterTemplates(data || []);
    setTemplateVersions([]);
    setSelectedVersionPage(null);
  };

  const handleSelectMasterTemplate = async (
    masterTemplate: IMasterTemplate
  ) => {
    const { data } = await client.list<IPageTemplateVersion>(
      ENUM_COLLECTIONS.PAGE_TEMPLATES,
      {
        masterTemplateId: masterTemplate._id
      }
    );
    setTemplateVersions(data || []);
  };

  const handleSelectPageVersion = (pageVersion: IPageTemplateVersion) => {
    setSelectedVersionPage(pageVersion);
  };

  const onCreatePageVersionSuccess = async (masterTemplateId: string) => {
    const { data } = await client.list<IPageTemplateVersion>(
      ENUM_COLLECTIONS.PAGE_TEMPLATES,
      {
        masterTemplateId
      }
    );
    setTemplateVersions(data || []);
  };

  const handleUpdateMasterTemplates = (masters: IMasterTemplate[]) => {
    if (selectedPage) {
      const updatedPage: IPage = {
        ...selectedPage,
        masterTemplates: masters.map((m) => m._id)
      };
      handleUpsertPage(updatedPage);
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
          <PageForm
            initialPage={null}
            organizationId={organizationId}
            onSubmit={handleUpsertPage}
            websiteId={website._id}
          />
        </Dialog>

        <ul>
          {website.pages.map((page: IPage) => (
            <PageListItem
              page={page}
              key={page._id}
              selectedPage={selectedPage}
              organizationId={organizationId}
              websiteId={website._id}
              onUpdateWebsite={setWebsite}
              onSelectPage={handleSelectPage}
            />
          ))}
        </ul>
      </div>
      {selectedPage ? (
        <div>
          {selectedPage.name}
          <PageForm
            initialPage={selectedPage}
            organizationId={organizationId}
            onSubmit={handleUpsertPage}
            websiteId={website._id}
          />
        </div>
      ) : null}
      <TemplateMasters
        serverTemplates={masterTemplates}
        user={user}
        organizationId={organizationId}
        onSubmit={handleUpdateMasterTemplates}
        onSelectMasterTemplate={handleSelectMasterTemplate}
        onCreatePageVersionSuccess={onCreatePageVersionSuccess}
      />
      {pageTemplateVersions.length && !selectedVersionPage ? (
        <ul>
          {pageTemplateVersions.map((pageTemplateVersion) => (
            <li key={pageTemplateVersion._id}>
              <Button
                onClick={() => handleSelectPageVersion(pageTemplateVersion)}>
                {pageTemplateVersion.version}
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
      {selectedVersionPage ? (
        <div className='flex-1'>
          <Button onClick={() => setSelectedVersionPage(null)}>Back</Button>
          <PageBuilderEditor
            initialPageVersion={selectedVersionPage}
            organizationId={organizationId}
            websiteId={website._id}
          />
        </div>
      ) : null}
    </div>
  );
}
export default WebsiteForm;
