import { cn } from '@/lib/utils/shadcnUtils';
import { forwardRef } from 'react';

interface Props extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {
  children?: React.ReactNode;
}
const FormField = forwardRef<HTMLFieldSetElement, Props>(
  ({ children, ...props }, ref) => {
    return (
      <fieldset
        ref={ref}
        {...props}
        className={cn(`flex flex-col mb-1`, props?.className)}>
        {children}
      </fieldset>
    );
  }
);

FormField.displayName = 'FormField';

export default FormField;
