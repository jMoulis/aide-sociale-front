import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';

type Props = {
  children: React.ReactNode;
  trigger: React.ReactNode;
  icon?: React.ReactNode;
};
function Popup({ children, trigger, icon }: Props) {
  return (
    <Popover modal>
      <PopoverTrigger asChild>
        <button type='button' className='flex items-center space-x-1'>
          {icon}
          {trigger}
        </button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start' asChild>
        <div>{children}</div>
      </PopoverContent>
    </Popover>
  );
}
export default Popup;
