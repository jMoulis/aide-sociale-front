'use client';

import Editor from '@monaco-editor/react';
import { useRef } from 'react';

type Props = {
  onChange: (value: string) => void;
  value: string;
  lang?: string;
  height?: string;
  title?: string;
  readOnly?: boolean;
};
export default function IDE({ onChange, value, lang }: Props) {
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };
  function handleEditorChange(value?: string) {
    onChange(value || '');
  }
  return (
    <div className='flex justify-center items-start h-full'>
      <Editor
        height='100%'
        theme='vs-dark'
        defaultLanguage={lang ?? 'css'}
        onChange={handleEditorChange}
        defaultValue={value}
        onMount={handleEditorDidMount}
      />
    </div>
  );
}
