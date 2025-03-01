import MongoRealtimeClient from "@/lib/mongo/clients/MongoRealtimeClient";
import MongoServerClient from "@/lib/mongo/clients/MongoServerClient";
import { evaluateDSL } from "./DSL";
import { IQuery } from "@/lib/interfaces/interfaces";

export const replacePlaceholdersRecursively = (
  input?: any,
  params?: Record<string, any>
): any => {

  if (input instanceof Date) {

    return input;
  } else if (typeof input === 'string') {
    // If the entire string matches a placeholder, return the resolved value directly.
    const exactPlaceholderMatch = input.match(/^{{:([\w.-]+)}}$/);
    if (exactPlaceholderMatch) {
      const key = exactPlaceholderMatch[1];
      const value = key.split('.').reduce((acc, cur) => acc?.[cur], params);
      return value !== undefined ? value : input;
    }
    // Otherwise, replace any placeholders embedded in a longer string.
    const replaced = input.replace(/{{:([\w.-]+)}}/g, (_, key) => {
      const value = key.split('.').reduce((acc: any, cur: any) => acc?.[cur], params);
      return value !== undefined ? String(value) : '';
    });
    return replaced;
  } else if (Array.isArray(input)) {
    const payload = input.map(item => replacePlaceholdersRecursively(item, params));

    return payload;
  } else if (input !== null && typeof input === 'object') {

    const replaced: Record<string, any> = {};
    for (const [key, value] of Object.entries(input)) {
      replaced[key] = replacePlaceholdersRecursively(value, params);
    }
    return replaced;
  }
  return input;
};

const executeMethod = async (client: MongoRealtimeClient | MongoServerClient, query: IQuery, data?: Record<string, any>) => {
  const { method, collection, upsertOptions, filters, updateOptions, aggregateOptions, matchQuery, upsertQuery } = query;
  switch (method) {
    case 'update':
      return client.update(collection, filters || {}, data, updateOptions);
    case 'create':
      return client.create(collection, data, updateOptions);
    case 'delete': {
      if (!filters?._id) {
        return null
      }
      return client.delete(collection, filters._id);
    }
    case 'list':
      return client.list(collection, filters);
    case 'get':
      return client.get(collection, filters || {});
    case 'search': {
      if (!aggregateOptions) {
        return null;
      }
      return client.search(collection, aggregateOptions, true);
    }
    case 'update-many': {
      if (!matchQuery || !upsertQuery) {
        return null;
      }
      return client.updateMany(collection, matchQuery, upsertQuery, upsertOptions);
    }
    default:
      return null;
  }
}
export const getMethod = async (client: MongoServerClient | MongoRealtimeClient, query: IQuery, data: any, systemParams: any) => {
  const filters = replacePlaceholdersRecursively(query.filters, systemParams);
  const aggregateOptions = query.aggregateOptions
    ? replacePlaceholdersRecursively(query.aggregateOptions, systemParams)
    : undefined;
  const matchQuery = query.matchQuery
    ? replacePlaceholdersRecursively(query.matchQuery, systemParams)
    : undefined;
  const upsertQuery = query.upsertQuery
    ? replacePlaceholdersRecursively(query.upsertQuery, systemParams)
    : undefined;
  const updateOptions = query.updateOptions
    ? replacePlaceholdersRecursively(query.updateOptions, systemParams)
    : undefined;
  return executeMethod(client, {
    ...query,
    filters,
    aggregateOptions,
    matchQuery,
    upsertQuery,
    updateOptions
  }, data);
};


export const executeQueryChain = async (
  client: MongoRealtimeClient | MongoServerClient,
  queries: IQuery[],
  systemParams: Record<string, any>,
  initialData?: any,
): Promise<Record<string, any>> => {
  // Context to store outputs from queries by their output key.
  const context: Record<string, any> = {};

  // Merge systemParams and context for placeholder resolution.
  const getCombinedParams = () => ({ ...systemParams, ...context });
  for (const query of queries) {
    // Before executing, process all properties that might contain placeholders.
    // Here, we're using the recursive function from earlier:
    const processedFilters = replacePlaceholdersRecursively(query.filters, getCombinedParams());
    const processedAggregateOptions = query.aggregateOptions
      ? replacePlaceholdersRecursively(query.aggregateOptions, getCombinedParams())
      : undefined;
    const processedMatchQuery = query.matchQuery
      ? replacePlaceholdersRecursively(query.matchQuery, getCombinedParams())
      : undefined;
    const processedUpsertQuery = query.upsertQuery
      ? replacePlaceholdersRecursively(query.upsertQuery, getCombinedParams())
      : undefined;
    const processedUpdateOptions = query.updateOptions
      ? replacePlaceholdersRecursively(query.updateOptions, getCombinedParams())
      : undefined;

    // Construct a new query with the processed parts.
    const processedQuery: IQuery = {
      ...query,
      filters: processedFilters,
      aggregateOptions: processedAggregateOptions,
      matchQuery: processedMatchQuery,
      upsertQuery: processedUpsertQuery,
      updateOptions: processedUpdateOptions,
    };

    // Execute the query.
    // You might pass along additional data if required by your method.
    const result = await executeMethod(client, processedQuery, initialData);

    // If the query has an output key, store the result in the context.
    if (query.output?.name && result !== undefined) {
      if (query.output?.operation && result?.data) {
        const evaluated = evaluateDSL(query.output as any, result);
        context[query.output.name] = evaluated;
      } else {
        context[query.output.name] = result;
      }
    }
  }
  // Return the context with all outputs.
  return context;
};
