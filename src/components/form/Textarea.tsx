import { cn } from '@/lib/utils/shadcnUtils';
import { forwardRef } from 'react';

interface Props extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  children?: React.ReactNode;
  error?: string | null;
}
const Textarea = forwardRef<HTMLTextAreaElement, Props>((props, ref) => {
  return (
    <textarea
      ref={ref}
      {...props}
      className={cn(
        `flex w-full rounded-md border border-input bg-white px-3 py-1 min-h-24 text-base resize-none shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-blue-400 focus-visible:ring-1 focus-visible:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm`,
        props.className
      )}
    />
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
