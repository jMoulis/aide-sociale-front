import { IBucket } from '@/lib/mongo/interfaces';
import { useMongoSearch } from '@/lib/mongo/MongoSearchContext/MongoSearchContext';
import { memo, useId, useMemo } from 'react';

type Props = {
  bucket: IBucket;
  name: string;
};
const FacetListItem = memo(({ bucket, name }: Props) => {
  const { onFacetFilter, filters } = useMongoSearch();
  const parsedName = useMemo(() => name.replace('Facet', ''), [name]);
  const id = useId();
  return (
    <label htmlFor={id}>
      <input
        id={id}
        type='checkbox'
        name={name}
        onChange={onFacetFilter}
        value={bucket._id}
        checked={
          filters[parsedName]?.some((filter) => filter === bucket._id) ?? false
        }
      />
      <span>
        {bucket._id} - {bucket.count}
      </span>
    </label>
  );
});
FacetListItem.displayName = 'FacetListItem';
export default FacetListItem;
