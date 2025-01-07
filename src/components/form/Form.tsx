import { cn } from '@/lib/utils/shadcnUtils';
import { forwardRef } from 'react';

interface Props extends React.FormHTMLAttributes<HTMLFormElement> {
  children?: React.ReactNode;
}
const Form = forwardRef<HTMLFormElement, Props>((props, ref) => {
  return <form ref={ref} {...props} className={cn('', props.className)} />;
});

Form.displayName = 'Form';

export default Form;
