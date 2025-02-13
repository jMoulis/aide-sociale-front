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
};
interface FormContextProps {
  forms: Record<string, FormType>;
  lists: Record<string, any[]>;
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  getFormFieldValue: (context?: VDOMContext) => Value;
  getMultichoiceOptions: (
    dataset?: IDataset
  ) => Promise<{ label: string; value: string }[]>;
  onUpdateForm: (
    collectionSlug: string,
    fieldName: string,
    value?: Value
  ) => void;
}
// Define Context
const FormContext = createContext<FormContextProps>({
  forms: {},
  lists: {},
  onInputChange: () => {},
  getFormFieldValue: () => '',
  onUpdateForm: () => {},
  getMultichoiceOptions: async () => []
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

      if (!collectionSlug) {
        console.error('Collection slug is missing');
        return;
      }
      if (!name) {
        console.error('Name is missing');
        return;
      }
      setAsyncData((prev) => {
        const formToUpdate = prev.forms[collectionSlug] || { data: {} };
        return {
          ...prev,
          forms: {
            ...prev.forms,
            [collectionSlug]: {
              ...formToUpdate,
              data: {
                ...formToUpdate.data,
                [name]: value
              }
            }
          }
        };
      });
    },
    [isBuilderMode]
  );
  const onUpdateForm = useCallback(
    (collectionSlug: string, fieldName: string, value?: Value) => {
      setAsyncData((prev) => {
        const formToUpdate = prev.forms[collectionSlug] || { data: {} };
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
    },
    []
  );
  const getFormFieldValue = useCallback(
    (context?: VDOMContext) => {
      if (isBuilderMode) return '';
      if (!context) return '';
      const { dataset, listIndex } = context;
      if (!dataset?.connexion?.field) return '';
      if (!dataset?.collectionSlug) return '';

      if (listIndex !== undefined) {
        const list = asyncData.lists[dataset.collectionSlug];
        return list?.[listIndex]?.data?.[dataset.connexion.field] || '';
      }
      const form = asyncData.forms[dataset.collectionSlug];

      return form?.data?.[dataset.connexion.field] || '';
    },
    [asyncData.forms, isBuilderMode, asyncData.lists]
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
      const { data } = await client.list<any>(
        externalDataOptions?.collectionSlug as ENUM_COLLECTIONS
      );

      if (!data) return [] as any;
      const options = data.map((item) => ({
        label: item[externalDataOptions.labelField],
        value: item[externalDataOptions.valueField]
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
        getMultichoiceOptions
      } as FormContextProps),
    [
      asyncData,
      onInputChange,
      getFormFieldValue,
      onUpdateForm,
      getMultichoiceOptions
    ]
  );
  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};
