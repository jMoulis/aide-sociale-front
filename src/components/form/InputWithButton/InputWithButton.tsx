import { CSSProperties, forwardRef } from 'react';
import InputButton from './InputButton';
import { cn } from '@/lib/utils/shadcnUtils';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  children?: React.ReactNode;
  Icon?: React.ReactElement | null;
  action?: {
    style: CSSProperties | undefined;
  };
}
const InputWithButton = forwardRef<HTMLInputElement, Props>(
  ({ Icon, onClick, action, ...props }, ref) => {
    return (
      <div className='focus-within:border-indigo-500 flex rounded-md border border-input bg-transparent text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-indigo-400 focus-visible:ring-1 focus-visible:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-2 h-9 relative overflow-hidden w-full'>
        <input
          ref={ref}
          {...props}
          className={cn(
            `focus-visible:outline-none border-r mr-[40px] pr-2 flex w-full`,
            props.className
          )}
        />
        <InputButton action={action} Icon={Icon} onClick={onClick as any} />
      </div>
    );
  }
);

InputWithButton.displayName = 'InputWithButton';

export default InputWithButton;
