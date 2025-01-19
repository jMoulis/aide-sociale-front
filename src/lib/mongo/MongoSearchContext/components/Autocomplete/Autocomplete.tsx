import { useMongoSearch } from '@/lib/mongo/MongoSearchContext/MongoSearchContext';
import { useEffect } from 'react';
import SuggestionListItem from './SuggestionListItem';

type Props = {
  index: string;
  path: string;
  children?: React.ReactNode;
};
function Autocomplete<T>({ index, path, children }: Props) {
  const {
    suggestions,
    onAutocompleteTermChange,
    autocompleteTerm,
    onSuggestionsInit
  } = useMongoSearch<T>();

  useEffect(() => {
    onSuggestionsInit(index, path);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, path]);

  if (children) return children;
  return (
    <>
      <input
        className='autocomplete-input'
        type='text'
        onChange={(e) => onAutocompleteTermChange(e.target.value)}
        placeholder='Autocomplete'
        value={autocompleteTerm || ''}
      />
      <ul className='autocomplete-suggestion-list'>
        {suggestions.map((suggestion, key) => (
          <SuggestionListItem<T> key={key} suggestion={suggestion} />
        ))}
      </ul>
    </>
  );
}

export default Autocomplete;
