import { forwardRef } from 'react';
import Button from './Button';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/shadcnUtils';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  active?: boolean;
}
const DeleteButton = forwardRef<HTMLButtonElement, Props>(
  ({ loading, children, className, ...props }, ref) => {
    const t = useTranslations('GlobalSection');
    return (
      <Button
        className={cn('bg-red-500 text-white', className)}
        loading={loading}
        ref={ref}
        {...props}>
        {children || t('actions.delete')}
      </Button>
    );
  }
);

DeleteButton.displayName = 'DeleteButton';

export default DeleteButton;
