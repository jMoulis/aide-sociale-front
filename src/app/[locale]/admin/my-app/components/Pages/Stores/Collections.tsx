'use client';

import { ICollection } from '@/lib/interfaces/interfaces';
import { useEffect, useState } from 'react';
import CollectionForm from '@/components/Collection/CollectionForm';
import client from '@/lib/mongo/initMongoClient';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { usePageBuilderStore } from '../../stores/pagebuilder-store-provider';
import { useMongoUser } from '@/lib/mongo/MongoUserContext/MongoUserContext';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckedState } from '@radix-ui/react-checkbox';
import { useTranslations } from 'next-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { mappingFielTypeIcons } from '@/components/Collection/mappingFieldTypeIcons';

type Props = {
  onSelectCollection: (collection: ICollection | null) => void;
  selectedCollectionId?: string;
  virtual?: boolean;
};
function Collections({
  onSelectCollection,
  selectedCollectionId,
  virtual
}: Props) {
  const t = useTranslations('CollectionSection');
  const [collections, setCollections] = useState<ICollection[]>([]);

  const organizationId = usePageBuilderStore((state) => state.organizationId);
  const user = useMongoUser();
  const [selectedCollection, setSelectedCollection] =
    useState<ICollection | null>(null);

  useEffect(() => {
    if (selectedCollectionId) {
      const collection = collections.find(
        (collection) => collection._id === selectedCollectionId
      );
      setSelectedCollection(collection || null);
    }
  }, [selectedCollectionId, collections]);

  useEffect(() => {
    if (organizationId) {
      client
        .list<ICollection>(ENUM_COLLECTIONS.COLLECTIONS, {
          organizationId
        })
        .then(({ data }) => {
          setCollections(data || []);
        });
      // fetch collections
    }
  }, [organizationId]);

  const handleSubmit = (collection: ICollection, create: boolean) => {
    if (create) {
      setCollections((prev) => [...prev, collection]);
    } else {
      setCollections((prev) =>
        prev.map((prevCollection) =>
          prevCollection._id === collection._id ? collection : prevCollection
        )
      );
    }
  };

  const handleSelectCollection = (
    status: CheckedState,
    collection: ICollection
  ) => {
    if (status) {
      onSelectCollection(collection);
    } else {
      onSelectCollection(null);
    }
  };

  if (!organizationId || !user) return null;

  return (
    <div className='mx-4'>
      <CollectionForm onSubmit={handleSubmit} virtual={virtual} />
      <div className='flex mt-4'>
        <ul>
          {collections.map((collection) => (
            <li key={collection._id} className='flex items-center mb-2'>
              <Checkbox
                className='mr-2'
                checked={selectedCollectionId === collection._id}
                onCheckedChange={(status) =>
                  handleSelectCollection(status, collection)
                }
              />
              <span className='text-sm'>{collection.name}</span>
            </li>
          ))}
        </ul>
        <div className='flex flex-col ml-4'>
          <div className='flex items-center'>
            <div className='flex flex-col mb-2 mr-4'>
              <span>{selectedCollection?.name}</span>
              <span className='text-xs color-gray-600'>
                {t('labels.fields')}
              </span>
            </div>
            {selectedCollection ? (
              <CollectionForm
                onSubmit={handleSubmit}
                virtual={virtual}
                prevCollection={selectedCollection}
              />
            ) : null}
          </div>
          <ul className='ml-1'>
            {selectedCollection?.fields?.map((field, key) => (
              <li key={key} className='flex items-center'>
                <FontAwesomeIcon
                  icon={mappingFielTypeIcons[field.type]}
                  className='text-xs mr-2 w-4'
                />
                <span className='text-xs'>{field.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
export default Collections;
