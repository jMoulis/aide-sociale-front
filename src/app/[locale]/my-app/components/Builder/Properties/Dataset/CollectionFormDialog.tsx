import Button from '@/components/buttons/Button';
import CancelButton from '@/components/buttons/CancelButton';
import SaveButton from '@/components/buttons/SaveButton';
import Dialog from '@/components/dialog/Dialog';
import FormFooterAction from '@/components/dialog/FormFooterAction';
import Form from '@/components/form/Form';
import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import Input from '@/components/form/Input';
import Popup from '@/components/popup/Popup';
import { toast } from '@/lib/hooks/use-toast';
import { ICollection, ICollectionField } from '@/lib/interfaces/interfaces';
import client from '@/lib/mongo/initMongoClient';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { useMongoUser } from '@/lib/mongo/MongoUserContext/MongoUserContext';
import { toastPromise } from '@/lib/toast/toastPromise';
import { getUserSummary, slugifyFunction } from '@/lib/utils/utils';
import {
  faAdd,
  faCheck,
  faEdit,
  faExclamationCircle,
  faInfoCircle,
  faMagnifyingGlass,
  faSpinner
} from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslations } from 'next-intl';
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { nanoid } from 'nanoid';
import FieldDialogForm from './FieldDialogForm';

function debounce<T extends (...args: any[]) => void>(
  func: T,
  timeout = 300
): (...args: Parameters<T>) => void {
  let timer: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
}

