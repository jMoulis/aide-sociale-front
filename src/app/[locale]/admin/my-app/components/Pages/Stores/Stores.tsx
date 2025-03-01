import Button from '@/components/buttons/Button';
import Dialog from '@/components/dialog/Dialog';
import Form from '@/components/form/Form';
import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import Input from '@/components/form/Input';
import Textarea from '@/components/form/Textarea';
import {
  ICollection,
  IPageTemplateVersion,
  IStore
} from '@/lib/interfaces/interfaces';
import { FormEvent, useEffect, useState } from 'react';
import Collections from './Collections';
import { nanoid } from 'nanoid';
import { usePageBuilderStore } from '../../stores/pagebuilder-store-provider';
import DeleteButton from '@/components/buttons/DeleteButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { removeObjectFields, slugifyFunction } from '@/lib/utils/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckedState } from '@radix-ui/react-checkbox';
import Selectbox from '@/components/form/Selectbox';

type Props = {
  page: IPageTemplateVersion;
};
function Stores({ page }: Props) {
  const [stores, setStores] = useState<IStore[]>(page.stores || []);
  const defaultStore: IStore = {
    _id: nanoid(),
    slug: '',
    name: '',
    description: '',
    type: 'form'
  };
  const [selectedStore, setSelectStore] = useState<IStore>(defaultStore);
  const [open, setOpen] = useState(false);
  const onEditPageVersion = usePageBuilderStore(
    (state) => state.onEditPageTemplateVersion
  );

  useEffect(() => {
    if (page.stores) {
      setStores(page.stores || []);
    } else {
      setStores([]);
    }
  }, [page]);

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;
    if (name === 'name') {
      setSelectStore(
        (prev) =>
          ({
            ...(prev || {}),
            name: value,
            slug: slugifyFunction(value)
          } as IStore)
      );
    } else {
      setSelectStore((prev) => ({ ...(prev || {}), [name]: value } as IStore));
    }
  };

  const handleSelectCollection = (collection: ICollection) => {
    const prevStore = selectedStore;
    if (prevStore?.['collection']?._id === collection._id) {
      const clearedStore = removeObjectFields(prevStore, ['collection']);
      setSelectStore(clearedStore);
      return;
    }
    setSelectStore(
      (prev) =>
        ({
          ...(prev || {}),
          collection
        } as IStore)
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedStore) return;
    const previousStores = stores.filter((s) => s._id !== selectedStore._id);
    const updatedStores = [...previousStores, selectedStore];
    setStores(updatedStores);
    setSelectStore(defaultStore);
    onEditPageVersion({ ...page, stores: updatedStores });
    setOpen(false);
  };

  const handleSelectStore = (store: IStore) => {
    setSelectStore(store);
    setOpen(true);
  };
  const handleCreateStore = () => {
    setSelectStore(defaultStore);
    setOpen(true);
  };
  const handleDeleteStore = (store: IStore) => {
    const updatedStores = stores.filter((s) => s._id !== store._id);
    setStores(updatedStores);
    onEditPageVersion({ ...page, stores: updatedStores });
  };
  const handleCheckboxChange = (checked: CheckedState, fieldKey: string) => {
    setSelectStore(
      (prev) => ({ ...(prev || {}), [fieldKey]: checked } as IStore)
    );
  };
  return (
    <div>
      <h1>Stores</h1>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        Trigger={<Button onClick={handleCreateStore}>Add Store</Button>}
        title='Add Store'>
        <div className='flex'>
          <Form onSubmit={handleSubmit}>
            <span>{selectedStore?._id}</span>
            <span>{selectedStore?.slug}</span>
            <FormField>
              <FormLabel>Name</FormLabel>
              <Input
                name='name'
                value={selectedStore?.name || ''}
                placeholder='Name'
                onChange={handleInputChange}
              />
            </FormField>
            <FormField className='flex-row items-center'>
              <FormLabel className='mb-0 mr-1'>Virtuel</FormLabel>
              <Checkbox
                checked={selectedStore?.virtual}
                onCheckedChange={(e) => handleCheckboxChange(e, 'virtual')}
              />
            </FormField>
            <FormField>
              <FormLabel>Type</FormLabel>
              <Selectbox
                value={selectedStore?.type}
                name='type'
                options={[
                  { label: 'Form', value: 'form' },
                  { label: 'Liste', value: 'list' }
                ]}
                onChange={handleInputChange}
              />
            </FormField>
            <FormField>
              <FormLabel>Description</FormLabel>
              <Textarea
                name='description'
                value={selectedStore?.description || ''}
                placeholder='Description'
                onChange={handleInputChange}
              />
            </FormField>
            <FormField>
              <FormLabel>Route param</FormLabel>
              <Input
                name='routeParam'
                value={selectedStore?.routeParam || ''}
                placeholder='routeParam'
                onChange={handleInputChange}
              />
            </FormField>
            <Button type='submit'>Create</Button>
          </Form>
          <Collections
            selectedCollectionId={selectedStore?.collection?._id}
            onSelectCollection={handleSelectCollection}
          />
        </div>
      </Dialog>
      <ul>
        {stores.map((store) => (
          <li key={store._id} className='flex items-center space-x-2'>
            <Button onClick={() => handleSelectStore(store)}>
              <h2>{store.name}</h2>
              <p>{store.description}</p>
            </Button>
            <DeleteButton onClick={() => handleDeleteStore(store)}>
              <FontAwesomeIcon icon={faTrash} />
            </DeleteButton>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default Stores;
