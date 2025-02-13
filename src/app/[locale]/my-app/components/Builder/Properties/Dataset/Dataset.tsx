import { ElementConfigProps } from '../../../interfaces';
import { ICollection, IDataset } from '@/lib/interfaces/interfaces';
import { usePageBuilderStore } from '../../../stores/pagebuilder-store-provider';
import { useTranslations } from 'next-intl';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckedState } from '@radix-ui/react-checkbox';
import FormLabel from '@/components/form/FormLabel';
import FormField from '@/components/form/FormField';
import Input from '@/components/form/Input';
import FieldList from './FieldList';
import { useDataset } from './useDataset';
import DatasetStaticOptionsField from './DatasetStaticOptionsField';
import SelectCollectionField from './SelectCollectionField';

type Props = {
  config: ElementConfigProps;
};
const Dataset = ({ config }: Props) => {
  const {
    collections,
    collectionsSelectedCollection,
    parentForm,
    currentDataset,
    selectedNode,
    fetchCollections,
    setCollectionsSelectedCollection,
    pageTemplateVersion
  } = useDataset({ config });

  const onUpdateNodeProperty = usePageBuilderStore(
    (state) => state.onUpdateNodeProperty
  );
  const t = useTranslations('CollectionSection');

  const handleSelectCollection = (value?: string) => {
    if (!pageTemplateVersion?._id) return;
    const selectedCollection = value ? collections[value] : null;
    if (!selectedCollection) return;

    const collection: IDataset = {
      collectionSlug: selectedCollection.slug,
      collectionName: selectedCollection.name,
      pageTemplateVersionId: pageTemplateVersion?._id,
      connexion: {
        ...currentDataset?.connexion,
        field: ''
      }
    };

    onUpdateNodeProperty(
      { [config.propKey]: collection || '' },
      config.context
    );
    setCollectionsSelectedCollection(selectedCollection);
  };

  const handleClearSelectedCollection = () => {
    onUpdateNodeProperty(
      {
        [config.propKey]: {
          ...currentDataset,
          collectionSlug: '',
          collectionName: ''
        }
      },
      config.context
    );
    setCollectionsSelectedCollection(null);
  };
  const handleSelectField = (state: CheckedState, selectedValue?: string) => {
    let collection: ICollection | null = null;
    if (!pageTemplateVersion?._id) return;

    if (parentForm?.context.dataset?.collectionSlug) {
      collection = collections[parentForm.context.dataset.collectionSlug];
    } else if (currentDataset?.collectionSlug) {
      collection = collections[currentDataset.collectionSlug];
    }
    if (!collection) return;

    const updatedCollection: IDataset = {
      collectionSlug: collection.slug,
      collectionName: collection.name,
      pageTemplateVersionId: pageTemplateVersion?._id as string,
      connexion: {
        ...currentDataset?.connexion,
        field: state === true ? selectedValue : ''
      }
    };
    onUpdateNodeProperty(
      { [config.propKey]: updatedCollection || '' },
      config.context
    );
  };

  const handleCreateFormChecked = (state: CheckedState) => {
    if (!currentDataset) return;
    const collection = collections[currentDataset.collectionSlug];

    const updatedCollection: IDataset = {
      collectionSlug: collection.slug,
      collectionName: collection.name,
      isCreation: state as unknown as boolean,
      connexion: currentDataset.connexion,
      pageTemplateVersionId: pageTemplateVersion?._id as string
    };
    onUpdateNodeProperty(
      { [config.propKey]: updatedCollection || '' },
      config.context
    );
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updatedDataset: IDataset = {
      ...(currentDataset || ({} as IDataset)),
      connexion: {
        ...currentDataset?.connexion,
        [name]: value
      }
    };
    onUpdateNodeProperty(
      { [config.propKey]: updatedDataset || '' },
      config.context
    );
  };

  return (
    <div>
      <h3 className='text-sm'>{t('dataset')}</h3>
      <SelectCollectionField
        {...{
          collections,
          config,
          parentForm,
          currentDataset,
          collectionsSelectedCollection,
          onSelectCollection: handleSelectCollection,
          onClearSelectedCollection: handleClearSelectedCollection,
          fetchCollections
        }}
      />

      {config.options?.includes('FIELDS') ? (
        <FieldList
          onSelectField={handleSelectField}
          selectedCollection={collectionsSelectedCollection}
          currentDataset={currentDataset}
        />
      ) : null}
      {config.options?.includes('CREATE') ? (
        <FormField className='mt-2 flex flex-row items-center'>
          <Checkbox
            checked={currentDataset?.isCreation}
            onCheckedChange={handleCreateFormChecked}
            id='create-form'
          />
          <FormLabel className='mb-0 ml-1 text-gray-700' htmlFor='create-form'>
            {t('createANewDocument')}
          </FormLabel>
        </FormField>
      ) : null}
      {config.options?.includes('STATIC_OPTIONS') ? (
        <DatasetStaticOptionsField
          collections={collections}
          config={config}
          onInputChange={handleInputChange}
          selectedNode={selectedNode}
        />
      ) : null}
      {config.options?.includes('ROUTE_PARAM') ? (
        <FormField>
          <FormLabel className='text-gray-700'>{t('routeParam')}</FormLabel>
          <Input
            name='routeParam'
            value={currentDataset?.connexion?.routeParam || ''}
            onChange={handleInputChange}
          />
        </FormField>
      ) : null}
    </div>
  );
};
export default Dataset;
