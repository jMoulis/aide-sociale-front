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
interface Props extends React.InputHTMLAttributes<HTMLSelectElement> {
  error?: string | null;
  name?: string;
  backdrop?: boolean;
  ref?: any;
  options: SelectboxOption[];
}
// type Props = {
//   options: SelectboxOption[];
//   onChange?: (event: SelectboxEvent) => void;
//   name: string;
//   placeholder?: string;
//   value?: string;
//   required?: boolean;
//   disabled?: boolean;
//   className?: string;
//   error?: string;
//   onClick?: () => void;
//   backdrop?: boolean;
//   ref?: any;
// };
function Selectbox({
  options,
  onChange,
  placeholder,
  value,
  required,
  className,
  onClick,
  backdrop,
  ref,
  ...rest
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
    <div className='relative' onBlur={handleBlur} ref={ref}>
      {backdrop ? (
        <div
          onClick={(e: any) => onClick?.(e)}
          className='absolute z-40 top-0 left-0 right-0 bottom-0'></div>
      ) : null}
      <select
        {...rest}
        value={value}
        required={required}
        onChange={handleChange}
        className={cn(
          `flex h-9 w-full items-center justify-between shadow-sm rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 ${
            touched && required && !value ? 'border-red-500' : 'border-gray-300'
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
  );
}
export default Selectbox;
