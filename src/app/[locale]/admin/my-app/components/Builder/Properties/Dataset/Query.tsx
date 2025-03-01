import { IDataset } from '@/lib/interfaces/interfaces';
import { ElementConfigProps, IVDOMNode } from '../../../interfaces';
import { usePageBuilderStore } from '../../../stores/pagebuilder-store-provider';
import Dialog from '@/components/dialog/Dialog';
import Button from '@/components/buttons/Button';
import IDE from '../IDE';
import { useCallback, useEffect, useState } from 'react';
import { getContextStoreDataset } from '@/lib/utils/utils';
import { buildQuerySchema } from './querySchema';

type Props = {
  selectedNode: IVDOMNode | null;
  config: ElementConfigProps;
  datasetKey: 'input' | 'output';
  onChange?: (value: string) => void;
};

const schemaBaseId = 'http://my-schema.json';

function Query({ selectedNode, config, datasetKey }: Props) {
  const [query, setQuery] = useState('');
  const [dynamicSchema, setDynamicSchema] = useState<{
    id: string;
    schema: any;
  }>({
    id: schemaBaseId,
    schema: {
      anyOf: []
    }
  });

  const [open, setOpen] = useState(false);
  const pageTemplateVersion = usePageBuilderStore((state) => state.pageVersion);

  useEffect(() => {
    setQuery(
      getContextStoreDataset(datasetKey, selectedNode?.context)?.query || ''
    );
  }, [selectedNode, datasetKey]);

  const onUpdateNodeProperty = usePageBuilderStore(
    (state) => state.onUpdateNodeProperty
  );

  const handleSubmit = () => {
    const updatedDataset: IDataset = {
      ...(selectedNode?.context?.dataset || ({} as IDataset)),
      connexion: {
        ...selectedNode?.context?.dataset?.connexion,
        [datasetKey]: {
          ...getContextStoreDataset(datasetKey, selectedNode?.context),
          query
        }
      }
    };
    onUpdateNodeProperty(
      { [config.propKey]: updatedDataset || '' },
      config.context
    );
    setOpen(false);
  };

  const updateSchemaFromQuery = useCallback(
    (content: string) => {
      const outputNames =
        pageTemplateVersion?.stores?.map((store) => store.slug) || [];
      const extractFieldKeys = (fields: any[], prefix = 'data'): string[] => {
        return fields.flatMap((field) => {
          const fieldKey = `${prefix}.${field.key}`;
          if (field.fields) {
            return [fieldKey, ...extractFieldKeys(field.fields, fieldKey)];
          }
          return fieldKey;
        });
      };

      const collectionFieldMap =
        pageTemplateVersion?.stores?.reduce(
          (acc: Record<string, string[]>, store) => {
            if (!store.collection) return acc;
            const collectionSystemFields = Object.keys(store.collection).reduce(
              (acc, key) => {
                if (key === 'fields') return acc;
                if (typeof (store.collection as any)?.[key] !== 'string')
                  return acc;
                const value = (store.collection as any)[key];
                if (typeof value !== 'string') return acc;
                return [...acc, key];
              },
              [] as string[]
            );
            return {
              ...acc,
              [store.collection.slug]: [
                ...collectionSystemFields,
                ...extractFieldKeys(store.collection.fields)
              ]
            };
          },
          {}
        ) || {};
      const storeFieldMap =
        pageTemplateVersion?.stores?.reduce(
          (acc: Record<string, string[]>, store) => {
            if (!store.collection) return acc;
            const collectionSystemFields = Object.keys(store.collection).reduce(
              (acc, key) => {
                if (key === 'fields') return acc;
                if (typeof (store.collection as any)?.[key] !== 'string')
                  return acc;
                const value = (store.collection as any)[key];
                if (typeof value !== 'string') return acc;
                return [...acc, key];
              },
              [] as string[]
            );
            return {
              ...acc,
              [store.slug]: [
                ...collectionSystemFields,
                ...extractFieldKeys(store.collection.fields)
              ]
            };
          },
          {}
        ) || {};

      try {
        const parsed = JSON.parse(content);
        let schemas: any[] = [];
        if (Array.isArray(parsed)) {
          schemas = parsed.map((query: any) => {
            const { collection, inputStore } = query;
            return buildQuerySchema(
              collection,
              inputStore,
              collectionFieldMap,
              storeFieldMap,
              outputNames
            );
          });
        } else {
          schemas = [
            buildQuerySchema(
              parsed.collection,
              parsed.inputStore,
              collectionFieldMap,
              storeFieldMap,
              outputNames
            )
          ];
        }
        // Create a unified schema that accepts either:
        // - a single query (that matches one of the generated schemas)
        // - or an array of queries (each of which must match one of the schemas)
        const unifiedSchema = {
          anyOf: [
            ...schemas, // Single query: any one of the schemas
            { type: 'array', items: { oneOf: schemas } } // Array case: each item must match one of the schemas
          ]
        };
        setDynamicSchema((prev) => ({ ...prev, schema: unifiedSchema }));
      } catch (e) {
        console.warn('Error parsing query:', e);
        // Handle JSON parse errors or schema generation errors as needed
      }
    },
    [pageTemplateVersion?.stores]
  );

  const handleInputChange = useCallback(
    (value: string) => {
      setQuery(value);
      updateSchemaFromQuery(value);
    },
    [updateSchemaFromQuery]
  );

  return (
    <div className='flex items-center space-x-2'>
      <Dialog
        contentStyle={{
          width: '80vw',
          height: '80vh',
          display: 'flex',
          flexDirection: 'column',
          maxWidth: 'none'
        }}
        open={open}
        onOpenChange={setOpen}
        Trigger={<Button>Query</Button>}
        title='Query'>
        <div className='p-4 h-[70vh] overflow-auto'>
          <Button onClick={handleSubmit}>Save</Button>
          <IDE
            lang='json'
            value={query}
            onChange={handleInputChange}
            schemaDef={dynamicSchema}
          />
        </div>
      </Dialog>
    </div>
  );
}
export default Query;

/**
 * Query example:
[
  {
    "method": "list",
    "collection": "Yjk0ZjAz_placements",
    "inputCollection": "Yjk0ZjAz_searchplacement",
    "filters": {
      "data.periode_placement.from": {
        "$lte": "{{:data.range.to}}"
      },
      "data.periode_placement.to": {
        "$gte": "{{:data.range.from}}"
      }
    },
    "output": {
      "type": "list",
      "name": "bookedids",
      "operation": "map",
      "input": "{{:data}}",
      "mapper": "{{:current.data.etablissement}}"
    }
  },
  {
    "method": "list",
    "collection": "etablissements",
    "inputCollection": "Yjk0ZjAz_searchplacement",
    "filters": {
      "_id": {
        "$nin": "{{:bookedids}}"
      },
      "data.gender": "{{:data.gender}}",
      "data.age": { "$in": "{{:data.age}}" },
      "data.hcp": "{{:data.hcp}}"
    },
    "output": {
      "type": "list",
      "name": "availableinstitutions",
      "operation": "map",
      "input": "{{:data}}",
      "mapper": "{{:current}}"
    }
  }
]

 */
// Assume collectionFieldMap and extractFieldKeys are defined as before.
