import React from 'react';
import { langs } from '@uiw/codemirror-extensions-langs';

import CodeMirror from '@uiw/react-codemirror';
import FormLabel from '@/components/form/FormLabel';

interface CodeEditorProps {
  value: string;
  onUpdate: (value: string) => void;
  lang?: string;
  height?: string;
  title?: string;
  readOnly?: boolean;
}

const CssEditor: React.FC<CodeEditorProps> = ({
  value,
  onUpdate,
  lang,
  height,
  title,
  readOnly = false
}) => {
  return (
    <div>
      <FormLabel>
        <span className='tw-text-gray-700'>{title || 'Style'}</span>
      </FormLabel>
      <CodeMirror
        readOnly={readOnly}
        lang={lang || 'css'}
        value={value}
        height={height || '300px'}
        extensions={[langs.css(), langs.javascript()]}
        onChange={onUpdate}
      />
    </div>
  );
};

export default CssEditor;
