'use client';

import { ICollection, IUserSummary } from '@/lib/interfaces/interfaces';
import { useCallback, useState } from 'react';
import CollectionForm from '../../components/CollectionForm';

type Props = {
  initialCollection: ICollection;
};
function Collection({ initialCollection }: Props) {
  const [collection, setCollection] = useState<ICollection>(initialCollection);
  const handleSubmit = useCallback((collection: ICollection) => {
    setCollection(collection);
  }, []);
  return (
    <CollectionForm
      onSubmit={handleSubmit}
      initialCollection={collection}
      user={collection.createdBy as IUserSummary}
      organizationId={collection.organizationId}
    />
  );
}
export default Collection;
