import { ElementConfigProps } from '../../../interfaces';
import { IDataset } from '@/lib/interfaces/interfaces';
import { usePageBuilderStore } from '../../../stores/pagebuilder-store-provider';
import { useTranslations } from 'next-intl';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckedState } from '@radix-ui/react-checkbox';
import FormLabel from '@/components/form/FormLabel';
import FormField from '@/components/form/FormField';
import FieldList from './FieldList';
import { useDataset } from './useDataset';
import DatasetStaticOptionsField from './DatasetStaticOptionsField';
import RouteParam from './RouteParam';
import Query from './Query';
import ParametersToSave from './ParametersToSave';
import { ChangeEvent, useMemo } from 'react';
import DeleteButton from '@/components/buttons/DeleteButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUnlink } from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import Selectbox from '@/components/form/Selectbox';

type Props = {
  config: ElementConfigProps;
  datasetKey: 'input' | 'output';
};
const Dataset = ({ config, datasetKey }: Props) => {
  const {
    collections,
    collectionsSelectedCollection,
    selectedNode,
    pageTemplateVersion,
    page
  } = useDataset({ config, datasetKey });

  const onUpdateNodeProperty = usePageBuilderStore(
    (state) => state.onUpdateNodeProperty
  );
  const t = useTranslations('CollectionSection');

  const handleSelectField = (
    state: CheckedState,
    selectedValue?: string,
    system?: boolean
  ) => {
    if (!pageTemplateVersion?._id) return;
    const field = system ? selectedValue : `data.${selectedValue}`;
    const updatedDataset: IDataset = {
      ...selectedNode?.context?.dataset,
      pageTemplateVersionId: pageTemplateVersion?._id as string,
      connexion: {
        ...selectedNode?.context?.dataset?.connexion,
        [datasetKey]: {
          ...selectedNode?.context?.dataset?.connexion?.[datasetKey],
          field: state === true ? field : ''
        }
      }
    };
    onUpdateNodeProperty(
      { [config.propKey]: updatedDataset || '' },
      config.context
    );
  };

  const handleCreateFormChecked = (state: CheckedState) => {
    if (!selectedNode?.context?.dataset) return;
    const updatedCollection: IDataset = {
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
        [datasetKey]: {
          ...selectedNode?.context?.dataset?.connexion?.[datasetKey],
          [name]: value
        }
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
        [datasetKey]: {
          ...selectedNode?.context?.dataset?.connexion?.[datasetKey],
          parametersToSave: params
        }
      }
    };
    onUpdateNodeProperty(
      { [config.propKey]: updatedDataset || '' },
      config.context
    );
  };

  const handleSelectStore = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    const updatedDataset: IDataset = {
      ...(selectedNode?.context?.dataset as IDataset),
      connexion: {
        ...selectedNode?.context?.dataset?.connexion,
        [datasetKey]: {
          ...selectedNode?.context?.dataset?.connexion?.[datasetKey],
          storeSlug: value
        }
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
  const handleRemoveStore = () => {
    const updatedDataset: IDataset = {
      ...(selectedNode?.context?.dataset as IDataset),
      connexion: {
        ...selectedNode?.context?.dataset?.connexion,
        [datasetKey]: {
          ...selectedNode?.context?.dataset?.connexion?.[datasetKey],
          storeSlug: ''
        }
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
      <div className='flex'>
        <Selectbox
          options={(pageTemplateVersion?.stores || []).map((store) => ({
            label: store.name,
            value: store.slug
          }))}
          value={
            selectedNode?.context?.dataset?.connexion?.[datasetKey]
              ?.storeSlug || ''
          }
          onChange={handleSelectStore}
        />
        <DeleteButton onClick={handleRemoveStore}>
          <FontAwesomeIcon icon={faUnlink} />
        </DeleteButton>
      </div>
      {/* {config.options?.includes('FIELDS') ? ( */}
      <>
        <FieldList
          onSelectField={handleSelectField}
          // selectedCollection={collectionsSelectedCollection}
          selectedCollection={collectionsSelectedCollection}
          currentField={
            selectedNode?.context?.dataset?.connexion?.[datasetKey]?.field
          }
        />
      </>
      {/* ) : null} */}

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
          selectedNode?.context?.dataset?.connexion?.[datasetKey]
            ?.parametersToSave || []
        }
      />
      {config.options?.includes('STATIC_OPTIONS') ? (
        <DatasetStaticOptionsField
          collections={collections}
          config={config}
          datasetKey={datasetKey}
          onInputChange={handleInputChange}
          selectedNode={selectedNode}
        />
      ) : null}
      {config.options?.includes('ROUTE_PARAM') ? (
        <RouteParam
          onValueChange={handleInputChange}
          value={
            selectedNode?.context?.dataset?.connexion?.[datasetKey]
              ?.routeParam || ''
          }
          pageParams={pageParams}
        />
      ) : null}
      {config.options?.includes('QUERY') ? (
        <Query
          datasetKey={datasetKey}
          config={config}
          selectedNode={selectedNode}
        />
      ) : null}
    </div>
  );
};
export default Dataset;
