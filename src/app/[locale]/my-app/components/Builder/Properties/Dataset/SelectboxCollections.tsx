import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger
} from '@/components/ui/select';
import { ICollection } from '@/lib/interfaces/interfaces';

type Props = {
  disabled?: boolean;
  onValueChange: (value: string) => void;
  defaultValue?: string;
  value?: string;
  triggerLabel: string;
  collections: Record<string, ICollection>;
};
function SelectboxCollections({
  disabled,
  onValueChange,
  defaultValue = '',
  value = '',
  triggerLabel,
  collections
}: Props) {
  return (
    <Select
      disabled={disabled}
      onValueChange={onValueChange}
      defaultValue={defaultValue}
      value={value}>
      <SelectTrigger className='w-[180px]'>
        <span style={{ textAlign: 'left' }}>{triggerLabel}</span>
      </SelectTrigger>
      <SelectContent>
        {Object.values(collections).map((collection) => (
          <SelectItem key={collection.slug} value={collection.slug}>
            {collection.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
export default SelectboxCollections;
