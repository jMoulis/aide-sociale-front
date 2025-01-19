import { IBucket, IFacets } from '@/lib/mongo/interfaces';
import FacetListItem from './FacetListItem';
import { memo } from 'react';

type Props = {
  facet: IFacets;
  FacetListItem?: (props: { name: string; bucket: IBucket }) => React.ReactNode;
};
const Facet = memo(({ facet, FacetListItem: CustomFacetListItem }: Props) => {
  return (
    <>
      {Object.keys(facet.facet).map((facetName) => (
        <li key={facetName} className='flex flex-col'>
          {facet.facet[facetName].buckets.map((bucket) =>
            CustomFacetListItem ? (
              <span key={bucket._id}>
                {CustomFacetListItem({
                  name: facetName,
                  bucket
                })}
              </span>
            ) : (
              <FacetListItem
                key={bucket._id}
                name={facetName}
                bucket={bucket}
              />
            )
          )}
        </li>
      ))}
    </>
  );
});
Facet.displayName = 'Facet';

export default Facet;
