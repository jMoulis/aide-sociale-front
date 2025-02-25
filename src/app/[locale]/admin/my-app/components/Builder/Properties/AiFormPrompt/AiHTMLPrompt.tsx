import MessagesHistory from '@/lib/TemplateBuilder/AiPromptTemplate/MessagesHistory';
import { IVDOMNode } from '../../../interfaces';
import Textarea from '@/components/form/Textarea';
import Button from '@/components/buttons/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles } from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import FormFooterAction from '@/components/dialog/FormFooterAction';
import CancelButton from '@/components/buttons/CancelButton';
import Dialog from '@/components/dialog/Dialog';
import { useMongoUser } from '@/lib/mongo/MongoUserContext/MongoUserContext';
import { useEffect, useMemo, useRef, useState } from 'react';
import { IAiMessage } from '@/lib/TemplateBuilder/AiPromptTemplate/interfaces';
import { useTranslations } from 'next-intl';
import {
  clearLocalStorage,
  loadFromLocalStorage,
  saveToLocalStorage
} from '@/lib/utils/localstorage';
import { toast } from '@/lib/hooks/use-toast';
import { generateAiHTML } from '@/lib/TemplateBuilder/AiPromptTemplate/actions';
import { renderVNode } from '../../Components/renderVode';
import { usePageBuilderStore } from '../../../stores/pagebuilder-store-provider';
import { aiHTMLInitialMessage } from '@/lib/TemplateBuilder/AiPromptTemplate/aiHTMLInstructions';
import { parseHTMLToVDOM, parseVDOMToHTML } from './utils';

const MAX_HISTORY = 20; // Define as needed
const LOCAL_STORAGE_KEYS = {
  MESSAGE_HISTORY: 'aiPromptTemplate_messageHistory',
  GENERATED_TEMPLATE: 'aiPromptTemplate_generatedTemplate'
};

function AiHTMLPrompt() {
  const user = useMongoUser();
  const elementsConfig = usePageBuilderStore((state) => state.elementsConfig);

  const t = useTranslations('TemplateSection');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const onEditPageTemplateVersion = usePageBuilderStore(
    (state) => state.onEditPageTemplateVersion
  );
  const pageVersion = usePageBuilderStore((state) => state.pageVersion);

  const onAppendAiToPage = usePageBuilderStore(
    (state) => state.onAppendAiToPage
  );

  const aiInitMessage = useMemo(() => {
    const config: any[] = elementsConfig.map((el) => ({
      type: el.type,
      tags: el.tags,
      instructions: el.instructions,
      exampleHtml: el.exampleHtml
    }));
    return aiHTMLInitialMessage(config);
  }, [elementsConfig]);

  const [messageHistory, setMessageHistory] = useState<IAiMessage[]>([
    aiInitMessage
  ]);
  const [generatedTemplate, setGeneratedTemplate] = useState<IVDOMNode | null>(
    null
  );
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load persisted data on component mount
  useEffect(() => {
    const persistedHistory = loadFromLocalStorage(
      LOCAL_STORAGE_KEYS.MESSAGE_HISTORY
    );
    const persistedTemplate = loadFromLocalStorage<IVDOMNode>(
      LOCAL_STORAGE_KEYS.GENERATED_TEMPLATE
    );

    if (persistedHistory && Array.isArray(persistedHistory)) {
      if (persistedHistory.length === 0) {
        setMessageHistory([aiInitMessage]);
      } else {
        setMessageHistory(persistedHistory);
      }
    }
    if (persistedTemplate) {
      setGeneratedTemplate(persistedTemplate);
    } else if (pageVersion?.vdom) {
      setGeneratedTemplate(pageVersion.vdom);
    }
  }, [aiInitMessage, pageVersion?.vdom]);

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
      const htmlInit = pageVersion ? parseVDOMToHTML([pageVersion.vdom]) : '';
      const message: IAiMessage = {
        content: htmlInit,
        role: 'system'
      };
      let updatedHistory: IAiMessage[] = [
        message,
        ...messageHistory,
        { content: inputValue, role: 'user' }
      ];
      if (updatedHistory.length > MAX_HISTORY) {
        updatedHistory = updatedHistory.slice(
          updatedHistory.length - MAX_HISTORY
        );
      }
      setMessageHistory(updatedHistory);
      inputRef.current!.value = '';
      const {
        error,
        template: aiTemplate,
        rawResponse
      } = await generateAiHTML(updatedHistory);

      if (rawResponse) {
        console.info('rawResponse', rawResponse);
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

      setMessageHistory((prev) => [
        ...prev,
        { role: 'assistant', content: JSON.stringify(aiTemplate) }
      ]);
      const [vdom] = parseHTMLToVDOM(aiTemplate.html, elementsConfig);
      setGeneratedTemplate(vdom);

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

  const handleUseTemplate = (action: 'append' | 'replace') => {
    if (!generatedTemplate) return;
    if (action === 'append') {
      onAppendAiToPage(generatedTemplate);
      return;
    }
    onEditPageTemplateVersion({ vdom: generatedTemplate });
  };

  const handleCancel = () => {
    setGeneratedTemplate(null);
    setMessageHistory([aiInitMessage]);
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
            {generatedTemplate ? renderVNode(generatedTemplate, []) : null}
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
          <FormFooterAction>
            <Button
              disabled={!generatedTemplate}
              onClick={() => handleUseTemplate('append')}>
              {t('appendToTemplate')}
            </Button>
            <Button
              disabled={!generatedTemplate}
              onClick={() => handleUseTemplate('replace')}>
              {t('replaceTemplate')}
            </Button>
            <CancelButton onClick={handleCancel} />
          </FormFooterAction>
        </div>
      </div>
    </Dialog>
  );
}
export default AiHTMLPrompt;
