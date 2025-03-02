import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import Button from '@/components/buttons/Button';
import ChildrenDndWrapper from './ChildrenDndWrapper';
import { useFormContext } from './FormContext';
import { IQuery } from '@/lib/interfaces/interfaces';
import { isValidJSON } from '@/lib/utils/utils';
import {
  executeQueryChain,
  replacePlaceholdersRecursively
} from '@/app/[locale]/app/utils/sharedUtils';
import client from '@/lib/mongo/initMongoClient';
import MongoRealtimeClient from '@/lib/mongo/clients/MongoRealtimeClient';
import MongoServerClient from '@/lib/mongo/clients/MongoServerClient';

export const getMethod = async (
  client: MongoRealtimeClient | MongoServerClient,
  query: IQuery,
  data: any,
  params: any
) => {
  const { collection, upsertOptions } = query;
  const filters = replacePlaceholdersRecursively(query.filters, params);

  const aggregateOptions = query.aggregateOptions
    ? replacePlaceholdersRecursively(query.aggregateOptions, params)
    : undefined;
  const matchQuery = query.matchQuery
    ? replacePlaceholdersRecursively(query.matchQuery, params)
    : undefined;
  const upsertQuery = query.upsertQuery
    ? replacePlaceholdersRecursively(query.upsertQuery, params)
    : undefined;
  const updateOptions = query.updateOptions
    ? replacePlaceholdersRecursively(query.updateOptions, params)
    : undefined;

  switch (query.method) {
    case 'update':
      return client.update<any>(collection, filters, data, updateOptions);
    case 'create':
      return client.create<any>(collection, data, updateOptions);
    case 'delete':
      return client.delete(collection, filters._id);
    case 'list':
      return client.list<any>(collection, filters);
    case 'get':
      return client.get<any>(collection, filters);
    case 'search': {
      if (!aggregateOptions) {
        return null;
      }
      return client.search(collection, aggregateOptions);
    }
    case 'update-many': {
      if (!matchQuery || !upsertQuery) {
        return null;
      }
      return client.updateMany(
        collection,
        matchQuery,
        upsertQuery,
        upsertOptions
      );
    }
    default:
      return null;
  }
};
function ButtonComponent({
  props,
  children,
  context,
  dndChildrenContainerRef
}: PropsWithChildrenAndContext) {
  const { asyncData, onUpdateQueryResults } = useFormContext();

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (context.isBuilderMode && typeof props.onClick === 'function') {
      props.onClick(event);
      return;
    }
    const buttonType = props.type;
    // Am84xjPtOIYiK2nSv3eWc
    if (buttonType !== 'submit') {
      event.preventDefault();
      // TODO Change context dataset connexion field to ICollectionField

      if (!context.dataset?.connexion?.input?.storeId) {
        console.warn('Store ID is missing');
        return;
      }
      const asyncStore = asyncData[context.dataset.connexion.input?.storeId];
      console.log(asyncStore);
      if (
        context.dataset.connexion.input?.query &&
        isValidJSON(context.dataset.connexion.input?.query) &&
        asyncStore?.data
      ) {
        const query = JSON.parse(context.dataset.connexion.input?.query) as
          | IQuery
          | IQuery[];

        let payload: any;
        if (Array.isArray(query)) {
          payload = await executeQueryChain(client, query, asyncStore.data);
        } else {
          payload = await getMethod(client, query, {}, asyncStore.data);
        }
        console.log(payload);
        onUpdateQueryResults(payload, context, 'output');
      }
    }
  };
  return (
    <Button {...props} onClick={handleClick}>
      <ChildrenDndWrapper ref={dndChildrenContainerRef}>
        {children}
      </ChildrenDndWrapper>
    </Button>
  );
}

export default ButtonComponent;
