import Button from '@/components/buttons/Button';
import Dialog from '@/components/dialog/Dialog';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
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
import { v4 } from 'uuid';
import { usePageBuilderStore } from '../stores/pagebuilder-store-provider';

type Props = {
  icon: IconProp;
  create: boolean;
  parentId?: string;
  initialPage: ITreePage | null;
  buttonLabel?: string;
};
function DialogPageForm({
  icon,
  create,
  parentId,
  initialPage,
  buttonLabel
}: Props) {
  const [open, setOpen] = useState(false);
  const t = useTranslations('WebsiteSection.pageForm');
  const [page, setPage] = useState<ITreePage | null>(initialPage);
  const addPage = usePageBuilderStore((state) => state.addPage);
  const onEditPage = usePageBuilderStore((state) => state.onEditPage);
  const website = usePageBuilderStore((state) => state.website);
  const organizationId = usePageBuilderStore((state) => state.organizationId);

  useEffect(() => {
    if (initialPage && !create) {
      setPage(initialPage);
    } else {
      if (!organizationId || !website?._id) return;
      const defaultPage: ITreePage = {
        _id: v4(),
        name: '',
        slug: '',
        createdAt: new Date(),
        organizationId,
        websiteId: website._id,
        route: '',
        roles: [],
        parentId,
        masterTemplateId: '',
        props: {},
        menus: [],
        children: []
      };
      setPage(defaultPage);
    }
  }, [initialPage, create, organizationId, website?._id, parentId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!page) return;
    const { name, value } = e.target;
    if (name === 'name') {
      setPage({ ...page, [name]: value, slug: slugifyFunction(value) });
    } else {
      setPage({ ...page, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!page) return;
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
    setOpen(false);
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
          <Input name='name' value={page?.name} onChange={handleInputChange} />
          <span>{page?.slug}</span>
        </FormField>
        <FormField>
          <FormLabel>route</FormLabel>
          <div>
            <Input
              name='route'
              value={page?.route}
              onChange={handleInputChange}
              placeholder='route'
            />
          </div>
        </FormField>
        <FormFooterAction>
          <Button type='submit'>Save</Button>
        </FormFooterAction>
      </Form>
    </Dialog>
  );
}
export default DialogPageForm;
