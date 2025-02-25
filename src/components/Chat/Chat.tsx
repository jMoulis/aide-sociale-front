'use client';

import React, { useState, useEffect, useRef, FormEvent } from 'react';
import styles from './chat.module.css';
import { AssistantStream } from 'openai/lib/AssistantStream';
import Markdown from 'react-markdown';
// @ts-expect-error - no types for this yet
import { AssistantStreamEvent } from 'openai/resources/beta/assistants/assistants';
import { RequiredActionFunctionToolCall } from 'openai/resources/beta/threads/runs/runs';
import {
  AnnotationDelta,
  TextDelta
} from 'openai/resources/beta/threads/messages.mjs';
import { getImages } from '@/app/[locale]/admin/assistant-webpage/actions';
import { isValidJSON } from '@/lib/utils/utils';
import { IAiMessage } from '@/lib/TemplateBuilder/AiPromptTemplate/interfaces';
import { parseHTMLToVDOM } from '@/app/[locale]/admin/my-app/components/Builder/Properties/AiFormPrompt/utils';
import { usePageBuilderStore } from '@/app/[locale]/admin/my-app/components/stores/pagebuilder-store-provider';
import { IVDOMNode } from '@/app/[locale]/admin/my-app/components/interfaces';
import { renderVNode } from '@/app/[locale]/admin/my-app/components/Builder/Components/renderVode';

type Role = 'user' | 'assistant' | 'code';
type MessageProps = {
  role: 'user' | 'assistant' | 'code';
  text: string;
};

const UserMessage = ({ text }: { text: string }) => {
  return <div className={styles.userMessage}>{text}</div>;
};

const AssistantMessage = ({ text }: { text: string }) => {
  return (
    <div className={styles.assistantMessage}>
      <Markdown>{text}</Markdown>
    </div>
  );
};

const CodeMessage = ({ text }: { text: string }) => {
  return (
    <div className={styles.codeMessage}>
      {text.split('\n').map((line, index) => (
        <div key={index}>
          <span>{`${index + 1}. `}</span>
          {line}
        </div>
      ))}
    </div>
  );
};

const Message = ({ role, text }: MessageProps) => {
  switch (role) {
    case 'user':
      return <UserMessage text={text} />;
    case 'assistant':
      return <AssistantMessage text={text} />;
    case 'code':
      return <CodeMessage text={text} />;
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
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<{ role: Role; text: string }[]>([]);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [threadId, setThreadId] = useState('');

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
        }
      }
    }
  }, [isAnswering, messages]);

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
    setInputDisabled(true);
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

    setInputDisabled(true);
    submitActionResult(runId, toolCallOutputs);
  };

  // handleRunCompleted - re-enable the input form
  const handleRunCompleted = () => {
    console.log('run completed');
    setIsAnswering(false);
    setInputDisabled(false);
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

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messages}>
        {messages.map((msg, index) => (
          <Message key={index} role={msg.role} text={msg.text} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={handleSubmit}
        className={`${styles.inputForm} ${styles.clearfix}`}>
        <input
          type='text'
          className={styles.input}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder='Enter your question'
        />
        <button
          type='submit'
          className={styles.button}
          disabled={inputDisabled}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
