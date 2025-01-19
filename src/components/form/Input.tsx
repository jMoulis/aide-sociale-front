import { cn } from '@/lib/utils/shadcnUtils';
import { forwardRef } from 'react';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  children?: React.ReactNode;
  error?: string | null;
  name?: string;
}
const Input = forwardRef<HTMLInputElement, Props>(({ type, ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type || 'text'}
      {...props}
      className={cn(
        `flex w-full bg-white rounded-md border border-input px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-blue-400 focus-visible:ring-1 focus-visible:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-50 h-9 md:text-sm invalid:border-red-300`,
        props.className
      )}
    />
  );
});

Input.displayName = 'Input';

export default Input;
