import { useTranslations } from 'next-intl';
import { useTemplateBuilder } from '../TemplateBuilderContext';
import BlockPropertiesEditor from './BlockPropertiesEditor';
import FieldPropertiesEditor from './FieldProperties/FieldPropertiesEditor';

function ElementPropertiesMenu() {
  const t = useTranslations('TemplateSection');
  const { selectedBlockId, selectedFieldId, template } = useTemplateBuilder();
  if (!selectedBlockId) {
    return (
      <div className='p-4'>
        <p className='text-gray-600'>{t('noBlockOrFieldSelected')}</p>
      </div>
    );
  }

  if (selectedBlockId && !selectedFieldId) {
    const block = template.blocks.find((b) => b.id === selectedBlockId);
    if (!block) {
      return <p className='p-4'>{t('blockNotFound')}</p>;
    }
    return <BlockPropertiesEditor block={block} />;
  }

  if (selectedBlockId && selectedFieldId) {
    const block = template.blocks.find((b) => b.id === selectedBlockId);
    if (!block) {
      return <p className='p-4'>{t('blockNotFound')}</p>;
    }
    const field = block.fields.find((f) => f.id === selectedFieldId);
    if (!field) {
      return <p className='p-4'>{t('fieldNotFound')}</p>;
    }
    return <FieldPropertiesEditor blockId={block.id} field={field} />;
  }
  return null;
}
export default ElementPropertiesMenu;
