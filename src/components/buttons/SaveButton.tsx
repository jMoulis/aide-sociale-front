import { forwardRef } from 'react';
import Button from './Button';
import { useTranslations } from 'next-intl';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  active?: boolean;
}
const SaveButton = forwardRef<HTMLButtonElement, Props>(
  ({ loading, children, type, ...props }, ref) => {
    const t = useTranslations('GlobalSection');
    return (
      <Button type={type || 'submit'} loading={loading} ref={ref} {...props}>
        {children || t('actions.save')}
      </Button>
    );
  }
);

SaveButton.displayName = 'SaveButton';

export default SaveButton;
