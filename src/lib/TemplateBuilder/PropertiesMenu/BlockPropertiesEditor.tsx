import FormField from '@/components/form/FormField';
import { IFormBlock } from '../interfaces';
import { useTemplateBuilder } from '../TemplateBuilderContext';
import FormLabel from '@/components/form/FormLabel';
import Selectbox from '@/components/form/Selectbox';
import { useTranslations } from 'next-intl';
import Input from '@/components/form/Input';
import { ChangeEvent } from 'react';
import Button from '@/components/buttons/Button';
import { faTrash } from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Props = {
  block: IFormBlock;
};
// Editor for block-level properties
function BlockPropertiesEditor({ block }: Props) {
  const { setTemplate, deleteBlock, isEditable } = useTemplateBuilder();
  const t = useTranslations('TemplateSection');

  const handleLayoutChange = (layout: string) => {
    setTemplate((prev) => ({
      ...prev,
      blocks: prev.blocks.map((prevBlock) =>
        prevBlock.id === block.id
          ? { ...prevBlock, layout: layout as any }
          : prevBlock
      )
    }));
  };
  const handleChangeBlockTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTemplate((prev) => ({
      ...prev,
      blocks: prev.blocks.map((prevBlock) =>
        prevBlock.id === block.id
          ? { ...prevBlock, title: e.target.value }
          : prevBlock
      )
    }));
  };

  return (
    <div className='p-4 space-y-4'>
      <h2 className='font-bold'>{t('sectionProperties')}</h2>
      <FormField>
        <FormLabel>{t('blockTitle')}</FormLabel>
        <Input
          type='text'
          value={block.title || ''}
          onChange={handleChangeBlockTitle}
          disabled={!isEditable}
        />
      </FormField>
      <FormField>
        <FormLabel>{t('layout.label')}</FormLabel>
        <Selectbox
          name='layout'
          value={block.layout}
          disabled={!isEditable}
          options={[
            {
              label: t('layout.singleColumn'),
              value: 'single-column'
            },
            {
              label: t('layout.twoColumns'),
              value: 'two-column'
            },
            {
              label: t('layout.threeColumns'),
              value: 'three-column'
            }
          ]}
          onChange={(e) => handleLayoutChange(e.target.value)}
        />
      </FormField>
      {isEditable ? (
        <Button className='text-red-500' onClick={() => deleteBlock(block.id)}>
          <FontAwesomeIcon icon={faTrash} />
        </Button>
      ) : null}
    </div>
  );
}

export default BlockPropertiesEditor;
