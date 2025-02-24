import RequiredFlag from '@/components/form/RequiredFlag';
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
  selectedCollection: ICollection | null;
};
function SelectboxCollections({
  disabled,
  onValueChange,
  defaultValue = '',
  value = '',
  triggerLabel,
  collections,
  selectedCollection
}: Props) {
  return (
    <Select
      disabled={disabled}
      onValueChange={onValueChange}
      defaultValue={defaultValue}
      value={value}>
      <SelectTrigger className='w-[180px]'>
        <div>
          <span style={{ textAlign: 'left' }}>{triggerLabel}</span>
          {selectedCollection?.system ? (
            <RequiredFlag className='m-0 w-fit' label='System' />
          ) : null}
        </div>
      </SelectTrigger>
      <SelectContent>
        {Object.values(collections).map((collection) => (
          <SelectItem key={collection.slug} value={collection.slug}>
            <div className='flex flex-col'>
              <span>{collection.name}</span>
              {collection.system ? (
                <RequiredFlag className='m-0 w-fit' label='System' />
              ) : null}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
export default SelectboxCollections;
