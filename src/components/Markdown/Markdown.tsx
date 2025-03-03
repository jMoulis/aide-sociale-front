import React from 'react';
import MarkdownPreview from '@uiw/react-markdown-preview';
import '@uiw/react-markdown-preview/markdown.css';

type Props = {
  source: string;
  style?: React.CSSProperties;
};
export default function Markdown({ source, style = { flex: 1 } }: Props) {
  return (
    <>
      <MarkdownPreview
        wrapperElement={{
          'data-color-mode': 'dark'
        }}
        source={source}
        style={style}
      />
    </>
  );
}
