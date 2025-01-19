import { cn } from '@/lib/utils/shadcnUtils';

type Props = {
  setPickerRef: React.Dispatch<React.SetStateAction<HTMLUListElement | null>>;
  pickersClassName?: string;
  items: string[];
  selectedItem: string;
  onChange: (item: string) => void;
  required?: boolean;
  disabled?: boolean;
  flat?: boolean;
};
function PickersList({
  setPickerRef,
  pickersClassName,
  items,
  selectedItem,
  onChange,
  flat
}: Props) {
  return (
    <ul
      ref={setPickerRef}
      className={cn(
        `w-10 flex-grow min-h-0  overflow-y-auto bg-white ${
          !flat ? 'border border-gray-300 shadow-md' : ''
        }  rounded-md scrollbar-none scrollbar-thumb-gray-300 scrollbar-track-gray-100`,
        pickersClassName
      )}>
      {items.map((hour) => (
        <li
          key={hour}
          className={`p-2 flex rounded items-center justify-center w-8 h-8 cursor-pointer hover:bg-accent ${
            hour === selectedItem ? 'bg-primary  text-white' : ''
          }`}
          onClick={() => onChange(hour)}>
          <span className='text-sm'>{hour}</span>
        </li>
      ))}
    </ul>
  );
}
export default PickersList;
