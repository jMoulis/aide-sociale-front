type Props<T> = {
  suggestion: T;
};
function SuggestionListItem<T>({ suggestion }: Props<T>) {
  return (
    <li className='autocomplete-suggestion-list-item'>
      {JSON.stringify(suggestion)}
    </li>
  );
}

export default SuggestionListItem;
