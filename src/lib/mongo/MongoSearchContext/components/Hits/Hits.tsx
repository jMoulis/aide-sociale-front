import { useMongoSearch } from '@/lib/mongo/MongoSearchContext/MongoSearchContext';
import { useEffect } from 'react';
import HitComponent from './Hit';

type Props = {
  children?: React.ReactNode;
  index: string;
};
function Hits<T>({ children, index }: Props) {
  const { hits, initHits } = useMongoSearch<T>();

  useEffect(() => {
    initHits(index || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);
  if (children) return children;

  return (
    <ul className='hits-list'>
      {hits.map((hit, index) => (
        <HitComponent<T> key={index} hit={hit} />
      ))}
    </ul>
  );
}

export default Hits;
