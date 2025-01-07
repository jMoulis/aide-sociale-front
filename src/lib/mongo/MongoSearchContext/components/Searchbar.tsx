import { FormEvent, useEffect } from 'react';
import { useMongoSearch } from '@/lib/mongo/MongoSearchContext/MongoSearchContext';

type Props = {
  index: string;
};
function Searchbar({ index }: Props) {
  const {
    onInputSearch,
    searchTerm,
    onSubmitSearch,
    initSearch,
    onResetSearch
  } = useMongoSearch();
  useEffect(() => {
    initSearch(index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmitSearch();
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        type='text'
        onChange={onInputSearch}
        placeholder='Search by name'
        value={searchTerm || ''}
      />
      <button type='submit'>Search</button>
      <button type='button' onClick={onResetSearch}>
        Clear
      </button>
    </form>
  );
}

export default Searchbar;
