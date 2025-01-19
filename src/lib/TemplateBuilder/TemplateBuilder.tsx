'use client';

import PropertiesPanel from './PropertiesMenu/PropertiesPanel';
import TemplatePreview from './TemplatePreview';
import { useTemplateBuilder } from './TemplateBuilderContext';
import { useTranslations } from 'next-intl';
import Button from '@/components/buttons/Button';
import { toast } from '@/lib/hooks/use-toast';
import AiPromptTemplate from './AiPromptTemplate/AiPromptTemplate';

type Props = {
  formId?: string;
};
export default function TemplateBuilder({ formId }: Props) {
  const { onFormSave, isEditable } = useTemplateBuilder();

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      onFormSave(e, formId);
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
