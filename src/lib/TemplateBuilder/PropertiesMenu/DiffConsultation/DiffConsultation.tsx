import Dialog from '@/components/dialog/Dialog';
import { useState } from 'react';
import Button from '@/components/buttons/Button';
import { useTranslations } from 'next-intl';
import { useDiffDisplay } from '../History/useDiffDisplay';
import DiffGroupItem from './DiffGroupItem';
import DiffInformationText from './DiffInformationText';

function DiffConsultation() {
  const { buildDiff, diff } = useDiffDisplay();
  const [open, setOpen] = useState(false);

  const t = useTranslations('TemplateSection');

  return (
    <Dialog
      open={open}
      title='Impacts potentiels'
      onOpenChange={setOpen}
      Trigger={
        <Button onClick={buildDiff}>{t('searchPotentialImpact')}</Button>
      }>
      <div className='w-72'>
        <DiffGroupItem diff={diff} />
        <DiffInformationText />
      </div>
    </Dialog>
  );
}
export default DiffConsultation;
