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

type Props = {
  onSubmit: (page: IPage) => void;
  organizationId: string;
  initialPage: IPage | null;
  websiteId: string;
};
function PageForm({ onSubmit, organizationId, initialPage, websiteId }: Props) {
  const defaultPage: IPage = {
    _id: v4(),
    name: '',
    createdAt: new Date(),
    organizationId,
    websiteId,
    subPages: [],
    route: '',
    roles: [],
    masterTemplates: []
  };
  const [page, setPage] = useState<IPage>(initialPage || defaultPage);

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

  return (
    <Form onSubmit={handleSubmit}>
      <FormField>
        <FormLabel>Name</FormLabel>
        <Input name='name' value={page.name} onChange={handleInputChange} />
      </FormField>
      <FormField>
        <FormLabel>route</FormLabel>
        <div>
          {/* <span className='bg-slate-300 px-2 rounded'>{parent?.route}/</span> */}
          <Input
            name='route'
            value={page.route}
            onChange={handleInputChange}
            placeholder='route'
          />
        </div>
      </FormField>
      <FormFooterAction>
        <Button type='submit'>Save</Button>
      </FormFooterAction>
    </Form>
  );
}
export default PageForm;
