import Button from '@/components/buttons/Button';
import FormFooterAction from '@/components/dialog/FormFooterAction';
import Form from '@/components/form/Form';
import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import Input from '@/components/form/Input';
import { IPage } from '@/lib/interfaces/interfaces';
import { slugifyFunction } from '@/lib/utils/utils';
import { useEffect, useMemo, useRef, useState } from 'react';
import { v4 } from 'uuid';
import client from '@/lib/mongo/initMongoClient';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { usePageBuilderStore } from './usePageBuilderStore';
import PageCssEditor from './PageCssEditor';

type Props = {
  onClose?: () => void;
  parentId?: string;
  create?: boolean;
};
function PageForm({ onClose, parentId, create }: Props) {
  const selectedPage = usePageBuilderStore((state) => state.selectedPage);
  const organizationId = usePageBuilderStore((state) => state.organizationId);
  const website = usePageBuilderStore((state) => state.website);
  const linksRef = useRef<HTMLLinkElement[]>([]);

  const [page, setPage] = useState<IPage | null>(null);

  const initializeCustomStyle = (stylesheet: { name: string; uri: string }) => {
    const sluggedName = slugifyFunction(stylesheet.name);
    let stylesheetLink = document.querySelector(
      `link[id="${sluggedName}"]`
    ) as HTMLLinkElement;

    if (stylesheetLink) {
      stylesheetLink.href = `${
        stylesheet.uri
      }?timestamp=${new Date().getTime()}`;
    } else {
      stylesheetLink = document.createElement('link');
      stylesheetLink.setAttribute('rel', 'stylesheet');
      stylesheetLink.setAttribute('id', sluggedName);
      stylesheetLink.setAttribute(
        'href',
        `${stylesheet.uri}?timestamp=${new Date().getTime()}`
      );
      document.head.appendChild(stylesheetLink);
    }
    linksRef.current.push(stylesheetLink);
    return stylesheetLink;
  };

  const previousStylesheetUrl = useMemo(() => {
    if (!website?.stylesheets || !page?.name) return;
    return (website?.stylesheets || []).find(
      (stylesheet) => stylesheet.name === page.name
    );
  }, [page?.name, website?.stylesheets]);

  useEffect(() => {
    if (!organizationId || !website?._id) return;
    if (selectedPage && !create) {
      setPage(selectedPage);
    } else {
      const defaultPage: IPage = {
        _id: v4(),
        name: '',
        createdAt: new Date(),
        organizationId,
        websiteId: website._id,
        subPages: [],
        route: '',
        roles: [],
        parentId,
        masterTemplates: [],
        props: {}
      };
      setPage(defaultPage);
    }
  }, [selectedPage, create, organizationId, website?._id, parentId]);

  useEffect(() => {
    if (!website?.stylesheets || !selectedPage) return;
    website.stylesheets.forEach((stylesheet) => {
      initializeCustomStyle(stylesheet);
    });
    const currentLinks = linksRef.current;
    return () => {
      currentLinks.forEach((link) => {
        if (link.parentNode) {
          document.head.removeChild(link);
        }
      });
    };
  }, [website?.stylesheets, selectedPage]);

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

  if ((!create && !selectedPage) || !page) return null;
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
      <PageCssEditor
        page={page}
        previousStylesheetUrl={previousStylesheetUrl}
      />
      <FormFooterAction>
        <Button type='submit'>Save</Button>
      </FormFooterAction>
    </Form>
  );
}
export default PageForm;
