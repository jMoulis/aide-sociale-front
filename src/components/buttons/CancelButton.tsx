import { forwardRef } from 'react';
import Button from './Button';
import { useTranslations } from 'next-intl';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  active?: boolean;
}
const CancelButton = forwardRef<HTMLButtonElement, Props>(
  ({ loading, children, ...props }, ref) => {
    const t = useTranslations('GlobalSection');
    return (
      <Button
        className='bg-black text-white'
        loading={loading}
        ref={ref}
        {...props}>
        {children || t('actions.cancel')}
      </Button>
    );
  }
);

CancelButton.displayName = 'CancelButton';

export default CancelButton;
