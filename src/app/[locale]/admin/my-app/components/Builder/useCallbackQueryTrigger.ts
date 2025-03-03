import { AsyncPayloadMap, IDatasetConnexion, IQuery, VDOMContext } from "@/lib/interfaces/interfaces";
import { FormType, useFormContext, Value } from "./Components/FormContext";
import { isValidJSON } from "@/lib/utils/utils";
import { executeQueryChain, getMethod } from "@/app/[locale]/app/utils/sharedUtils";
import client from "@/lib/mongo/initMongoClient";
import { useCallback } from "react";

const getValue = (field: string, form: FormType) => {
  // get field value from output form
  const fields = field.split('.');
  const fieldName = fields[fields.length - 1];
  const fieldValue = fields.reduce(
    (acc, field) => (acc as any)?.[field],
    form
  ) as unknown as Value;
  return { fieldName, fieldValue };
};

const checkStoreExistance = (asyncData: AsyncPayloadMap, datasetKey: 'input' | 'output', connexion?: IDatasetConnexion) => {
  if (!connexion || !connexion[datasetKey]) {
    console.warn('Connexion is missing');
    return {
      asyncStore: null,
      config: null
    };
  }
  const storeSlug = connexion[datasetKey].storeSlug;
  if (!storeSlug) {
    console.warn('Store ID is missing');
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
export const useCallbackQueryTrigger = () => {
  const { asyncData, onUpdateQueryResults, onUpdateForm } = useFormContext();

  const executeQuery = useCallback(async (context: VDOMContext) => {

    if (!context.dataset?.connexion?.input?.query) {
      console.warn('Query is missing');
      return
    };
    const queryString = context.dataset.connexion.input.query;

    const storeSlug = context.dataset.connexion.input.storeSlug;

    if (!storeSlug) {
      console.warn('Store ID is missing');
      return;
    }
    const asyncStore = asyncData[storeSlug];

    if (!asyncStore) {
      console.warn('Store not found');
      return;
    }
    if (
      isValidJSON(queryString) &&
      asyncStore?.data
    ) {
      const query = JSON.parse(queryString) as
        | IQuery
        | IQuery[];


      if (Array.isArray(query)) {
        await executeQueryChain({
          client,
          queries: query,
          params: asyncStore.data,
          onSuccess: (payload: Record<string, any>) =>
            onUpdateQueryResults(payload, context, 'output')
        });
      } else {

        await getMethod(
          client,
          query,
          {},
          asyncStore.data,
          (payload: Record<string, any>) => {
            onUpdateQueryResults(payload, context, 'output');
          }
        );
      }
    }
  }, [asyncData, onUpdateQueryResults]);

  const executeChangeTrigger = useCallback(async (context: VDOMContext) => {
    const { asyncStore: asyncInputStore, config: inputConfig } = checkStoreExistance(asyncData, 'input', (context.dataset?.connexion));
    const { asyncStore: asyncOutputStore, config: outputConfig } = checkStoreExistance(asyncData, 'output', (context.dataset?.connexion));

    if (!asyncOutputStore || !asyncInputStore) {
      console.warn('Store not found');
      return;
    }
    const outputField = outputConfig.field;
    const inputField = inputConfig.field;

    if (!inputField) {
      console.warn('Field is missing');
      return;
    }
    const inputValue = getValue(inputField, asyncInputStore.data as FormType);
    onUpdateForm(context, asyncOutputStore.store.slug, outputField || '', inputValue.fieldValue);
  }, [asyncData, onUpdateForm]);

  return {
    executeQuery,
    executeChangeTrigger
  }
}