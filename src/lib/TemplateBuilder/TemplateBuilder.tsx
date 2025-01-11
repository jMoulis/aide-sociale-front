'use client';

import PropertiesPanel from './PropertiesMenu/PropertiesPanel';
import TemplatePreview from './TemplatePreview';
import { useTemplateBuilder } from './TemplateBuilderContext';
import { useTranslations } from 'next-intl';
import Button from '@/components/buttons/Button';
import { IFormTemplate } from './interfaces';
import { toast } from '@/lib/hooks/use-toast';
import AiPromptTemplate from './AiPromptTemplate/AiPromptTemplate';

type Props = {
  onSave?: (template: IFormTemplate | void) => void;
  formId?: string;
};
export default function TemplateBuilder({
  onSave: parentOnSave,
  formId
}: Props) {
  const { onFormSave, isEditable } = useTemplateBuilder();
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const template = await onFormSave(e, !!parentOnSave, formId);
      parentOnSave?.(template);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  const tGlobal = useTranslations('GlobalSection.actions');

  return (
    <form
      onSubmit={handleSave}
      className='flex flex-1'
      id={formId || 'template-form'}>
      <div className='flex-1 border-r pr-2'>
        <header className='bg-slate-50 p-2 flex justify-between items-center'>
          {isEditable ? (
            <Button className='bg-white' type='submit'>
              {tGlobal('save')}
            </Button>
          ) : null}
          <AiPromptTemplate />
        </header>
        <TemplatePreview />
      </div>
      <div className='w-96 border-l p-2'>
        <PropertiesPanel />
      </div>
    </form>
  );
}
