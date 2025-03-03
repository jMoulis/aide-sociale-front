import { ICollectionField, SchemaType } from '@/lib/interfaces/interfaces';
import React, { useState } from 'react';
import Selectbox from '../../form/Selectbox';
import FormField from '../../form/FormField';
import FormLabel from '../../form/FormLabel';
import Input from '../../form/Input';
import { Checkbox } from '../../ui/checkbox';
import DeleteButton from '../../buttons/DeleteButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { useTranslations } from 'next-intl';
import RequiredFlag from '../../form/RequiredFlag';
import NestedPropertiesEditor from './NestedPropertiesEditor';
import { propertiesOptions } from './utils';

interface PropertyEditorProps {
  property: ICollectionField;
  onChange: (prop: ICollectionField) => void;
  onRemove?: () => void;
}

const PropertyEditor: React.FC<PropertyEditorProps> = ({
  property,
  onChange,
  onRemove
}) => {
  const t = useTranslations('CollectionSection.propertyEditor');
  const [propKey, setPropKey] = useState(property.key);
  const [propType, setPropType] = useState<SchemaType>(property.type);
  const [isRequired, setIsRequired] = useState(property.required || false);
  const [nestedProps, setNestedProps] = useState<ICollectionField[]>(
    property.fields || []
  );
  const [arrayItemType, setArrayItemType] = useState<SchemaType>(
    property.arrayItemType || 'string'
  );

  const updateProperty = (
    newKey: string,
    newType: SchemaType,
    newRequired: boolean,
    newNestedProps?: ICollectionField[],
    newArrayItemType?: SchemaType
  ) => {
    onChange({
      key: newKey,
      type: newType,
      label: newKey,
      new: false,
      required: newRequired,
      fields: newType === 'object' ? newNestedProps : newNestedProps,
      arrayItemType: newType === 'array' ? newArrayItemType : undefined
    });
  };

  return (
    <div className='border p-1 mb-1 rounded'>
      <div className='flex items-center space-x-2'>
        <Input
          type='text'
          placeholder={t('labels.propertyKey')}
          value={propKey}
          onChange={(e) => {
            const newKey = e.target.value;
            setPropKey(newKey);
            updateProperty(
              newKey,
              propType,
              isRequired,
              nestedProps,
              arrayItemType
            );
          }}
          className='border p-2 flex-1'
        />
        <Selectbox
          value={propType}
          onChange={(e) => {
            const newType = e.target.value as SchemaType;
            setPropType(newType);
            // Reset nested properties or array item type if needed.
            if (newType !== 'object') {
              setNestedProps([]);
            }
            if (newType !== 'array') {
              setArrayItemType('string');
            }
            updateProperty(
              propKey,
              newType,
              isRequired,
              nestedProps,
              arrayItemType
            );
          }}
          options={propertiesOptions}
          className='border p-2'
        />
        <FormLabel className='flex items-center space-x-1'>
          <Checkbox
            checked={isRequired}
            onCheckedChange={(checked) => {
              setIsRequired(checked as boolean);
              updateProperty(
                propKey,
                propType,
                checked as boolean,
                nestedProps,
                arrayItemType
              );
            }}
          />
          <RequiredFlag />
        </FormLabel>
        {onRemove && (
          <DeleteButton onClick={onRemove}>
            <FontAwesomeIcon icon={faTrash} />
          </DeleteButton>
        )}
      </div>
      {propType === 'object' && (
        <div className='ml-4 border-l mt-1 pl-4'>
          <p className='font-semibold text-sm'>
            {t('labels.nestedProperties')}
          </p>
          <NestedPropertiesEditor
            properties={nestedProps}
            onChange={(newProps) => {
              setNestedProps(newProps);
              updateProperty(
                propKey,
                propType,
                isRequired,
                newProps,
                arrayItemType
              );
            }}
          />
        </div>
      )}
      {propType === 'array' && (
        <FormField className='ml-4 mt-1 border-l pl-4'>
          <FormLabel>{t('labels.arrayItemType')}</FormLabel>
          <Selectbox
            value={arrayItemType}
            options={propertiesOptions}
            onChange={(e) => {
              const newItemType = e.target.value as SchemaType;
              setArrayItemType(newItemType);
              // If the items are objects, we allow nested properties.
              if (newItemType !== 'object') {
                setNestedProps([]);
              }
              updateProperty(
                propKey,
                propType,
                isRequired,
                nestedProps,
                newItemType
              );
            }}
            className='border p-2'
          />
          {arrayItemType === 'object' && (
            <div className='mt-2'>
              <p className='text-sm font-semibold'>
                {t('labels.defineObjectSchemaForArrayItems')}
              </p>
              <NestedPropertiesEditor
                properties={nestedProps}
                onChange={(newProps) => {
                  setNestedProps(newProps);
                  updateProperty(
                    propKey,
                    propType,
                    isRequired,
                    newProps,
                    arrayItemType
                  );
                }}
              />
            </div>
          )}
        </FormField>
      )}
    </div>
  );
};

export default PropertyEditor;