type Props = {
  prevCollection?: ICollection | null;
  onSubmit: () => void;
  onOpen?: () => void;
};
function CollectionFormDialog({ prevCollection, onSubmit }: Props) {
  const user = useMongoUser();
  const t = useTranslations('CollectionSection');

  const defaultCollection = useMemo(
    () =>
      ({
        _id: nanoid(),
        name: '',
        organizationId: '',
        createdAt: new Date(),
        fields: [],
        roles: [],
        slug: ''
      } as ICollection),
    []
  );
  const [collection, setCollection] = useState<ICollection>(
    prevCollection || defaultCollection
  );

  const [open, setOpen] = useState(false);

  const [existingCollections, setExistingCollections] = useState<{
    exactMatchingCollection: ICollection | null;
    equivalentCollections: ICollection[];
  }>({
    exactMatchingCollection: null,
    equivalentCollections: []
  });

  const [searchCorrespondance, setSearchCorrespondance] =
    useState<boolean>(false);

  useEffect(() => {
    if (prevCollection) {
      setCollection(prevCollection);
    } else {
      setCollection(defaultCollection);
    }
  }, [prevCollection, defaultCollection]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formId = (event.target as HTMLFormElement).id;
    if (formId !== 'collection-form') return;
    if (!user?.organizationId) return;

    if (!collection.slug) {
      toast({
        title: 'Slug not defined',
        description: 'Slug not defined',
        variant: 'destructive'
      });
      return;
    }
    if (prevCollection) {
      await toastPromise(
        client.update<ICollection>(
          ENUM_COLLECTIONS.COLLECTIONS,
          { _id: collection._id },
          {
            $set: {
              ...collection,
              updatedBy: getUserSummary(user),
              updatedAt: new Date()
            }
          }
        ),
        t,
        'edit'
      );
    } else {
      await toastPromise(
        client.create<ICollection>(ENUM_COLLECTIONS.COLLECTIONS, {
          ...collection,
          organizationId: user.organizationId,
          createdBy: getUserSummary(user)
        }),
        t,
        'create'
      );
    }
    onSubmit();
    setOpen(false);
  };

  const debouncedSearch = useMemo(
    () =>
      debounce(async (agg: any, slug: string) => {
        try {
          setSearchCorrespondance(true);
          const { data: foundCollections } = await client.search<ICollection>(
            ENUM_COLLECTIONS.COLLECTIONS,
            agg
          );
          if (!foundCollections) return;

          const exactMatchingCollection =
            foundCollections.find(
              (prevCollection) => prevCollection.slug === slug
            ) || null;

          setExistingCollections({
            exactMatchingCollection,
            equivalentCollections: foundCollections
          });
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        } finally {
          setSearchCorrespondance(false);
        }
      }, 300),
    []
  );

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === 'name') {
      const slug = `${user?.organizationId}_${slugifyFunction(value)}`;
      setCollection((prev) => ({
        ...prev,
        [name]: value,
        slug
      }));

      const agg = [
        {
          $search: {
            index: 'search-correspondance',
            autocomplete: {
              query: slug,
              path: 'slug'
            }
          }
        },
        { $project: { _id: 1, name: 1, slug: 1, description: 1 } }
      ];

      debouncedSearch(agg, slug);
    } else {
      setCollection((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpsertField = (field: ICollectionField) => {
    setCollection((prev) => {
      if (field.new) {
        return { ...prev, fields: [...prev.fields, { ...field, new: false }] };
      }
      const updatedFields = [...prev.fields].map((prevField) =>
        prevField.key === field.key ? field : prevField
      );
      return { ...prev, fields: updatedFields };
    });
  };

  const handleCancel = () => {
    setOpen(false);
    setCollection(defaultCollection);
  };

  const handleOpenChange = (state: boolean) => {
    setOpen(state);
    if (!state) {
      setCollection(defaultCollection);
      setExistingCollections({
        exactMatchingCollection: null,
        equivalentCollections: []
      });
    } else {
      if (prevCollection) {
        setCollection(prevCollection);
      }
    }
  };

  const handleDeleteField = (field: ICollectionField) => {
    setCollection((prev) => ({
      ...prev,
      fields: prev.fields.filter((prevField) => prevField.key !== field.key)
    }));
  };
  return (
    <Dialog
      onOpenChange={handleOpenChange}
      title={t('create.title')}
      Trigger={
        <Button>
          <FontAwesomeIcon icon={!!prevCollection ? faEdit : faAdd} />
        </Button>
      }
      open={open}>
      <div className='flex space-x-2'>
        <Form id='collection-form' onSubmit={handleSubmit} className='flex-1'>
          <FormField>
            <FormLabel required>{t('labels.name')}</FormLabel>
            <Input
              name='name'
              onChange={handleInputChange}
              required
              value={collection.name}
              type='text'
              placeholder='Label'
              className='border p-1'
            />

            <div className='grid grid-cols-[20px_1fr] min-h-6 gap-1 items-center'>
              {collection.slug ? (
                <>
                  {searchCorrespondance ? (
                    <FontAwesomeIcon
                      icon={faSpinner}
                      spin
                      className='text-gray-500 text-sm'
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={
                        existingCollections.exactMatchingCollection
                          ? faExclamationCircle
                          : faCheck
                      }
                      className={
                        existingCollections.exactMatchingCollection
                          ? 'text-red-500'
                          : 'text-green-500'
                      }
                    />
                  )}
                  <span className='text-xs text-gray-500'>
                    {t('labels.slug')}: {collection.slug}
                  </span>
                </>
              ) : (
                <>
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    className='text-gray-500 text-sm'
                  />
                  <span className='text-xs text-gray-500'>
                    {t('startTyping')}
                  </span>
                </>
              )}
            </div>
          </FormField>
          <FormField>
            <div className='flex flex-row items-center justify-between'>
              <FormLabel>{t('labels.fields')}</FormLabel>
              <FieldDialogForm
                Trigger={
                  <button>
                    <FontAwesomeIcon icon={faAdd} />
                  </button>
                }
                field={{
                  key: '',
                  label: '',
                  new: true
                }}
                onUpsertField={handleUpsertField}
              />
              {/* <Button type='button' onClick={handleAddNewField}>
                <FontAwesomeIcon icon={faAdd} />
              </Button> */}
            </div>
            {collection.fields.map((field, index) => {
              return (
                <FieldDialogForm
                  Trigger={<button>{field.label}</button>}
                  key={field.key || index}
                  field={field}
                  onUpsertField={handleUpsertField}
                  onDeleteField={handleDeleteField}
                />
              );
            })}
          </FormField>
          <FormFooterAction>
            <SaveButton
              type='submit'
              disabled={!!existingCollections.exactMatchingCollection}
            />
            <CancelButton onClick={handleCancel} />
          </FormFooterAction>
        </Form>
        <div>
          <span className='text-xs text-gray-500'>
            {t('correspondingCollections')}
          </span>
          <ul>
            {existingCollections.equivalentCollections.map((prevCollection) => (
              <li key={prevCollection._id}>
                <Popup
                  icon={
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className='text-sm text-blue-400'
                    />
                  }
                  trigger={
                    <span className='text-xs text-gray-500'>
                      {prevCollection.slug}
                    </span>
                  }>
                  <div className='flex flex-col p-2 space-y-1'>
                    <div className='space-x-1'>
                      <span className='inline-block text-sm text-gray-500'>
                        {t('name')}:
                      </span>
                      <span className='text-sm text-gray-700'>
                        {prevCollection.name}
                      </span>
                    </div>
                    <div className='space-x-1'>
                      <span className='inline-block text-sm text-gray-500'>
                        {t('labels.slug')}:
                      </span>
                      <span className='text-sm text-gray-700'>
                        {prevCollection.slug}
                      </span>
                    </div>
                    <div>
                      <span className='block text-xs text-gray-500'>
                        {t('labels.description')}:
                      </span>

                      <p className='text-sm whitespace-pre'>
                        {prevCollection.description}
                      </p>
                    </div>
                  </div>
                </Popup>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Dialog>
  );
}
export default CollectionFormDialog;
