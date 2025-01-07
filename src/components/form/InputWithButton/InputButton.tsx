import { CSSProperties, forwardRef } from 'react';
import Button from '../../buttons/Button';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  Icon?: React.ReactElement | null;
  action?: {
    style: CSSProperties | undefined;
  };
}
const InputButton = forwardRef<HTMLButtonElement, Props>(
  ({ loading, Icon, action, onClick, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        {...props}
        style={action?.style}
        loading={loading}
        type='button'
        className='top-[-2px] bottom-[-11px] !text-xs right-0 h-[40px] w-[40px] absolute border-none transition-colors rounded-tl-none rounded-bl-none'
        onClick={onClick}>
        {Icon ?? null}
      </Button>
    );
  }
);

InputButton.displayName = 'InputButton';

export default InputButton;
