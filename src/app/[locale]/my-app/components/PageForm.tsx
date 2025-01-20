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
import client from '@/lib/mongo/initMongoClient';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { usePageBuilderStore } from './usePageBuilderStore';

type Props = {
  onClose?: () => void;
  parentId?: string;
  create?: boolean;
};
function PageForm({ onClose, parentId, create }: Props) {
  const selectedPage = usePageBuilderStore((state) => state.selectedPage);
  const organizationId = usePageBuilderStore((state) => state.organizationId);
  const websiteId = usePageBuilderStore((state) => state.website?._id);

  const [page, setPage] = useState<IPage | null>(null);
  const [open, setOpen] = useState(false);

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
    if (selectedPage) {
      const styleTag = initializeCustomStyle(selectedPage);
      return () => {
        if (styleTag) {
          document.head.removeChild(styleTag);
        }
      };
    }
  }, [selectedPage]);

  useEffect(() => {
    if (!organizationId || !websiteId) return;
    if (selectedPage && !create) {
      setPage(selectedPage);
    } else {
      const defaultPage: IPage = {
        _id: v4(),
        name: '',
        createdAt: new Date(),
        organizationId,
        websiteId,
        subPages: [],
        route: '',
        roles: [],
        parentId,
        masterTemplates: [],
        props: {}
      };
      setPage(defaultPage);
    }
  }, [selectedPage, create, organizationId, websiteId, parentId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!page) return;
    const { name, value } = e.target;
    if (name === 'name') {
      setPage({ ...page, [name]: value, route: slugifyFunction(value) });
    } else {
      setPage({ ...page, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!page) return;
    if (selectedPage) {
      await client.update<IPage>(
        ENUM_COLLECTIONS.PAGES,
        {
          _id: page._id
        },
        {
          $set: page
        }
      );
    } else {
      await client.create<IPage>(ENUM_COLLECTIONS.PAGES, page);
      onClose?.();
    }
  };

  const handleSubmitCss = async () => {
    setOpen(false);
  };

  const handleChangeStyle = (value: string) => {
    if (!page) return;
    const updatedPage = {
      ...page,
      props: { ...page.props, style: value }
    };
    setPage(updatedPage);
    initializeCustomStyle(updatedPage);
  };

  if (!page) return null;
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
