import { IBucket, IFacetsConfig } from '@/lib/mongo/interfaces';
import { memo, useEffect } from 'react';
import Facet from './Facet';
import { useMongoSearch } from '@/lib/mongo/MongoSearchContext/MongoSearchContext';

type Props = {
  config: IFacetsConfig;
  index: string;
  children?: React.ReactNode;
  clearButton?: React.ReactNode;
  FacetListItem?: (props: { name: string; bucket: IBucket }) => React.ReactNode;
};
const Facets = memo(
  ({ config, index, children, clearButton, FacetListItem }: Props) => {
    const { facets, initFacets, facetsConfig, onFetchFacets, onClearFilters } =
      useMongoSearch();

    useEffect(() => {
      initFacets(config, index);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [config, index]);

    useEffect(() => {
      if (!facetsConfig) return;
      onFetchFacets();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [facetsConfig]);

    if (children) return children;

    return (
      <>
        {facets.map((facet, key) => (
          <ul key={key}>
            <Facet facet={facet} FacetListItem={FacetListItem} />
          </ul>
        ))}
        <button
          type='button'
          className='whitespace-nowrap'
          onClick={onClearFilters}>
          {clearButton ?? 'ClearFilters'}
        </button>
      </>
    );
  }
);
Facets.displayName = 'Facets';
export default Facets;
