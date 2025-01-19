import Button from '@/components/buttons/Button';
import FormFooterAction from '@/components/dialog/FormFooterAction';
import Form from '@/components/form/Form';
import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import Input from '@/components/form/Input';
import { IPage } from '@/lib/interfaces/interfaces';
import { slugifyFunction } from '@/lib/utils/utils';
import { useEffect, useState } from 'react';
import { v4 } from 'uuid';
import CssEditor from './Properties/CssEditor';
import { Drawer } from '@/components/drawer/Drawer';
import Dialog from '@/components/dialog/Dialog';
import MasterTemplateForm from '../../admin/templates/components/MasterTemplateForm';
import { useMongoUser } from '@/lib/mongo/MongoUserContext/MongoUserContext';

type Props = {
  onSubmit: (page: IPage) => void;
  organizationId: string;
  initialPage: IPage | null;
  websiteId: string;
};
function PageForm({ onSubmit, organizationId, initialPage, websiteId }: Props) {
  const user = useMongoUser();

  const defaultPage: IPage = {
    _id: v4(),
    name: '',
    createdAt: new Date(),
    organizationId,
    websiteId,
    subPages: [],
    route: '',
    roles: [],
    masterTemplates: [],
    props: {}
  };
  const [page, setPage] = useState<IPage>(initialPage || defaultPage);
  const [open, setOpen] = useState(false);
  const [openMasterForm, setOpenMasterForm] = useState(false);

  const initializeCustomStyle = (incomingPage: IPage) => {
    const prevStyleTag = document.querySelector('style[data-page-style]');
    if (prevStyleTag) {
      document.head.removeChild(prevStyleTag);
    }
    const styleTag = document.createElement('style');
    styleTag.innerHTML = incomingPage.props?.style || '';
    document.head.appendChild(styleTag);
    return styleTag;
  };

  useEffect(() => {
    if (initialPage) {
      const styleTag = initializeCustomStyle(initialPage);
      return () => {
        if (styleTag) {
          document.head.removeChild(styleTag);
        }
      };
    }
  }, [initialPage]);

  useEffect(() => {
    if (initialPage) {
      setPage(initialPage);
    }
  }, [initialPage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'name') {
      setPage({ ...page, [name]: value, route: slugifyFunction(value) });
    } else {
      setPage({ ...page, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(page);
  };

  const handleSubmitCss = async () => {
    setOpen(false);
  };

  const handleChangeStyle = (value: string) => {
    const updatedPage = {
      ...page,
      props: { ...page.props, style: value }
    };
    setPage(updatedPage);
    initializeCustomStyle(updatedPage);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormField>
        <FormLabel>Name</FormLabel>
        <Input name='name' value={page.name} onChange={handleInputChange} />
      </FormField>
      <FormField>
        <FormLabel>route</FormLabel>
        <div>
          <Input
            name='route'
            value={page.route}
            onChange={handleInputChange}
            placeholder='route'
          />
        </div>
      </FormField>
      <Dialog
        open={openMasterForm}
        onOpenChange={setOpenMasterForm}
        Trigger={<Button>Add master template</Button>}>
        {user ? (
          <MasterTemplateForm
            organizationId={organizationId}
            user={user}
            onSubmit={() => {}}
          />
        ) : null}
      </Dialog>
      <Drawer
        side='left'
        open={open}
        onOpenChange={setOpen}
        Trigger={<Button>CSS</Button>}>
        <CssEditor
          value={page.props?.style || ''}
          onUpdate={handleChangeStyle}
        />
        <FormFooterAction>
          <Button onClick={handleSubmitCss}>Save</Button>
        </FormFooterAction>
      </Drawer>
      <FormFooterAction>
        <Button type='submit'>Save</Button>
      </FormFooterAction>
    </Form>
  );
}
export default PageForm;
