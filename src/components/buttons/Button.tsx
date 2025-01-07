import { cn } from '@/lib/utils/shadcnUtils';
import { Loader2 } from 'lucide-react';
import { forwardRef } from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  active?: boolean;
}
const Button = forwardRef<HTMLButtonElement, Props>(
  ({ loading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type='button'
        {...props}
        className={cn(
          `border disabled:cursor-not-allowed w-fit disabled:opacity-50 shadow-sm border-input rounded-md px-3 py-1 md:text-sm text-lg flex items-center`,
          props.className
        )}>
        {loading ? <Loader2 className='animate-spin mr-2' /> : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
