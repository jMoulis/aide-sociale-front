import React, { useRef } from 'react';

import { cn } from '@/lib/utils/shadcnUtils';
import { forwardRef } from 'react';

interface Props extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  children?: React.ReactNode;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSpaceHit: () => void;
  value: string;
  error?: string | null;
}
const TextareaStyleInput = forwardRef<HTMLTextAreaElement, Props>(
  ({ onChange, value, onSpaceHit, className, ...rest }, ref) => {
    const initialValue = useRef(value);
    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && value?.trim()) {
        event.preventDefault();
        if (value !== initialValue.current) {
          initialValue.current = value;
          onSpaceHit(); // Trigger the callback
        }
      }
    };
    return (
      <textarea
        ref={ref}
        {...rest}
        value={value}
        onKeyDown={handleKeyDown}
        onChange={onChange}
        className={cn(
          `flex w-full rounded-md border border-input bg-white px-3 py-1 min-h-24 text-base resize-none shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-blue-400 focus-visible:ring-1 focus-visible:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm`,
          className
        )}
      />
    );
  }
);

TextareaStyleInput.displayName = 'TextareaStyleInput';

export default TextareaStyleInput;
