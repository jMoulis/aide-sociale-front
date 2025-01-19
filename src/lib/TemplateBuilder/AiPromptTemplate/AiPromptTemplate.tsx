import Button from '@/components/buttons/Button';
import Dialog from '@/components/dialog/Dialog';
import { useEffect, useRef, useState } from 'react';
import { IFormTemplate } from '../interfaces';
import { generateTemplate } from './actions';
import { toast } from '@/lib/hooks/use-toast';
import FormField from '@/components/form/FormField';
import { renderField } from '../RenderFieldParams';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles } from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { useMongoUser } from '@/lib/mongo/MongoUserContext/MongoUserContext';
import { useTemplateBuilder } from '../TemplateBuilderContext';
import Textarea from '@/components/form/Textarea';
import { useTranslations } from 'next-intl';
import { IAiMessage } from './interfaces';
import { aiTemplateInitialMessage } from './aiInstructions';
import CancelButton from '@/components/buttons/CancelButton';
import {
  clearLocalStorage,
  loadFromLocalStorage,
  saveToLocalStorage
} from '@/lib/utils/localstorage';
import FormFooterAction from '@/components/dialog/FormFooterAction';
import MessagesHistory from './MessagesHistory';

const MAX_HISTORY = 20; // Define as needed
const LOCAL_STORAGE_KEYS = {
  MESSAGE_HISTORY: 'aiPromptTemplate_messageHistory',
  GENERATED_TEMPLATE: 'aiPromptTemplate_generatedTemplate'
};

