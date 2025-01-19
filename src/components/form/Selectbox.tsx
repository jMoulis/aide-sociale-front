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
            `flex h-9 w-full items-center justify-between shadow-sm rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 ${
              touched && required && !value
                ? 'border-red-500'
                : 'border-gray-300'
            }`,
            className
          )}>
          <option value=''>{placeholder || t('select')}</option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
export default Selectbox;
