'use client';

import React, { useState, useEffect, useRef, FormEvent } from 'react';
import styles from './chat.module.css';
import { AssistantStream } from 'openai/lib/AssistantStream';
// @ts-expect-error - no types for this yet
import { AssistantStreamEvent } from 'openai/resources/beta/assistants/assistants';
import { RequiredActionFunctionToolCall } from 'openai/resources/beta/threads/runs/runs';
import { TextDelta } from 'openai/resources/beta/threads/messages.mjs';
import { getImages } from '@/app/[locale]/admin/assistant-webpage/actions';
import { isValidJSON } from '@/lib/utils/utils';
import { parseHTMLToVDOM } from '@/app/[locale]/admin/my-app/components/Builder/Properties/AiFormPrompt/utils';
import { usePageBuilderStore } from '@/app/[locale]/admin/my-app/components/stores/pagebuilder-store-provider';
import { IVDOMNode } from '@/app/[locale]/admin/my-app/components/interfaces';
import { renderVNode } from '@/app/[locale]/admin/my-app/components/Builder/Components/renderVode';
import Dialog from '@/components/dialog/Dialog';
import Button from '@/components/buttons/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles } from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { useTranslations } from 'next-intl';
import FormFooterAction from '@/components/dialog/FormFooterAction';
import CancelButton from '@/components/buttons/CancelButton';
import Textarea from '@/components/form/Textarea';

type Role = 'user' | 'assistant' | 'code';
type MessageProps = {
  role: 'user' | 'assistant' | 'code';
  text: string;
};

const UserMessage = ({ text }: { text: string }) => {
  return <div className={styles.userMessage}>{text}</div>;
};

const AssistantMessage = ({ text }: { text: string }) => {
  let message = {
    title: 'Réponse',
    summaryAiAction: 'Voici ma réponse',
    html: text
  };
  if (isValidJSON(text)) {
    const parsedMessage = JSON.parse(text) as {
      html: string;
      title: string;
      summaryAiAction: string;
    };
    message = parsedMessage;
  }
  const markdownHtml = '```html\n' + message.html + '\n```';
  return (
    <div className={styles.assistantMessage}>
      <p>{message.summaryAiAction}</p>
      <details>
        <summary>HTML</summary>
        <pre className='max-w-64 overflow-auto'>{markdownHtml}</pre>
      </details>
    </div>
  );
};

const Message = ({ role, text }: MessageProps) => {
  switch (role) {
    case 'user':
      return <UserMessage text={text} />;
    case 'assistant':
      return <AssistantMessage text={text} />;
    default:
      return null;
  }
};

const functionCallHandler = async (call: RequiredActionFunctionToolCall) => {
  if (call?.function?.name !== 'search_images') return;
  const args = JSON.parse(call.function.arguments);
  const data = await getImages(args.query);
  const images = JSON.parse(data.images);
  return JSON.stringify({ ...data, images });
};

type ChatProps = {
  functionCallHandler?: (
    toolCall: RequiredActionFunctionToolCall
  ) => Promise<string | undefined>;
};

