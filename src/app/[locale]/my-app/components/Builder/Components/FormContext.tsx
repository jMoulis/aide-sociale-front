import { IDataset, IUserSummary } from '@/lib/interfaces/interfaces';
import React, {
  useState,
  createContext,
  useContext,
  useCallback,
  useMemo
} from 'react';

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
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  getFormFieldValue: (dataset?: IDataset) => string;
}
// Define Context
const FormContext = createContext<FormContextProps>({
  forms: {},
  onInputChange: () => {},
  getFormFieldValue: () => ''
});

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  const memoizedContext = useMemo(() => context, [context]);
  return memoizedContext;
};
export const FormProvider = ({
  children,
  forms: initialForms,
  isBuilderMode
}: {
  children: React.ReactNode;
  forms: Record<string, FormType>;
  isBuilderMode?: boolean;
}) => {
  const [forms, setForms] = useState<Record<string, FormType>>(initialForms);

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isBuilderMode) return;
      const { name, value } = e.target;
      const collectionSlug = e.target.dataset.collection;
      if (!collectionSlug) {
        // eslint-disable-next-line no-console
        console.error('Collection slug is missing');
        return;
      }
      setForms((prev) => {
        const formToUpdate = prev[collectionSlug] || { data: {} };
        return {
          ...prev,
          [collectionSlug]: {
            ...formToUpdate,
            data: {
              ...formToUpdate.data,
              [name]: value
            }
          }
        };
      });
    },
    [isBuilderMode]
  );
  const getFormFieldValue = useCallback(
    (dataset?: IDataset) => {
      if (isBuilderMode) return '';
      if (!dataset?.connexion?.field) return '';
      if (!dataset?.collectionSlug) return '';
      const form = forms[dataset.collectionSlug];
      return form?.data?.[dataset.connexion.field] || '';
    },
    [forms, isBuilderMode]
  );
  const value = useMemo(
    () => ({ forms, onInputChange, getFormFieldValue }),
    [forms, onInputChange, getFormFieldValue]
  );
  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};
