import Button from '@/components/buttons/Button';
import Dialog from '@/components/dialog/Dialog';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useMemo, useState } from 'react';
import { IPage, ITreePage } from '@/lib/interfaces/interfaces';
import Form from '@/components/form/Form';
import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import Input from '@/components/form/Input';
import FormFooterAction from '@/components/dialog/FormFooterAction';
import { removeObjectFields, slugifyFunction } from '@/lib/utils/utils';
import { toastPromise } from '@/lib/toast/toastPromise';
import { useTranslations } from 'next-intl';
import client from '@/lib/mongo/initMongoClient';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { nanoid } from 'nanoid';
import { usePageBuilderStore } from '../stores/pagebuilder-store-provider';
import SaveButton from '@/components/buttons/SaveButton';
import CancelButton from '@/components/buttons/CancelButton';
import DeleteButton from '@/components/buttons/DeleteButton';

type Props = {
  icon: IconProp;
  create: boolean;
  parentPage?: ITreePage;
  initialPage: ITreePage | null;
  buttonLabel?: string;
  websiteId: string;
  organizationId: string;
};
function DialogPageForm({
  icon,
  create,
  parentPage,
  initialPage,
  buttonLabel,
  websiteId,
  organizationId
}: Props) {
  const defaultPage = useMemo(() => {
    return {
      _id: nanoid(),
      name: '',
      slug: '',
      createdAt: new Date(),
      organizationId,
      websiteId,
      route: parentPage?.route ? `${parentPage.route}` : '',
      parentId: parentPage?._id,
      masterTemplateIds: [],
      props: {},
      menus: [],
      children: []
    };
  }, [organizationId, websiteId, parentPage?._id, parentPage?.route]);

  const [open, setOpen] = useState(false);
  const t = useTranslations('WebsiteSection.pageForm');
  const [page, setPage] = useState<ITreePage>(initialPage || defaultPage);
  const addPage = usePageBuilderStore((state) => state.addPage);
  const onEditPage = usePageBuilderStore((state) => state.onEditPage);

  useEffect(() => {
    if (initialPage && !create) {
      setPage(initialPage);
    } else {
      setPage(defaultPage);
    }
  }, [create, defaultPage, initialPage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!page) {
      console.warn('Page is missing');
      return;
    }
    const { name, value } = e.target;
    if (name === 'name') {
      setPage({ ...page, [name]: value, slug: slugifyFunction(value) });
    } else {
      setPage({ ...page, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!page) {
      console.warn('Page is missing');
      return;
    }
    if (!create) {
      toastPromise(
        client.update<IPage>(
          ENUM_COLLECTIONS.PAGES,
          {
            _id: page._id
          },
          {
            $set: removeObjectFields(page, ['children'])
          }
        ),
        t,
        'edit'
      );
      onEditPage(page);
    } else {
      toastPromise(
        client.create<IPage>(
          ENUM_COLLECTIONS.PAGES,
          removeObjectFields(page, ['children'])
        ),
        t,
        'create'
      );
      addPage(page);
    }
    setPage(defaultPage);
    setOpen(false);
  };

  const handleCancel = () => {
    if (create) {
      setPage(defaultPage);
    } else if (initialPage) {
      setPage(initialPage);
    }
    setOpen(false);
  };
  const handleDeletePage = async () => {
    if (initialPage) {
      toastPromise(
        client.delete(ENUM_COLLECTIONS.PAGES, initialPage._id),
        t,
        'delete'
      );
    }
  };
  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      title={create ? t('create.action') : t('edit.action')}
      Trigger={
        <Button>
          {buttonLabel ? <span>{buttonLabel}</span> : null}
          <FontAwesomeIcon icon={icon} />
        </Button>
      }>
      <Form onSubmit={handleSubmit}>
        <FormField>
          <FormLabel>Name</FormLabel>
          <Input
            name='name'
            value={page?.name || ''}
            onChange={handleInputChange}
          />
          <span className='text-xs text-gray-600 ml-2 mt-1'>{page?.slug}</span>
        </FormField>
        <FormField>
          <FormLabel>route</FormLabel>
          <div className='flex'>
            <span className='text-xs p-1 flex items-center border border-r-0 rounded-tl shadow-sm rounded-bl bg-gray-300'>
              {parentPage?.route}
            </span>
            <Input
              className='rounded-tr rounded-br rounded-l-none'
              name='route'
              value={page?.route || ''}
              onChange={handleInputChange}
              placeholder='route'
            />
          </div>
        </FormField>
        <FormField>
          <FormLabel>Position</FormLabel>
          <Input
            name='position'
            type='number'
            value={page?.position || ''}
            onChange={handleInputChange}
            placeholder='position'
          />
        </FormField>
        <FormFooterAction>
          <SaveButton />
          <DeleteButton onClick={handleDeletePage} />
          <CancelButton onClick={handleCancel} />
        </FormFooterAction>
      </Form>
    </Dialog>
  );
}
export default DialogPageForm;