const Chat = ({}: ChatProps) => {
  const [open, setOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<{ role: Role; text: string }[]>([]);
  const [isAnswering, setIsAnswering] = useState(false);
  const [threadId, setThreadId] = useState('');
  const elementsConfig = usePageBuilderStore((state) => state.elementsConfig);
  const [generatedTemplate, setGeneratedTemplate] = useState<IVDOMNode | null>(
    null
  );
  const onAppendAiToPage = usePageBuilderStore(
    (state) => state.onAppendAiToPage
  );
  const onEditPageTemplateVersion = usePageBuilderStore(
    (state) => state.onEditPageTemplateVersion
  );
  const t = useTranslations('TemplateSection');
  // automatically scroll to bottom of chat
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isAnswering && messages.length) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant') {
        const rawMessage = lastMessage.text;
        if (isValidJSON(rawMessage)) {
          const parsedMessage = JSON.parse(rawMessage) as { html: string };
          const [vdom] = parseHTMLToVDOM(parsedMessage.html, elementsConfig);
          setGeneratedTemplate(vdom);
        }
      }
    }
  }, [isAnswering, messages, elementsConfig]);

  // create a new threadID when chat component created
  useEffect(() => {
    const createThread = async () => {
      const res = await fetch(`/api/assistants/threads`, {
        method: 'POST'
      });
      const data = await res.json();
      setThreadId(data.threadId);
    };
    createThread();
  }, []);

  const sendMessage = async (text: string) => {
    const response = await fetch(
      `/api/assistants/threads/${threadId}/messages`,
      {
        method: 'POST',
        body: JSON.stringify({
          content: text
        })
      }
    );
    if (!response.body) return;

    const stream = AssistantStream.fromReadableStream(response.body);
    handleReadableStream(stream);
  };

  const submitActionResult = async (runId: string, toolCallOutputs: any) => {
    const response = await fetch(
      `/api/assistants/threads/${threadId}/actions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          runId: runId,
          toolCallOutputs: toolCallOutputs
        })
      }
    );
    if (!response.body) return;
    const stream = AssistantStream.fromReadableStream(response.body);
    handleReadableStream(stream);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    setIsAnswering(true);
    sendMessage(userInput);
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'user', text: userInput }
    ]);
    setUserInput('');
    scrollToBottom();
  };

  /* Stream Event Handlers */

  // textCreated - create new assistant message
  const handleTextCreated = () => {
    appendMessage('assistant', '');
  };

  // textDelta - append text to last assistant message
  const handleTextDelta = (delta: TextDelta) => {
    if (delta.value != null) {
      appendToLastMessage(delta.value);
    }
  };

  // toolCallCreated - log new tool call
  const toolCallCreated = (toolCall: any) => {
    if (toolCall.type != 'code_interpreter') return;
    appendMessage('code', '');
  };

  // toolCallDelta - log delta and snapshot for the tool call
  const toolCallDelta = (delta: any) => {
    if (delta.type != 'code_interpreter') return;
    if (!delta.code_interpreter.input) return;
    appendToLastMessage(delta.code_interpreter.input);
  };

  // handleRequiresAction - handle function call
  const handleRequiresAction = async (
    event: AssistantStreamEvent.ThreadRunRequiresAction
  ) => {
    const runId = event.data.id;
    const toolCalls =
      event.data.required_action?.submit_tool_outputs.tool_calls;
    // loop over tool calls and call function handler
    if (!toolCalls) return;
    const toolCallOutputs = await Promise.all(
      toolCalls?.map(async (toolCall: any) => {
        const result = await functionCallHandler(toolCall);
        return { output: result, tool_call_id: toolCall.id };
      })
    );
    submitActionResult(runId, toolCallOutputs);
  };

  // handleRunCompleted - re-enable the input form
  const handleRunCompleted = () => {
    setIsAnswering(false);
  };

  const handleReadableStream = (stream: AssistantStream) => {
    // messages
    stream.on('textCreated', handleTextCreated);
    stream.on('textDelta', handleTextDelta);

    // code interpreter
    stream.on('toolCallCreated', toolCallCreated);
    stream.on('toolCallDelta', toolCallDelta);

    // events without helpers yet (e.g. requires_action and run.done)
    stream.on('event', (event) => {
      if (event.event === 'thread.run.requires_action') {
        handleRequiresAction(event);
      }
      if (event.event === 'thread.run.completed') handleRunCompleted();
    });
  };

  /*
    =======================
    === Utility Helpers ===
    =======================
  */

  const appendToLastMessage = (text: string) => {
    setMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      const updatedLastMessage = {
        ...lastMessage,
        text: lastMessage.text + text
      };
      return [...prevMessages.slice(0, -1), updatedLastMessage];
    });
  };

  const appendMessage = (role: Role, text: string) => {
    setMessages((prevMessages) => [...prevMessages, { role, text }]);
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
    // Kill thread?
    setGeneratedTemplate(null);
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      contentStyle={{
        width: '90vw',
        maxWidth: '90vw',
        height: '90vh',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column'
      }}
      title='AI Prompt'
      Trigger={
        <Button>
          <FontAwesomeIcon icon={faWandMagicSparkles} className='mr-2' />
          <span>{t('askAiToCreateTemplate')}</span>
        </Button>
      }>
      <div className='p-4 flex flex-1 flex-col'>
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
        <div className='p-4 flex flex-1'>
          <div className='flex-[2] rounded bg-white max-h-[75vh] overflow-auto'>
            {generatedTemplate ? (
              renderVNode(generatedTemplate, [])
            ) : (
              <span>No preview</span>
            )}
          </div>
          <div className='w-96 p-4 flex flex-col'>
            <div className={styles.messages}>
              {messages.map((msg, index) => (
                <Message key={index} role={msg.role} text={msg.text} />
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className='flex flex-col items-end'>
              <Textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder='Décrivez le type formulaire que vous souhaitez'
              />
              <Button
                className='mt-3'
                type='submit'
                loading={isAnswering}
                disabled={isAnswering}>
                <span>{t('generate')}</span>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default Chat;
