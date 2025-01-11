import { useState } from 'react';
import Input from '../Input';
import { isValid, parse } from 'date-fns';

type Props = {
  onChange: (date?: Date) => void;
};
function ManualDateInput({ onChange }: Props) {
  const [inputValue, setInputValue] = useState('');

  const handleManualDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    const parsedDate = parse(e.target.value, 'dd/MM/yyyy', new Date());
    if (isValid(parsedDate)) {
      onChange(parsedDate);
    } else {
      onChange(undefined);
    }
  };

  return (
    <div className='flex justify-center'>
      <Input
        className='m-2'
        value={inputValue}
        onChange={handleManualDateChange}
        placeholder='dd/mm/aaaa'
      />
    </div>
  );
}
export default ManualDateInput;
