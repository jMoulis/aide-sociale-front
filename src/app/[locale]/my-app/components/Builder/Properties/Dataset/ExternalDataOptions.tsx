import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import { useTranslations } from 'next-intl';
import { usePageBuilderStore } from '../../../stores/pagebuilder-store-provider';
import { ElementConfigProps, IVDOMNode } from '../../../interfaces';
import { ChangeEvent, useEffect, useState } from 'react';
import { ICollection } from '@/lib/interfaces/interfaces';
import Selectbox from '@/components/form/Selectbox';

type Props = {
  config: ElementConfigProps;
  collections: Record<string, ICollection>;
  selectedNode: IVDOMNode | null;
};

function ExternalDataOptions({ config, collections, selectedNode }: Props) {
  const onUpdateNodeProperty = usePageBuilderStore(
    (state) => state.onUpdateNodeProperty
  );
  const [selectedCollection, setSelectedCollection] =
    useState<ICollection | null>(null);

  const t = useTranslations('TemplateSection');

  useEffect(() => {
    const collectionSlug =
      selectedNode?.context?.dataset?.connexion?.externalDataOptions
        ?.collectionSlug;
    if (collectionSlug) {
      setSelectedCollection(collections[collectionSlug]);
    }
  }, [
    selectedNode?.context?.dataset?.connexion?.externalDataOptions
      ?.collectionSlug,
    collections
  ]);
  const handleSelectCollection = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    const collection = collections[value];
    if (!collection) return;

    setSelectedCollection(collection);
    const updatedDatasetConnexion = {
      ...selectedNode?.context?.dataset?.connexion,
      externalDataOptions: {
        ...selectedNode?.context?.dataset?.connexion?.externalDataOptions,
        collectionSlug: collection.slug
      }
    };

    onUpdateNodeProperty(
      {
        dataset: {
          ...selectedNode?.context?.dataset,
          connexion: updatedDatasetConnexion
        }
      },
      config.context
    );
  };
  const handleSelectField = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = event.target;
    const updatedDatasetConnexion = {
      ...selectedNode?.context?.dataset?.connexion,
      externalDataOptions: {
        ...selectedNode?.context?.dataset?.connexion?.externalDataOptions,
        [name]: value
      }
    };
    onUpdateNodeProperty(
      {
        dataset: {
          ...selectedNode?.context?.dataset,
          connexion: updatedDatasetConnexion
        }
      },
      config.context
    );
  };

  return (
    <div>
      <h1>{t('dataConnexion')}</h1>

      <FormField>
        <FormLabel>{t('databaseOptions')}</FormLabel>
        <Selectbox
          value={selectedCollection?.slug || ''}
          onChange={handleSelectCollection}
          options={Object.values(collections).map((collection) => ({
            label: collection.name,
            value: collection.slug
          }))}
        />
      </FormField>
      <FormField>
        <FormLabel htmlFor='label'>{t('labelField')}</FormLabel>
        <Selectbox
          name='labelField'
          value={
            selectedNode?.context?.dataset?.connexion?.externalDataOptions
              ?.labelField || ''
          }
          options={(selectedCollection?.fields || []).map((field) => ({
            label: field.label,
            value: field.key
          }))}
          onChange={handleSelectField}
        />
      </FormField>
      <FormField>
        <FormLabel htmlFor='label'>{t('valueField')}</FormLabel>
        <Selectbox
          name='valueField'
          value={
            selectedNode?.context?.dataset?.connexion?.externalDataOptions
              ?.valueField || ''
          }
          options={(selectedCollection?.fields || []).map((field) => ({
            label: field.label,
            value: field.key
          }))}
          onChange={handleSelectField}
        />
      </FormField>
    </div>
  );
}
export default ExternalDataOptions;
