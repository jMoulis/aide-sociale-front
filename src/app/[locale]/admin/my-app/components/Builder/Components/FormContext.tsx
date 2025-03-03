import {
  AsyncPayloadMap,
  IDataset,
  IDatasetConnexion,
  IUserSummary,
  VDOMContext
} from '@/lib/interfaces/interfaces';
import client from '@/lib/mongo/initMongoClient';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import React, {
  useState,
  createContext,
  useContext,
  useCallback,
  useMemo
} from 'react';
import { DateRange } from 'react-day-picker';

export type Value =
  | string
  | Date
  | boolean
  | number
  | null
  | DateRange
  | number[]
  | string[];

export type FormType = {
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: IUserSummary;
  updatedBy?: IUserSummary;
  templatePageVersionId: string;
  data: Record<string, any>;
  collectionSlug?: string;
  organizationId: string;
};
interface FormContextProps {
  asyncData: AsyncPayloadMap;
  onUpdateList: (collectionSlug: string, list: any[]) => void;
  onAddListItem: (collectionSlug: string, item: any) => void;
  onUpdateQueryResults: (
    results: Record<string, FormType | FormType[]>,
    context: VDOMContext,
    datasetKey: 'input' | 'output'
  ) => void;
  getListItem: (context?: VDOMContext) => any;
  getFormFieldValue: (context?: VDOMContext) => Value;
  getMultichoiceOptions: (
    dataset?: IDataset
  ) => Promise<{ label: string; value: string }[]>;
  onUpdateForm: (
    context: VDOMContext,
    storeSlug: string,
    fieldName: string,
    value?: Value
  ) => void;
}
// Define Context
const FormContext = createContext<FormContextProps>({
  asyncData: {},
  onUpdateList: () => {},
  onAddListItem: () => {},
  getFormFieldValue: () => '',
  onUpdateForm: () => {},
  getMultichoiceOptions: async () => [],
  getListItem: () => {},
  onUpdateQueryResults: () => {}
});
const checkStoreExistance = (
  asyncData: AsyncPayloadMap,
  datasetKey: 'input' | 'output',
  connexion?: IDatasetConnexion
) => {
  if (!connexion || !connexion[datasetKey]) {
    console.warn('Connexion is missing');
    return {
      asyncStore: null,
      config: null
    };
  }
  const storeSlug = connexion[datasetKey].storeSlug;

  if (!storeSlug) {
    return {
      asyncStore: null,
      config: connexion[datasetKey]
    };
  }
  if (!asyncData[storeSlug]) {
    console.warn('Store not found');
    return {
      asyncStore: null,
      config: connexion[datasetKey]
    };
  }
  return {
    asyncStore: asyncData[storeSlug],
    config: connexion[datasetKey]
  };
};
const executeOutput = (
  asyncPayload: AsyncPayloadMap,
  context: VDOMContext,
  inputValue?: Value
) => {
  if (!context.dataset?.connexion?.output) {
    return {};
  }
  const { asyncStore: asyncOutputStore, config: outputConfig } =
    checkStoreExistance(asyncPayload, 'output', context.dataset?.connexion);
  if (!asyncOutputStore) {
    console.warn('Store not found');
    return {};
  }
  const outputField = outputConfig.field;
  if (!outputField) {
    console.warn('Field not found');
    return {};
  }
  const fields = outputField.split('.');
  const field = fields[fields.length - 1];
  return {
    [asyncOutputStore.store.slug]: {
      ...asyncOutputStore,
      data: {
        ...asyncOutputStore.data,
        data: {
          ...(asyncOutputStore.data as FormType)?.data,
          [field]: inputValue
        }
      }
    }
  };
};
export const useFormContext = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  const memoizedContext = useMemo(() => context, [context]);
  return memoizedContext;
};
type FormProviderProps = {
  children: React.ReactNode;
  asyncData: AsyncPayloadMap;
  isBuilderMode?: boolean;
};
export const FormProvider = ({
  children,
  asyncData: initialAsyncData,
  isBuilderMode
}: FormProviderProps) => {
  const [asyncData, setAsyncData] = useState<AsyncPayloadMap>(initialAsyncData);

  const onUpdateList = useCallback((storeSlug: string, data: FormType[]) => {
    setAsyncData((prev) => {
      return {
        ...prev,
        [storeSlug]: {
          ...prev[storeSlug],
          data
        }
      };
    });
  }, []);

  const onUpdateForm = useCallback(
    (
      context: VDOMContext,
      storeSlug: string,
      fieldName: string,
      value?: Value
    ) => {
      const listIndex = context.listIndex;
      if (listIndex !== undefined) {
        const list = (asyncData[storeSlug]?.data as FormType[]) || [];
        const listFormItem = list?.find(
          (_item: any, index: number) => index === Number(listIndex)
        );

        if (!listFormItem) return;

        const fields = fieldName.split('.');
        const field = fields[fields.length - 1];

        const updatedList = {
          ...listFormItem,
          data: {
            ...listFormItem.data,
            [field]: value
          }
        };
        const updatedLists = list.map((item: any, index: number) => {
          if (index === Number(listIndex)) {
            return updatedList;
          }
          return item;
        });

        setAsyncData((prev) => {
          return {
            ...prev,
            [storeSlug]: {
              ...prev[storeSlug],
              data: updatedLists
            }
          };
        });
      } else {
        setAsyncData((prev) => {
          const formToUpdate = prev[storeSlug] || { data: {} };
          const fields = fieldName.split('.');
          const field = fields[fields.length - 1];
          return {
            ...prev,
            [storeSlug]: {
              ...formToUpdate,
              data: {
                ...formToUpdate.data,
                data: {
                  ...(prev[storeSlug].data as FormType)?.data,
                  [field]: value
                }
              }
            },
            ...executeOutput(prev, context, value)
          };
        });
      }
    },
    [asyncData]
  );

  const onAddListItem = useCallback((storeSlug: string, item: any) => {
    setAsyncData((prev) => {
      return {
        ...prev,
        [storeSlug]: {
          ...prev[storeSlug],
          data: [...((prev[storeSlug]?.data as FormType[]) || []), item]
        }
      };
    });
  }, []);

  const getFormFieldValue = useCallback(
    (context?: VDOMContext) => {
      if (isBuilderMode) return '';
      if (!context) return '';
      const { dataset, listIndex } = context;
      if (!dataset?.connexion?.input?.storeSlug) return '';
      const asyncForm = asyncData[dataset.connexion.input.storeSlug];
      const fields = (dataset.connexion.input?.field || '').split('.');

      if (listIndex !== undefined) {
        const asyncList = asyncData[dataset.connexion.input.storeSlug];
        const mapper: FormType[] = (asyncList?.data as FormType[]) || [];
        const value =
          fields.reduce(
            (acc, field) => (acc as any)?.[field],
            mapper?.[listIndex]
          ) || '';
        return value;
      }
      return (
        fields.reduce((acc, field) => (acc as any)?.[field], asyncForm.data) ||
        ''
      );
    },
    [asyncData, isBuilderMode]
  );

  const getListItem = useCallback(
    (context?: VDOMContext) => {
      if (!context) return null;
      const { dataset, listIndex } = context;
      if (!dataset) return null;
      if (listIndex !== undefined && dataset.connexion?.input?.storeSlug) {
        const asyncList = asyncData[dataset.connexion.input.storeSlug];
        return (asyncList?.data as FormType[])?.[listIndex]?.data || null;
      }
    },
    [asyncData]
  );

  const getMultichoiceOptions = useCallback(async (dataset: IDataset) => {
    const connexion = dataset?.connexion;
    if (!connexion) return [];

    const externalDataOptions = connexion.input?.externalDataOptions;
    const staticDataOptions = connexion.input?.staticDataOptions;

    if (!externalDataOptions && !staticDataOptions) return [];

    if (
      externalDataOptions?.collectionSlug &&
      externalDataOptions?.labelField &&
      externalDataOptions?.valueField
    ) {
      const { data } = await client.list<FormType>(
        externalDataOptions?.collectionSlug as ENUM_COLLECTIONS
      );

      if (!data) return [];
      const options = data.map((item) => ({
        label: item.data[externalDataOptions.labelField],
        value: item.data[externalDataOptions.valueField]
      }));
      return options;
    }
    if (staticDataOptions) {
      return staticDataOptions.map((option) => ({
        value: option,
        label: option
      }));
    }
    return [] as any;
  }, []);

  const onUpdateQueryResults = useCallback(
    (
      results: Record<string, FormType | FormType[]>,
      context: VDOMContext,
      datasetKey: 'input' | 'output'
    ) => {
      const outputstoreSlug =
        context.dataset?.connexion?.[datasetKey]?.storeSlug;
      if (!outputstoreSlug) {
        console.error('storeSlug not found');
        return;
      }

      const result = results[outputstoreSlug];

      const asyncStore = asyncData[outputstoreSlug];
      if (!asyncStore) {
        console.error('Store not found');
        return;
      }

      if (Array.isArray(result) && asyncStore.store.type === 'list') {
        setAsyncData((prev) => ({
          ...prev,
          [outputstoreSlug]: {
            ...asyncStore,
            data: result
          }
        }));
      } else if (asyncStore.store.type === 'form' && !Array.isArray(result)) {
        setAsyncData((prev) => ({
          ...prev,
          [outputstoreSlug]: {
            ...asyncStore,
            data: result
          }
        }));
      }
    },
    [asyncData]
  );

  const value = useMemo(
    () =>
      ({
        asyncData,
        // queryResults,
        // onInputChange,
        getFormFieldValue,
        onUpdateForm,
        getMultichoiceOptions,
        getListItem,
        onUpdateList,
        onAddListItem,
        onUpdateQueryResults
      } as FormContextProps),
    [
      asyncData,
      // queryResults,
      // onInputChange,
      getFormFieldValue,
      onUpdateForm,
      getMultichoiceOptions,
      getListItem,
      onUpdateList,
      onAddListItem,
      onUpdateQueryResults
    ]
  );

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};
