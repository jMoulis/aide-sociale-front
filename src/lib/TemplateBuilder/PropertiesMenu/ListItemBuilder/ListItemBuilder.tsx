import { useState } from 'react';
import Dialog from '@/components/dialog/Dialog';
import Subform from './Subform';
import Button from '@/components/buttons/Button';
import { useTemplateBuilder } from '../../TemplateBuilderContext';
import { useTranslations } from 'next-intl';

function ListItemBuilder() {
  const [open, setOpen] = useState(false);
  const { template } = useTemplateBuilder();
  const t = useTranslations('TemplateSection');
  const tGlobal = useTranslations('GlobalSection.actions');

  return (
    <div>
      <div className='bg-slate-50 p-2 rounded-md mt-2'>
        {template.templateListItem?.title ? (
          <div className='flex flex-col'>
            <span>{t('connectedTemplate')}</span>
            <span>{`${t('template')}: ${
              template.templateListItem.title
            }`}</span>
            <span>{`${t('version')}: ${
              template.templateListItem.version
            }`}</span>
          </div>
        ) : null}
      </div>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        Trigger={
          <Button className='bg-white mt-2'>
            {template.templateListItem ? tGlobal('open') : t('connectTemplate')}
          </Button>
        }>
        <Subform />
      </Dialog>
    </div>
  );
}
export default ListItemBuilder;
