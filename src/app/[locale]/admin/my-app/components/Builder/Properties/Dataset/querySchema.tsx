export const buildQuerySchema = (
  collection: string,
  inputStore: string,
  collectionFieldMap: Record<string, string[]>,
  storeFieldMap: Record<string, string[]>,
  storesSlugs: string[]
) => {
  const validFilterKeys = collectionFieldMap[collection] || [];
  const validInputKeys = storeFieldMap[inputStore] || [];
  const validPlaceholders = validInputKeys.map((key) => `{{:${key}}}`);

  return {
    type: 'object',
    properties: {
      method: { enum: ['list', 'get', 'search'] },
      collection: { type: 'string', enum: Object.keys(collectionFieldMap) },
      inputStore: {
        type: 'string',
        enum: Object.keys(storeFieldMap)
      },
      filters: {
        type: 'object',
        propertyNames: { enum: validFilterKeys },
        additionalProperties: {
          anyOf: [
            {
              type: 'string',
              pattern: '^{{:.*}}$',
              enum: validPlaceholders
            },
            {
              type: 'object',
              additionalProperties: true
            }
          ]
        }
      },
      output: {
        type: 'object',
        properties: {
          name: {
            anyOf: [{ type: 'string', enum: storesSlugs }, { type: 'string' }],
            description:
              'Suggested names: ' +
              storesSlugs.join(', ') +
              '. You may also enter a custom name.'
          },
          operation: { enum: ['map', 'reduce', 'filter', 'sort'] },
          input: {
            anyOf: [
              { type: 'string', pattern: '^{{:.*}}$' },
              { type: 'string' }
            ]
          },
          mapper: {
            anyOf: [
              { type: 'string', pattern: '^{{:.*}}$' },
              { type: 'string' }
            ]
          },
          type: { enum: ['form', 'list'] }
        },
        required: ['name', 'operation', 'input', 'mapper', 'type']
      }
    },
    required: ['method', 'collection', 'inputStore']
  };
};
