import { forwardRef } from 'react';
import Button from './Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd } from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  active?: boolean;
}
const SquareButton = forwardRef<HTMLButtonElement, Props>(
  ({ loading, children, ...props }, ref) => {
    return (
      <Button
        className='w-6 h-6 flex items-center justify-center'
        loading={loading}
        ref={ref}
        {...props}>
        {children || <FontAwesomeIcon icon={faAdd} />}
      </Button>
    );
  }
);

SquareButton.displayName = 'SquareButton';

export default SquareButton;
