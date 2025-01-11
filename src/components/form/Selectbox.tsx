import { cn } from '@/lib/utils/shadcnUtils';
import { useTranslations } from 'next-intl';
import { ChangeEvent, useCallback, useState } from 'react';

export type SelectboxEvent = {
  target: {
    name: string;
    value: string;
  };
};
export type SelectboxOption = {
  value: string;
  label: string;
};

type Props = {
  options: SelectboxOption[];
  onChange?: (event: SelectboxEvent) => void;
  name: string;
  placeholder?: string;
  value?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
};
function Selectbox({
  options,
  onChange,
  placeholder,
  value,
  name,
  required,
  disabled,
  className
}: Props) {
  const t = useTranslations('GlobalSection');
  const [touched, setTouched] = useState(false);

  const handleBlur = () => {
    if (required) {
      setTouched(true);
    }
  };

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      onChange?.(event);
    },
    [onChange]
  );

  return (
    <div>
      <div className='relative' onBlur={handleBlur}>
        <select
          value={value || ''}
          name={name}
          onChange={handleChange}
          required={required}
          disabled={disabled}
          className={cn(
            `block w-full text-sm px-4 py-2 border ${
              touched && required && !value
                ? 'border-red-500'
                : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`,
            className
          )}>
          <option value=''>{placeholder || t('select')}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
export default Selectbox;
