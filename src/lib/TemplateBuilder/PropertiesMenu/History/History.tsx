import { useTemplateBuilder } from '../../TemplateBuilderContext';
import { useDiffDisplay } from './useDiffDisplay';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import HistoryItem from './HistoryItem';

function History() {
  const { template } = useTemplateBuilder();
  const { getTrackItems, trackChangeItems } = useDiffDisplay();
  const t = useTranslations('TemplateSection');

  useEffect(() => {
    getTrackItems();
  }, [getTrackItems]);

  return (
    <div className='py-4 px-2 max-h-[500px] overflow-auto'>
      <HistoryItem
        user={template.createdBy}
        date={template.createdAt || new Date()}
        message={t('historyItemField', {
          fullName: template.changedBy?.firstName,
          action: t('created'),
          field: t('template')
        })}
      />
      <div>
        {trackChangeItems?.map((item, key) => (
          <HistoryItem
            key={key}
            user={item.changedBy}
            date={item.changedAt || new Date()}
            message={item.message}
          />
        ))}
      </div>
    </div>
  );
}
export default History;
