import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAdd,
  faArrowDown,
  faArrowUp
} from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import Button from '@/components/buttons/Button';
import { useTemplateBuilder } from './TemplateBuilderContext';
import { IFormBlock } from './interfaces';
import Dialog from '@/components/dialog/Dialog';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { fieldTypes } from './fieldTypes';

type Props = {
  blockIndex: number;
  block: IFormBlock;
};
const BlockToolbar = ({ blockIndex, block }: Props) => {
  const { template, reorderBlock, addFieldToBlock, isEditable } =
    useTemplateBuilder();
  const [open, setOpen] = useState(false);
  const t = useTranslations('TemplateSection');

  const handleSelectFieldType = (fieldType: string) => {
    addFieldToBlock(block.id, fieldType as any);
    setOpen(false);
  };
  if (!isEditable) return null;
  return (
    <div className='items-center justify-between absolute hidden z-10 right-[3px] top-[1px] group-hover/block:flex'>
      <Dialog
        title={t('addField')}
        open={open}
        onOpenChange={setOpen}
        Trigger={
          <Button className='flex items-center justify-center w-6 h-6 mr-1 bg-white'>
            <FontAwesomeIcon icon={faAdd} />
          </Button>
        }>
        <ul className='grid grid-cols-3 gap-3'>
          {fieldTypes.map((fieldType) => (
            <li key={fieldType.value} className='flex'>
              <Button
                className='flex-1 grid grid-cols-[30px_1fr] gap-2 p-2'
                onClick={() => handleSelectFieldType(fieldType.value)}>
                <FontAwesomeIcon size='2x' icon={fieldType.icon} />
                <span className='text-sm text-left'>{fieldType.label}</span>
              </Button>
            </li>
          ))}
        </ul>
      </Dialog>
      <Button
        className='bg-gray-200 flex items-center justify-center w-6 h-6 mr-1'
        onClick={() => reorderBlock(block.id, 'up')}
        disabled={blockIndex === 0}>
        <FontAwesomeIcon icon={faArrowUp} />
      </Button>
      <Button
        className='bg-gray-200 flex items-center justify-center w-6 h-6 mr-1'
        onClick={() => reorderBlock(block.id, 'down')}
        disabled={blockIndex === template.blocks.length - 1}>
        <FontAwesomeIcon icon={faArrowDown} />
      </Button>
    </div>
  );
};
export default BlockToolbar;
