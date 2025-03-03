import { ICollectionField, SchemaType } from '@/lib/interfaces/interfaces';
import React, { useCallback, useMemo, useState } from 'react';
import Selectbox from '../../form/Selectbox';
import FormField from '../../form/FormField';
import FormLabel from '../../form/FormLabel';
import Button from '../../buttons/Button';
import Markdown from '../../Markdown/Markdown';
import SaveButton from '../../buttons/SaveButton';
import { useTranslations } from 'next-intl';
import PropertyEditor from './PropertyEditor';
import { propertiesOptions } from './utils';

type Props = {
  prevFields: ICollectionField[];
  onSave: (schema: string, fields: ICollectionField[]) => void;
};
export default function ValidationConfigBuilder({ prevFields, onSave }: Props) {
  const t = useTranslations('CollectionSection.propertyEditor');
  const [schemaType, setSchemaType] = useState<SchemaType>('object');
  const [fields, setFields] = useState<ICollectionField[]>(prevFields);

  const addRootProperty = () => {
    setFields([
      ...fields,
      { key: '', type: 'string', required: false, label: '', new: true }
    ]);
  };

  const updateRootPropertyAt = (index: number, newProp: ICollectionField) => {
    const newProperties = fields.map((prop, i) =>
      i === index ? newProp : prop
    );
    setFields(newProperties);
  };

  const removeRootPropertyAt = (index: number) => {
    const newProperties = fields.filter((_, i) => i !== index);
    setFields(newProperties);
  };

  // Helper to recursively build the JSON Schema for an object type.
  const buildSchema = useCallback(
    (props: ICollectionField[]): { properties: any; required?: string[] } => {
      const properties: Record<string, any> = {};
      const required: string[] = [];

      props.forEach((prop) => {
        if (!prop.key) return; // skip properties without a key
        let schema: any = {};

        if (prop.type === 'date') {
          // For MongoDB, use bsonType: 'date'
          schema = { bsonType: 'date' };
        } else if (prop.type === 'object') {
          const nested = buildSchema(prop.fields || []);
          schema = { type: 'object', ...nested };
        } else if (prop.type === 'array') {
          if (prop.arrayItemType === 'object') {
            const nested = buildSchema(prop.fields || []);
            schema = { type: 'array', items: { type: 'object', ...nested } };
          } else if (prop.arrayItemType === 'date') {
            // Use MongoDB's date type for array items
            schema = { type: 'array', items: { bsonType: 'date' } };
          }
          {
            schema = {
              type: 'array',
              items: { type: prop.arrayItemType || 'string' }
            };
          }
        } else {
          schema = { type: prop.type };
        }

        properties[prop.key] = schema;

        if (prop.required) {
          required.push(prop.key);
        }
      });

      return required.length > 0 ? { properties, required } : { properties };
    },
    []
  );

  const schema = useMemo(() => {
    // Build the final JSON Schema.
    const schema: any = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      type: schemaType
    };

    if (schemaType === 'object') {
      const { properties, required } = buildSchema(fields);
      schema.properties = properties;
      if (required) {
        schema.required = required;
      }
    }
    return schema;
  }, [buildSchema, fields, schemaType]);

  // For non-object root types, additional handling can be added.

  return (
    <div className='flex flex-col'>
      <SaveButton type='button' onClick={() => onSave(schema, fields)} />
      <div className='flex'>
        <div className='flex-1 mr-4'>
          <FormField>
            <FormLabel className='block mb-1'>
              {t('labels.selectRootSchemaType')}
            </FormLabel>
            <Selectbox
              value={schemaType}
              options={propertiesOptions}
              onChange={(e) => setSchemaType(e.target.value as SchemaType)}
            />
          </FormField>
          {schemaType === 'object' && (
            <div className='mb-4'>
              <span className='text-sm font-semibold mb-2'>
                {t('labels.objectProperties')}
              </span>
              {fields.map((prop, index) => (
                <PropertyEditor
                  key={index}
                  property={prop}
                  onChange={(newProp) => updateRootPropertyAt(index, newProp)}
                  onRemove={() => removeRootPropertyAt(index)}
                />
              ))}
              <Button
                onClick={addRootProperty}
                className='bg-blue-500 text-white px-3 py-1 rounded'>
                {t('labels.addProperty')}
              </Button>
            </div>
          )}
        </div>
        <div>
          <h3 className='text-xl font-semibold'>
            {t('labels.generatedJsonSchema')}
          </h3>
          <Markdown
            source={`
\`\`\`json
${JSON.stringify(schema, null, 2)}
\`\`\`
          `}
          />
        </div>
      </div>
    </div>
  );
}
