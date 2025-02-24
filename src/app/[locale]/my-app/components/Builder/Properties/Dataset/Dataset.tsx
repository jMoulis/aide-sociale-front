import { ElementConfigProps } from '../../../interfaces';
import { ICollection, IDataset } from '@/lib/interfaces/interfaces';
import { usePageBuilderStore } from '../../../stores/pagebuilder-store-provider';
import { useTranslations } from 'next-intl';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckedState } from '@radix-ui/react-checkbox';
import FormLabel from '@/components/form/FormLabel';
import FormField from '@/components/form/FormField';
import FieldList from './FieldList';
import { useDataset } from './useDataset';
import DatasetStaticOptionsField from './DatasetStaticOptionsField';
import SelectCollectionField from './SelectCollectionField';
import RouteParam from './RouteParam';
import Query from './Query';
import ParametersToSave from './ParametersToSave';
import { useMemo } from 'react';

type Props = {
  config: ElementConfigProps;
};
const Dataset = ({ config }: Props) => {
  const {
    collections,
    collectionsSelectedCollection,
    parentForm,
    selectedNode,
    fetchCollections,
    setCollectionsSelectedCollection,
    pageTemplateVersion,
    page
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
        ...selectedNode?.context?.dataset?.connexion,
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
          ...selectedNode?.context?.dataset,
          collectionSlug: '',
          collectionName: ''
        }
      },
      config.context
    );
    setCollectionsSelectedCollection(null);
  };

  const handleSelectField = (
    state: CheckedState,
    selectedValue?: string,
    system?: boolean
  ) => {
    let collection: ICollection | null = null;
    if (!pageTemplateVersion?._id) return;

    if (parentForm?.context.dataset?.collectionSlug) {
      collection = collections[parentForm.context.dataset.collectionSlug];
    } else if (selectedNode?.context?.dataset?.collectionSlug) {
      collection = collections[selectedNode?.context?.dataset.collectionSlug];
    }
    if (!collection) return;

    const field = system ? selectedValue : `data.${selectedValue}`;
    const updatedCollection: IDataset = {
      collectionSlug: collection.slug,
      collectionName: collection.name,
      pageTemplateVersionId: pageTemplateVersion?._id as string,
      connexion: {
        ...selectedNode?.context?.dataset?.connexion,
        field: state === true ? field : ''
      }
    };
    onUpdateNodeProperty(
      { [config.propKey]: updatedCollection || '' },
      config.context
    );
  };

  const handleCreateFormChecked = (state: CheckedState) => {
    if (!selectedNode?.context?.dataset) return;
    const collection =
      collections[selectedNode?.context?.dataset.collectionSlug];

    const updatedCollection: IDataset = {
      collectionSlug: collection.slug,
      collectionName: collection.name,
      isCreation: state as unknown as boolean,
      connexion: selectedNode?.context?.dataset.connexion,
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
      ...(selectedNode?.context?.dataset || ({} as IDataset)),
      connexion: {
        ...selectedNode?.context?.dataset?.connexion,
        [name]: value
      }
    };
    onUpdateNodeProperty(
      { [config.propKey]: updatedDataset || '' },
      config.context
    );
  };

  const handleSetParams = (params: string[]) => {
    const updatedDataset: IDataset = {
      ...(selectedNode?.context?.dataset || ({} as IDataset)),
      connexion: {
        ...selectedNode?.context?.dataset?.connexion,
        parametersToSave: params
      }
    };
    onUpdateNodeProperty(
      { [config.propKey]: updatedDataset || '' },
      config.context
    );
  };

  const pageParams = useMemo(() => {
    const extractedParams = page?.route?.match(/:\w+/g) || [];
    return extractedParams
      .map((param) => param.slice(1))
      .map((param) => ({
        label: param,
        value: param
      }));
  }, [page]);

  return (
    <div>
      <h3 className='text-sm'>{t('dataset')}</h3>
      <SelectCollectionField
        {...{
          collections,
          config,
          parentForm,
          currentDataset: selectedNode?.context?.dataset || null,
          collectionsSelectedCollection,
          onSelectCollection: handleSelectCollection,
          onClearSelectedCollection: handleClearSelectedCollection,
          fetchCollections
        }}
      />

      {config.options?.includes('FIELDS') ? (
        <>
          <FieldList
            onSelectField={handleSelectField}
            selectedCollection={collectionsSelectedCollection}
            currentField={selectedNode?.context?.dataset?.connexion?.field}
          />
        </>
      ) : null}

      {config.options?.includes('CREATE') ? (
        <FormField className='mt-2 flex flex-row items-center'>
          <Checkbox
            checked={selectedNode?.context?.dataset?.isCreation}
            onCheckedChange={handleCreateFormChecked}
            id='create-form'
          />
          <FormLabel className='mb-0 ml-1 text-gray-700' htmlFor='create-form'>
            {t('createANewDocument')}
          </FormLabel>
        </FormField>
      ) : null}
      <ParametersToSave
        selectedCollection={collectionsSelectedCollection}
        onSetParams={handleSetParams}
        pageParams={pageParams}
        currentParams={
          selectedNode?.context?.dataset?.connexion?.parametersToSave || []
        }
      />
      {config.options?.includes('STATIC_OPTIONS') ? (
        <DatasetStaticOptionsField
          collections={collections}
          config={config}
          onInputChange={handleInputChange}
          selectedNode={selectedNode}
        />
      ) : null}
      {config.options?.includes('ROUTE_PARAM') ? (
        <RouteParam
          onValueChange={handleInputChange}
          value={selectedNode?.context?.dataset?.connexion?.routeParam || ''}
          pageParams={pageParams}
        />
      ) : null}
      {config.options?.includes('QUERY') ? (
        <Query config={config} selectedNode={selectedNode} />
      ) : null}
    </div>
  );
};
export default Dataset;
