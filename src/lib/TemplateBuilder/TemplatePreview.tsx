'use client';

import { useTemplateBuilder } from './TemplateBuilderContext';
import PreviewBlock from './PreviewBlock';
import AddSectionToolbar from './AddSectionToolbar';

export default function TemplatePreview() {
  const { template, isEditable } = useTemplateBuilder();
  return (
    <div className='h-[calc(100vh-200px)] overflow-y-auto p-2 rounded-md mt-2'>
      {isEditable ? <AddSectionToolbar /> : null}
      {template.blocks.map((block, blockIndex) => (
        <PreviewBlock block={block} key={block.id} blockIndex={blockIndex} />
      ))}
    </div>
  );
}
