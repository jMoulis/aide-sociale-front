import { IFacetsConfig } from '@/lib/mongo/interfaces';
import { memo, useEffect } from 'react';
import Facet from './Facet';
import { useMongoSearch } from '@/lib/mongo/MongoSearchContext/MongoSearchContext';

type Props = {
  config: IFacetsConfig;
  index: string;
  children?: React.ReactNode;
};
const Facets = memo(({ config, index, children }: Props) => {
  const { facets, initFacets, facetsConfig, onFetchFacets } = useMongoSearch();

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
          <Facet facet={facet} />
        </ul>
      ))}
    </>
  );
});
Facets.displayName = 'Facets';
export default Facets;
