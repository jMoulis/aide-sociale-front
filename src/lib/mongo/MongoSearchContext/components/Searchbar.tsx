import { FormEvent, useEffect } from 'react';
import { useMongoSearch } from '@/lib/mongo/MongoSearchContext/MongoSearchContext';
import Input from '@/components/form/Input';

type Props = {
  index: string;
  searchPlaceholder?: string;
  searchTextButton?: React.ReactNode;
  clearTextButton?: React.ReactNode;
};
function Searchbar({
  index,
  searchPlaceholder,
  searchTextButton,
  clearTextButton
}: Props) {
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
    <form onSubmit={handleSearch} className='flex space-x-2 mb-3'>
      <Input
        type='text'
        onChange={onInputSearch}
        placeholder={searchPlaceholder ?? 'Search by name'}
        value={searchTerm || ''}
      />
      <button type='submit'>{searchTextButton ?? 'Search'}</button>
      <button type='button' onClick={onResetSearch}>
        {clearTextButton ?? 'Clear'}
      </button>
    </form>
  );
}

export default Searchbar;
