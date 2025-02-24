import { cn } from '@/lib/utils/shadcnUtils';
import { useTranslations } from 'next-intl';

type Props = {
  label?: string;
  className?: string;
};
function RequiredFlag({ label, className }: Props) {
  const t = useTranslations('GlobalSection');
  return (
    <span
      className={cn(
        'bg-blue-400 flex items-center h-4 ml-2 text-[9px] px-0.5 rounded',
        className
      )}>
      {label ?? t('required')}
    </span>
  );
}
export default RequiredFlag;
