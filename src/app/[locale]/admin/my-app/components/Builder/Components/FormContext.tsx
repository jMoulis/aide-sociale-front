import {
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
  forms: Record<string, FormType>;
  lists: Record<string, any[]>;
  onUpdateList: (collectionSlug: string, list: any[]) => void;
  onAddListItem: (collectionSlug: string, item: any) => void;
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onMultiSelectChange: (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => void;
  getListItem: (context?: VDOMContext) => any;
  getFormFieldValue: (context?: VDOMContext) => Value;
  getMultichoiceOptions: (
    dataset?: IDataset
  ) => Promise<{ label: string; value: string }[]>;

  onUpdateForm: (
    collectionSlug: string,
    fieldName: string,
    value?: Value,
    listIndex?: number
  ) => void;
}
// Define Context
const FormContext = createContext<FormContextProps>({
  forms: {},
  lists: {},
  onUpdateList: () => {},
  onAddListItem: () => {},
  onInputChange: () => {},
  onMultiSelectChange: () => {},
  getFormFieldValue: () => '',
  onUpdateForm: () => {},
  getMultichoiceOptions: async () => [],
  getListItem: () => {}
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

  const onInputChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      if (isBuilderMode) return;
      const { name, value } = e.target;
      const collectionSlug = e.target.dataset.collection;
      const listIndex = e.target.dataset.listindex;
      if (!collectionSlug) {
        console.error('Collection slug is missing');
        return;
      }
      if (!name) {
        console.error('Name is missing');
        return;
      }

      if (listIndex !== undefined) {
        const list = asyncData.lists[collectionSlug]?.find(
          (_item: any, index: number) => index === Number(listIndex)
        ) || { data: {} };

        const fields = name.split('.');
        const fieldName = fields[fields.length - 1];

        const updatedList = {
          ...list,
          data: {
            ...list.data,
            [fieldName]: value
          }
        };

        const updatedLists = asyncData.lists[collectionSlug].map(
          (item: any, index: number) => {
            if (index === Number(listIndex)) {
              return updatedList;
            }
            return item;
          }
        );
        setAsyncData((prev) => {
          return {
            ...prev,
            lists: {
              ...prev.lists,
              [collectionSlug]: updatedLists
            }
          };
        });
      } else {
        setAsyncData((prev) => {
          const formToUpdate = prev.forms[collectionSlug] || { data: {} };
          const fields = name.split('.');
          const fieldName = fields[fields.length - 1];
          return {
            ...prev,
            forms: {
              ...prev.forms,
              [collectionSlug]: {
                ...formToUpdate,
                data: {
                  ...formToUpdate.data,
                  [fieldName]: value
                }
              }
            }
          };
        });
      }
    },
    [asyncData.lists, isBuilderMode]
  );

  const onUpdateList = useCallback((collectionSlug: string, list: any[]) => {
    setAsyncData((prev) => {
      return {
        ...prev,
        lists: {
          ...prev.lists,
          [collectionSlug]: list
        }
      };
    });
  }, []);

  const onUpdateForm = useCallback(
    (
      collectionSlug: string,
      fieldName: string,
      value?: Value,
      listIndex?: number
    ) => {
      if (listIndex !== undefined) {
        const list = asyncData.lists[collectionSlug]?.find(
          (_item: any, index: number) => index === Number(listIndex)
        );

        if (!list) return;

        const fields = fieldName.split('.');
        const field = fields[fields.length - 1];
        const updatedList = {
          ...list,
          data: {
            ...list.data,
            [field]: value
          }
        };
        const updatedLists = asyncData.lists[collectionSlug].map(
          (item: any, index: number) => {
            if (index === Number(listIndex)) {
              return updatedList;
            }
            return item;
          }
        );

        setAsyncData((prev) => {
          return {
            ...prev,
            lists: {
              ...prev.lists,
              [collectionSlug]: updatedLists
            }
          };
        });
      } else {
        setAsyncData((prev) => {
          const formToUpdate = prev.forms[collectionSlug] || { data: {} };
          const fields = fieldName.split('.');
          const field = fields[fields.length - 1];
          return {
            ...prev,
            forms: {
              ...prev.forms,
              [collectionSlug]: {
                ...formToUpdate,
                data: {
                  ...formToUpdate.data,
                  [field]: value
                }
              }
            }
          };
        });
      }
    },
    [asyncData.lists]
  );

  const onAddListItem = useCallback((collectionSlug: string, item: any) => {
    setAsyncData((prev) => {
      return {
        ...prev,
        lists: {
          ...prev.lists,
          [collectionSlug]: [...(prev.lists[collectionSlug] || []), item]
        }
      };
    });
  }, []);

  const getFormFieldValue = useCallback(
    (context?: VDOMContext) => {
      if (isBuilderMode) return '';
      if (!context) return '';
      const { dataset, listIndex } = context;

      if (!dataset?.connexion?.field) return '';
      if (!dataset?.collectionSlug) return '';

      const fields = dataset.connexion.field.split('.');

      if (listIndex !== undefined) {
        const list = asyncData.lists[dataset.collectionSlug];
        const value =
          fields.reduce(
            (acc, field) => (acc as any)?.[field],
            list?.[listIndex]
          ) || '';
        return value;
      }
      const form = asyncData.forms[dataset.collectionSlug];
      return fields.reduce((acc, field) => (acc as any)?.[field], form) || '';
    },
    [asyncData.forms, isBuilderMode, asyncData.lists]
  );

  const getListItem = useCallback(
    (context?: VDOMContext) => {
      if (!context) return null;
      const { dataset, listIndex } = context;
      if (!dataset) return null;
      if (listIndex !== undefined) {
        const list = asyncData.lists[dataset.collectionSlug];
        return list?.[listIndex]?.data || null;
      }
    },
    [asyncData.lists]
  );

  const getMultichoiceOptions = useCallback(async (dataset: IDataset) => {
    const connexion = dataset?.connexion;
    if (!connexion) return [];

    const externalDataOptions = connexion.externalDataOptions;
    const staticDataOptions = connexion.staticDataOptions;

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

  const value = useMemo(
    () =>
      ({
        forms: asyncData.forms,
        lists: asyncData.lists,
        onInputChange,
        getFormFieldValue,
        onUpdateForm,
        getMultichoiceOptions,
        getListItem,
        onUpdateList,
        onAddListItem
        // onMultiSelectChange
      } as FormContextProps),
    [
      asyncData,
      onInputChange,
      getFormFieldValue,
      onUpdateForm,
      getMultichoiceOptions,
      getListItem,
      onUpdateList,
      onAddListItem
      // onMultiSelectChange
    ]
  );
  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};
