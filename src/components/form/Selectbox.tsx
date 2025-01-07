import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useTranslations } from 'next-intl';
import { useCallback } from 'react';

export type SelectboxEvent = {
  target: {
    name: string;
    value: string;
  };
};
type Option = {
  value: string;
  label: string;
};

type Props = {
  options: Option[];
  onChange?: (event: SelectboxEvent) => void;
  name: string;
  placeholder?: string;
  value?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
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

  const handleChange = useCallback(
    (value: string) => {
      onChange?.({ target: { name, value } });
    },
    [name, onChange]
  );

  return (
    <Select
      onValueChange={handleChange}
      defaultValue={value}
      value={value}
      disabled={disabled}
      required={required}
      name={name}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder || t('select')} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            onClick={(e) => e.preventDefault()}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
export default Selectbox;
