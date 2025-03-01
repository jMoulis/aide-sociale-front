import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

type Props = Record<string, unknown>;
function DateBuilderPlaceholder(props: Props) {
  const t = useTranslations('GlobalSection');
  return (
    <Button type='button' variant={'outline'} {...props}>
      <CalendarIcon className='opacity-50' />
      <span className='opacity-50'>{t('actions.pickADate')}</span>
    </Button>
  );
}
export default DateBuilderPlaceholder;
