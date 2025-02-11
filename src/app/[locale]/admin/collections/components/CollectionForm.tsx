import CancelButton from '@/components/buttons/CancelButton';
import SaveButton from '@/components/buttons/SaveButton';
import FormFooterAction from '@/components/dialog/FormFooterAction';
import Form from '@/components/form/Form';
import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import Input from '@/components/form/Input';
import { ICollection, IUserSummary } from '@/lib/interfaces/interfaces';
import client from '@/lib/mongo/initMongoClient';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { toastPromise } from '@/lib/toast/toastPromise';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { nanoid } from 'nanoid';

type Props = {
  initialCollection?: ICollection;
  user: IUserSummary;
  organizationId: string;
  onSubmit: (collection: ICollection, create: boolean) => void;
  onCancel?: () => void;
};
function CollectionForm({
  initialCollection,
  user,
  organizationId,
  onSubmit,
  onCancel
}: Props) {
  const t = useTranslations('CollectionSection');

  const defaultCollection: ICollection = {
    _id: nanoid(),
    name: '',
    organizationId,
    createdBy: user,
    createdAt: new Date(),
    fields: [],
    slug: '',
    roles: []
  };
  const [collection, setCollection] = useState<ICollection>(
    initialCollection || defaultCollection
  );

  const hanldeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCollection((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (initialCollection) {
      await toastPromise(
        client.update<ICollection>(
          ENUM_COLLECTIONS.COLLECTIONS,
          { _id: collection._id },
          { $set: collection }
        ),
        t,
        'edit'
      );
    } else {
      await toastPromise(
        client.create<ICollection>(ENUM_COLLECTIONS.COLLECTIONS, collection),
        t,
        'create'
      );
    }
    onSubmit(collection, !initialCollection);
  };
  // const handleFieldsChange = (fields: string[]) => {
  //   // setCollection((prev) => ({ ...prev, fields }));
  // };
  return (
    <Form onSubmit={handleSubmit}>
      <FormField>
        <FormLabel required>{t('labels.name')}</FormLabel>
        <Input
          name='name'
          onChange={hanldeInputChange}
          required
          value={collection.name}
          type='text'
          placeholder='Label'
          className='border p-1'
        />
      </FormField>
      <FormField>
        <FormLabel>{t('labels.fields')}</FormLabel>
        {/* <TagsInput
          onChange={handleFieldsChange}
          previousTags={collection.fields}
        /> */}
      </FormField>
      <FormFooterAction>
        <SaveButton type='submit' />
        {typeof onCancel === 'function' ? (
          <CancelButton onClick={onCancel} />
        ) : null}
      </FormFooterAction>
    </Form>
  );
}
export default CollectionForm;
