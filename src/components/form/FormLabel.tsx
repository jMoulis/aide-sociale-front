import { forwardRef } from 'react';
import RequiredFlag from './RequiredFlag';
import { cn } from '@/lib/utils/shadcnUtils';

interface Props extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children?: React.ReactNode;
  error?: string | null;
  required?: boolean;
}
const FormLabel = forwardRef<HTMLLabelElement, Props>(
  ({ children, required, ...props }, ref) => {
    return (
      <label
        ref={ref}
        {...props}
        className={cn(
          `mb-1 md:text-sm text-lg flex items-center`,
          props?.className
        )}>
        {children}
        {required ? <RequiredFlag /> : null}
      </label>
    );
  }
);

FormLabel.displayName = 'FormLabel';

export default FormLabel;
