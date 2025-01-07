import { IFacets } from '@/lib/mongo/interfaces';
import FacetListItem from './FacetListItem';
import { memo } from 'react';

type Props = {
  facet: IFacets;
};
const Facet = memo(({ facet }: Props) => {
  return (
    <>
      {Object.keys(facet.facet).map((facetName) => (
        <li key={facetName} className='flex flex-col'>
          {facet.facet[facetName].buckets.map((bucket) => (
            <FacetListItem key={bucket._id} name={facetName} bucket={bucket} />
          ))}
        </li>
      ))}
    </>
  );
});
Facet.displayName = 'Facet';

export default Facet;