function AiPromptTemplate() {
  const { template, setTemplate } = useTemplateBuilder();
  const user = useMongoUser();
  const [generatedTemplate, setGeneratedTemplate] =
    useState<IFormTemplate | null>(null);
  const t = useTranslations('TemplateSection');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [messageHistory, setMessageHistory] = useState<IAiMessage[]>([
    aiTemplateInitialMessage
  ]);

  // Load persisted data on component mount
  useEffect(() => {
    const persistedHistory = loadFromLocalStorage(
      LOCAL_STORAGE_KEYS.MESSAGE_HISTORY
    );
    const persistedTemplate = loadFromLocalStorage(
      LOCAL_STORAGE_KEYS.GENERATED_TEMPLATE
    );

    if (persistedHistory && Array.isArray(persistedHistory)) {
      if (persistedHistory.length === 0) {
        setMessageHistory([aiTemplateInitialMessage]);
      } else {
        setMessageHistory(persistedHistory);
      }
    }

    if (persistedTemplate) {
      setGeneratedTemplate(persistedTemplate as IFormTemplate);
    }
  }, []);

  useEffect(() => {
    saveToLocalStorage(LOCAL_STORAGE_KEYS.MESSAGE_HISTORY, messageHistory);
  }, [messageHistory]);

  useEffect(() => {
    if (generatedTemplate) {
      saveToLocalStorage(
        LOCAL_STORAGE_KEYS.GENERATED_TEMPLATE,
        generatedTemplate
      );
    } else {
      clearLocalStorage(LOCAL_STORAGE_KEYS.GENERATED_TEMPLATE);
    }
  }, [generatedTemplate]);

  const handleSendPrompt = async () => {
    if (!user) return;
    const inputValue = inputRef.current?.value;
    if (!inputValue) return;

    try {
      setLoading(true);
      let updatedHistory: IAiMessage[] = [
        ...messageHistory,
        { content: inputValue, role: 'user' }
      ];
      if (updatedHistory.length > MAX_HISTORY) {
        updatedHistory = updatedHistory.slice(
          updatedHistory.length - MAX_HISTORY
        );
      }
      const {
        error,
        template: aiTemplate,
        rawResponse
      } = await generateTemplate(updatedHistory);

      if (rawResponse) {
        // eslint-disable-next-line no-console
        console.log('rawResponse', rawResponse);
      }
      if (error) {
        toast({
          title: 'Error',
          description: error,
          variant: 'destructive'
        });
        return;
      }
      if (!aiTemplate) {
        toast({
          title: 'Error',
          description: 'No template generated',
          variant: 'destructive'
        });
        return;
      }
      const validTemplate: IFormTemplate = {
        ...template,
        title: aiTemplate.title,
        blocks: aiTemplate.blocks
      };
      setMessageHistory([
        ...updatedHistory,
        { role: 'assistant', content: JSON.stringify(aiTemplate) }
      ]);
      setGeneratedTemplate(validTemplate);
      inputRef.current!.value = '';
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUseTemplate = (mode: 'append' | 'replace') => {
    if (!generatedTemplate) return;
    if (mode === 'append') {
      const appendedTemplate: IFormTemplate = {
        ...template,
        blocks: [...template.blocks, ...generatedTemplate.blocks]
      };
      setTemplate(appendedTemplate);
      setMessageHistory([aiTemplateInitialMessage]);
      clearLocalStorage(LOCAL_STORAGE_KEYS.MESSAGE_HISTORY);
      clearLocalStorage(LOCAL_STORAGE_KEYS.GENERATED_TEMPLATE);
    } else {
      const replacedTemplate: IFormTemplate = {
        ...template,
        blocks: generatedTemplate.blocks
      };
      setTemplate(replacedTemplate);
      clearLocalStorage(LOCAL_STORAGE_KEYS.MESSAGE_HISTORY);
      clearLocalStorage(LOCAL_STORAGE_KEYS.GENERATED_TEMPLATE);
    }
    setOpen(false);
  };
  const handleCancel = () => {
    setGeneratedTemplate(null);
    setMessageHistory([aiTemplateInitialMessage]);
    setOpen(false);
    clearLocalStorage(LOCAL_STORAGE_KEYS.MESSAGE_HISTORY);
    clearLocalStorage(LOCAL_STORAGE_KEYS.GENERATED_TEMPLATE);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      contentStyle={{ width: '90vw', maxWidth: '90vw' }}
      title='AI Prompt'
      Trigger={
        <Button>
          <FontAwesomeIcon icon={faWandMagicSparkles} className='mr-2' />
          <span>{t('askAiToCreateTemplate')}</span>
        </Button>
      }>
      <div className='p-4 flex flex-1'>
        <div className='flex flex-1 bg-slate-100 rounded p-2'>
          <div className='flex-1 rounded bg-white max-h-[75vh] overflow-auto'>
            {generatedTemplate?.blocks.map((block) => {
              let columns = 'grid-cols-1';
              if (block.layout === 'two-column') columns = 'grid-cols-2';
              if (block.layout === 'three-column') columns = 'grid-cols-3';

              return (
                <div
                  key={block.id}
                  className={`border cursor-pointer rounded group/block relative border-transparent`}>
                  <h1>{block.title}</h1>
                  <div className={`grid ${columns}`}>
                    {block.fields.map((field) => {
                      return (
                        <FormField
                          key={field.id}
                          className={`border cursor-pointer relative group rounded m-1 border-transparent`}>
                          {renderField({ field, readOnly: true })}
                        </FormField>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className='p-4 w-96'>
          <div className='flex flex-col items-end'>
            <MessagesHistory messages={messageHistory} />
            <Textarea
              ref={inputRef}
              placeholder='Décrivez le type formulaire que vous souhaitez'
            />
            <Button
              className='mt-3'
              onClick={handleSendPrompt}
              loading={loading}>
              <FontAwesomeIcon icon={faWandMagicSparkles} className='mr-2' />
              <span>{t('generate')}</span>
            </Button>
          </div>
          {/* {generatedTemplate ? ( */}
          <FormFooterAction>
            <Button onClick={() => handleUseTemplate('append')}>
              {t('appendToTemplate')}
            </Button>
            <Button onClick={() => handleUseTemplate('replace')}>
              {t('replaceTemplate')}
            </Button>
            <CancelButton onClick={handleCancel} />
          </FormFooterAction>
          {/* ) : null} */}
        </div>
      </div>
    </Dialog>
  );
}
export default AiPromptTemplate;
