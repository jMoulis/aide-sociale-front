'use client';

import Button from '@/components/buttons/Button';
import Dialog from '@/components/dialog/Dialog';
import { ICollection } from '@/lib/interfaces/interfaces';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import CollectionForm from '@/app/[locale]/admin/collections/components/CollectionForm';
import client from '@/lib/mongo/initMongoClient';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { usePageBuilderStore } from '../../stores/pagebuilder-store-provider';
import { useMongoUser } from '@/lib/mongo/MongoUserContext/MongoUserContext';

type Props = {
  onSelectCollection: (collection: ICollection) => void;
  selectedCollectionId?: string;
  virtual?: boolean;
};
function Collections({
  onSelectCollection,
  selectedCollectionId,
  virtual
}: Props) {
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

  if (!organizationId || !user) return null;
  return (
    <div>
      <CollectionForm onSubmit={handleSubmit} virtual={virtual} />
      <div className='flex'>
        <ul>
          {collections.map((collection) => (
            <li key={collection._id}>
              <Button
                className={
                  selectedCollectionId === collection._id
                    ? 'bg-black text-white'
                    : ''
                }
                onClick={() => onSelectCollection(collection)}>
                {collection.name}
              </Button>
            </li>
          ))}
        </ul>
        <ul>
          {selectedCollection?.fields?.map((field, key) => (
            <li key={key}>
              <span>{field.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
export default Collections;
