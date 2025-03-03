'use client';

import { ICollection } from '@/lib/interfaces/interfaces';
import { useCallback, useState } from 'react';
import CollectionForm from '@/components/Collection/CollectionForm';

type Props = {
  initialCollection: ICollection;
};
function Collection({ initialCollection }: Props) {
  const [collection, setCollection] = useState<ICollection>(initialCollection);
  const handleSubmit = useCallback((collection: ICollection) => {
    setCollection(collection);
  }, []);
  return <CollectionForm prevCollection={collection} onSubmit={handleSubmit} />;
}
export default Collection;
