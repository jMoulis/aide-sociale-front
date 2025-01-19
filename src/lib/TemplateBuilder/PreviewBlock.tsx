'use client';

import { IFormBlock } from './interfaces';
import { useTemplateBuilder } from './TemplateBuilderContext';
import { PreviewField } from './PreviewField';
import BlockToolbar from './BlockToolbar';

type Props = {
  block: IFormBlock;
  blockIndex: number;
};
export default function PreviewBlock({ block, blockIndex }: Props) {
  const { selectedBlockId, selectedFieldId, selectBlock } =
    useTemplateBuilder();

  const isBlockSelected = block.id === selectedBlockId;

  // Compute grid classes
  let columns = 'grid-cols-1';
  if (block.layout === 'two-column') columns = 'grid-cols-2';
  if (block.layout === 'three-column') columns = 'grid-cols-3';

  return (
    <div
      key={block.id}
      onClick={(e) => {
        e.stopPropagation();
        selectBlock(block.id);
      }}
      className={`border min-h-7 cursor-pointer rounded group/block border-blue-300 relative ${
        isBlockSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent'
      }`}>
      <BlockToolbar blockIndex={blockIndex} block={block} />
      <h1>{block.title}</h1>
      <div className={`grid ${columns} mb-2`}>
        {block.fields.map((field, fieldIndex) => {
          const isFieldSelected =
            isBlockSelected && field.id === selectedFieldId;
          return (
            <PreviewField
              key={fieldIndex}
              field={field}
              blockId={block.id}
              isFieldSelected={isFieldSelected}
              fieldIndex={fieldIndex}
              isLastField={fieldIndex === block.fields.length - 1}
            />
          );
        })}
      </div>
    </div>
  );
}
