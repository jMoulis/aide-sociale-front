import { useTranslations } from 'next-intl';
import Button from '../buttons/Button';

type Props = {
  onPrevious: () => void;
  onNext: () => void;
  canNext: boolean;
  canPrevious: boolean;
};

function Pagination({ onPrevious, onNext, canNext, canPrevious }: Props) {
  const t = useTranslations('TableSection');
  return (
    <div className='flex items-center justify-end space-x-2 py-4'>
      <Button onClick={onPrevious} disabled={!canPrevious}>
        {t('previous')}
      </Button>
      <Button onClick={onNext} disabled={!canNext}>
        {t('next')}
      </Button>
    </div>
  );
}

export default Pagination;
