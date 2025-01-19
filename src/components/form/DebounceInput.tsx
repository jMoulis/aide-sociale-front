import Input from '@/components/form/Input';
import { memo, useEffect, useState } from 'react';

type Props = {
  value: string;
  onChange: (value: string) => void;
  debounceTime?: number;
  placeholder?: string;
};
const DebouncedInput = memo(
  ({
    value: initialValue,
    onChange,
    debounceTime = 300,
    placeholder
  }: Props) => {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
      const handler = setTimeout(() => {
        onChange(value);
      }, debounceTime);

      return () => {
        clearTimeout(handler);
      };
    }, [value, onChange, debounceTime]);

    return (
      <Input
        name='search'
        placeholder={placeholder}
        value={value ?? ''}
        onChange={(event) => setValue(String(event.target.value))}
        className='max-w-sm'
      />
    ) as any;
  }
);
DebouncedInput.displayName = 'DebouncedInput';
export default DebouncedInput;
