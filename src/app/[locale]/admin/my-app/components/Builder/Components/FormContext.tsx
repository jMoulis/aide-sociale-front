import {
  AsyncForms,
  AsyncLists,
  AsyncPayloadMap,
  IDataset,
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

type Value =
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
  forms: AsyncForms;
  lists: AsyncLists;
  queryResults: Record<string, any>;
  onUpdateList: (collectionSlug: string, list: any[]) => void;
  onAddListItem: (collectionSlug: string, item: any) => void;
  // onInputChange: (
  //   e: React.ChangeEvent<
  //     HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  //   >,
  //   context: VDOMContext
  // ) => void;
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
    storeId: string,
    fieldName: string,
    value?: Value
  ) => void;
}
// Define Context
const FormContext = createContext<FormContextProps>({
  forms: {},
  lists: {},
  queryResults: {},
  onUpdateList: () => {},
  onAddListItem: () => {},
  // onInputChange: () => {},
  getFormFieldValue: () => '',
  onUpdateForm: () => {},
  getMultichoiceOptions: async () => [],
  getListItem: () => {},
  onUpdateQueryResults: () => {}
});

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
  const [queryResults, setQueryResults] = useState<Record<string, any>>({});

  const onInputChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
      context: VDOMContext
    ) => {
      if (isBuilderMode) return;
      const { name, value } = e.target;
      console.log(context.dataset);
      const storeId = context.dataset?.connexion?.input?.storeId;
      const listIndex = context.listIndex;
      const unbind = context.unbind;
      if (!storeId) {
        console.error('Collection slug is missing');
        return;
      }
      if (!name) {
        console.error('Name is missing');
        return;
      }

      if (listIndex !== undefined) {
        if (unbind) {
          const output = context.dataset?.connexion?.output;
          const input = context.dataset?.connexion?.input;
          const inputStoreId = input?.storeId;
          const outputStoreId = output?.storeId;

          if (!outputStoreId || !inputStoreId) return;

          const asyncOutput = asyncData.forms[outputStoreId];
          const asyncInput = asyncData.lists[inputStoreId];

          console.log(asyncOutput, asyncInput);
          const inputForm =
            asyncInput?.list?.find(
              (_item: any, index: number) => index === Number(listIndex)
            ) || ({ data: {} } as FormType);

          const getValue = (field: string, form: FormType) => {
            // get field value from output form
            const fields = field.split('.');
            const fieldName = fields[fields.length - 1];
            const fieldValue = fields.reduce(
              (acc, field) => (acc as any)?.[field],
              form
            );
            return { fieldName, fieldValue };
          };

          const { fieldName: inputFieldName, fieldValue: inputValue } =
            getValue(input.field || '', inputForm);
          const { fieldValue: outputValue, fieldName: outputFieldName } =
            getValue(output?.field || '', asyncOutput.form);

          console.log('output', outputValue, outputFieldName);
          console.log('input', inputValue, inputFieldName);

          setAsyncData((prev) => {
            return {
              ...prev,
              forms: {
                ...prev.forms,
                [outputStoreId]: {
                  ...prev.forms[outputStoreId],
                  // store: asyncOutput.store,
                  form: {
                    ...prev.forms[outputStoreId]?.form,
                    data: {
                      ...prev.forms[outputStoreId]?.form?.data,
                      [outputFieldName]: inputValue
                    }
                  }
                }
                // [inputStoreId]: {
                //   ...prev.forms[inputStoreId],
                //   form: {
                //     ...asyncOutput.form,
                //     data: {
                //       ...asyncOutput.form.data,
                //       [fieldName]: inputValue
                //     }
                //   }
                // }
              }
            };
          });
          return;
        }
        const list = asyncData.lists[storeId]?.list;

        const listFormItem = list?.find(
          (_item: any, index: number) => index === Number(listIndex)
        ) || { data: {} };

        const fields = name.split('.');
        const fieldName = fields[fields.length - 1];

        const updatedList = {
          ...listFormItem,
          data: {
            ...listFormItem.data,
            [fieldName]: value
          }
        };
        const updatedLists = list?.map((item: any, index: number) => {
          if (index === Number(listIndex)) {
            return updatedList;
          }
          return item;
        });
        setAsyncData((prev) => {
          return {
            ...prev,
            lists: {
              ...prev.lists,
              [storeId]: {
                ...prev.lists[storeId],
                list: updatedLists
              }
            }
          };
        });
      } else {
        setAsyncData((prev) => {
          const form = prev.forms[storeId] || {
            data: {}
          };
          const fields = name.split('.');
          const fieldName = fields[fields.length - 1];

          return {
            ...prev,
            forms: {
              ...prev.forms,
              [storeId]: {
                ...form,
                form: {
                  ...form.form,
                  data: {
                    ...form.form.data,
                    [fieldName]: value
                  }
                }
              }
            }
          };
        });
      }
    },
    [asyncData.lists, isBuilderMode, asyncData.forms]
  );

  const onUpdateList = useCallback((storeId: string, list: any[]) => {
    setAsyncData((prev) => {
      return {
        ...prev,
        lists: {
          ...prev.lists,
          [storeId]: {
            ...prev.lists[storeId],
            list
          }
        }
      };
    });
  }, []);

  const onUpdateForm = useCallback(
    (
      context: VDOMContext,
      storeId: string,
      fieldName: string,
      value?: Value
    ) => {
      const listIndex = context.listIndex;
      if (listIndex !== undefined) {
        const list = asyncData.lists[storeId]?.list;
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
            lists: {
              ...prev.lists,
              [storeId]: {
                ...prev.lists[storeId],
                list: updatedLists
              }
            }
          };
        });
      } else {
        setAsyncData((prev) => {
          const formToUpdate = prev.forms[storeId] || { data: {} };
          const fields = fieldName.split('.');
          const field = fields[fields.length - 1];

          return {
            ...prev,
            forms: {
              ...prev.forms,
              [storeId]: {
                ...formToUpdate,
                form: {
                  ...formToUpdate.form,
                  data: {
                    ...formToUpdate.form?.data,
                    [field]: value
                  }
                }
              }
            }
          };
        });
      }
    },
    [asyncData.lists]
  );

  const onAddListItem = useCallback((storeId: string, item: any) => {
    setAsyncData((prev) => {
      return {
        ...prev,
        lists: {
          ...prev.lists,
          [storeId]: {
            ...prev.lists[storeId],
            list: [...(prev.lists[storeId]?.list || []), item]
          }
        }
      };
    });
  }, []);

  const getFormFieldValue = useCallback(
    (context?: VDOMContext) => {
      if (isBuilderMode) return '';
      if (!context) return '';
      const { dataset, listIndex } = context;
      if (!dataset?.connexion?.input?.storeId) return '';
      const asyncForm = asyncData.forms[dataset.connexion.input.storeId];
      const fields = (dataset.connexion.input?.field || '').split('.');

      if (listIndex !== undefined) {
        const asyncList = asyncData.lists[dataset.connexion.input.storeId];

        // if (dataset?.connexion?.input?.plugToQuery) {
        //   const field = fields[fields.length - 1];
        //   const result = queryResults[dataset.connexion.input?.plugToQuery];
        //   const value = result?.[listIndex]?.[field];
        //   return value;
        // }
        const mapper: FormType[] = asyncList?.list || [];
        const value =
          fields.reduce(
            (acc, field) => (acc as any)?.[field],
            mapper?.[listIndex]
          ) || '';
        return value;
      }
      return (
        fields.reduce((acc, field) => (acc as any)?.[field], asyncForm.form) ||
        ''
      );
    },
    [asyncData.forms, isBuilderMode, asyncData.lists]
  );

  const getListItem = useCallback(
    (context?: VDOMContext) => {
      if (!context) return null;
      const { dataset, listIndex } = context;
      if (!dataset) return null;
      if (listIndex !== undefined && dataset.connexion?.input?.storeId) {
        const asyncList = asyncData.lists[dataset.connexion.input.storeId];
        return asyncList?.list?.[listIndex]?.data || null;
      }
    },
    [asyncData.lists]
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
      const outputStoreId = context.dataset?.connexion?.[datasetKey]?.storeId;

      if (!outputStoreId) return;

      const result = results[outputStoreId];

      const asyncStore =
        asyncData.lists[outputStoreId] || asyncData.forms[outputStoreId];

      if (!asyncStore) {
        console.error('Store not found');
        return;
      }

      if (Array.isArray(result) && asyncStore.store.type === 'list') {
        setAsyncData((prev) => ({
          ...prev,
          lists: {
            ...prev.lists,
            [outputStoreId]: {
              ...asyncStore,
              list: result
            }
          }
        }));
      } else if (asyncStore.store.type === 'form' && !Array.isArray(result)) {
        setAsyncData((prev) => ({
          ...prev,
          forms: {
            ...prev.forms,
            [outputStoreId]: {
              ...asyncStore,
              form: result
            }
          }
        }));
      }
    },
    [asyncData.lists, asyncData.forms]
  );

  const value = useMemo(
    () =>
      ({
        forms: asyncData.forms,
        lists: asyncData.lists,
        queryResults,
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
      queryResults,
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
