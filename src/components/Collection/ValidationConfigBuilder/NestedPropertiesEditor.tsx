import { ICollectionField } from '@/lib/interfaces/interfaces';
import React from 'react';
import Button from '../../buttons/Button';
import { useTranslations } from 'next-intl';
import PropertyEditor from './PropertyEditor';

interface NestedPropertiesEditorProps {
  properties: ICollectionField[];
  onChange: (props: ICollectionField[]) => void;
}

const NestedPropertiesEditor: React.FC<NestedPropertiesEditorProps> = ({
  properties,
  onChange
}) => {
  const t = useTranslations('CollectionSection.propertyEditor');
  const addProperty = () => {
    onChange([
      ...properties,
      { key: '', type: 'string', label: '', new: true, required: false }
    ]);
  };

  const updatePropertyAt = (index: number, newProp: ICollectionField) => {
    const newProperties = properties.map((prop, i) =>
      i === index ? newProp : prop
    );
    onChange(newProperties);
  };

  const removePropertyAt = (index: number) => {
    const newProperties = properties.filter((_, i) => i !== index);
    onChange(newProperties);
  };

  return (
    <div>
      {properties.map((prop, index) => (
        <PropertyEditor
          key={index}
          property={prop}
          onChange={(newProp) => updatePropertyAt(index, newProp)}
          onRemove={() => removePropertyAt(index)}
        />
      ))}
      <Button
        onClick={addProperty}
        className='bg-blue-500 text-white px-3 py-1 rounded mt-2'>
        {t('labels.addNestedProperty')}
      </Button>
    </div>
  );
};

export default NestedPropertiesEditor;
