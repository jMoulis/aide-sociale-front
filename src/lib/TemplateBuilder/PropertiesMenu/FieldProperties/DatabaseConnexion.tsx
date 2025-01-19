import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import { ENUM_FIELD_TYPE, IFormField } from '../../interfaces';
import { useTemplateBuilder } from '../../TemplateBuilderContext';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Selectbox from '@/components/form/Selectbox';
import DataConnexionSelect from '../DataConnexionTemplateMenu/DataConnexionSelect';
import { ICollection } from '@/lib/interfaces/interfaces';
import client from '@/lib/mongo/initMongoClient';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';

const dataConnectableExternalFields = [
  ENUM_FIELD_TYPE.SELECT,
  ENUM_FIELD_TYPE.RADIO,
  ENUM_FIELD_TYPE.CHECKBOX,
  ENUM_FIELD_TYPE.MULTISELECT
];
type Props = {
  field: IFormField;
  blockId: string;
};
function DatabaseConnexion({ field, blockId }: Props) {
  const { updateField, isEditable, template } = useTemplateBuilder();
  const t = useTranslations('TemplateSection');
  const [selectedCollection, setSelectedCollection] =
    useState<ICollection | null>(null);

  const isCollectableExternalField = useMemo(() => {
    return dataConnectableExternalFields.includes(field.type);
  }, [field.type]);

  useEffect(() => {
    client
      .get<ICollection>(ENUM_COLLECTIONS.COLLECTIONS, {
        name: isCollectableExternalField
          ? field.collectionName
          : template.globalCollectionName
      })
      .then(({ data }) => {
        if (data) {
          setSelectedCollection(data);
        }
      });
  }, [
    field.collectionName,
    isCollectableExternalField,
    template.globalCollectionName
  ]);

  // useEffect(() => {
  //   if (collections.length && selectedCollectionId) {
  //     console.log('SelectedCollectionId', selectedCollectionId);
  //     setSelectedCollection(
  //       collections.find((c) => c._id === selectedCollectionId) || null
  //     );
  //   }
  // }, [selectedCollectionId, collections]);

  const availableCollectionFields = useMemo<string[]>(
    () => selectedCollection?.fields || [],
    [selectedCollection]
  );

  const handleSelectCollection = useCallback(
    (collection: ICollection | null) => {
      setSelectedCollection(collection);
      updateField(blockId, field.id, 'collectionName', collection?.name || '');
    },
    [blockId, field.id, updateField]
  );

  return (
    <div className='space-y-2'>
      {/* {isCollectableExternalField ? ( */}
      <DataConnexionSelect
        onSelectCollection={handleSelectCollection}
        selectedCollection={selectedCollection}
      />
      {/* ) : null} */}
      <FormField>
        <FormLabel htmlFor='label'>{t('labelField')}</FormLabel>
        <Selectbox
          name='labelField'
          value={field.labelField}
          disabled={!isEditable}
          options={availableCollectionFields.map((field) => ({
            label: field,
            value: field
          }))}
          onChange={(e) =>
            updateField(blockId, field.id, 'labelField', e.target.value)
          }
        />
      </FormField>
      <FormField>
        <FormLabel htmlFor='label'>{t('valueField')}</FormLabel>
        <Selectbox
          name='valueField'
          value={field.valueField}
          disabled={!isEditable}
          options={availableCollectionFields.map((field) => ({
            label: field,
            value: field
          }))}
          onChange={(e) =>
            updateField(blockId, field.id, 'valueField', e.target.value)
          }
        />
      </FormField>
    </div>
  );
}
export default DatabaseConnexion;
