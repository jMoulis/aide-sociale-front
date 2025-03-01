'use client';

import Editor, { Monaco, loader } from '@monaco-editor/react';
import { useEffect, useRef } from 'react';
// Set the worker manually to avoid failed network requests
loader.config({
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs'
  }
});

type Props = {
  onChange: (value: string) => void;
  value: string;
  lang?: string;
  height?: string;
  title?: string;
  readOnly?: boolean;
  schemaDef?: {
    id: string;
    schema: any;
  };
};

export default function IDE({ onChange, value, lang, schemaDef }: Props) {
  const editorRef = useRef(null);
  const monacoRef = useRef<Monaco | null>(null);

  useEffect(() => {
    if (monacoRef.current && schemaDef) {
      if (schemaDef) {
        monacoRef.current.languages.json.jsonDefaults.setDiagnosticsOptions({
          validate: true,
          schemas: [
            {
              uri: schemaDef.id, // Unique identifier for the schema
              fileMatch: ['*'], // Apply to all JSON files
              schema: schemaDef.schema
            }
          ]
        });
      }
    }
  }, [schemaDef]);

  const handleBeforeMount = (monaco: Monaco) => {
    // setMonaco(monaco);
    monacoRef.current = monaco;
  };
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
        beforeMount={handleBeforeMount}
      />
    </div>
  );
}
