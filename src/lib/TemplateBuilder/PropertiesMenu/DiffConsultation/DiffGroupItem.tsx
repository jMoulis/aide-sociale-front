import { useTranslations } from 'next-intl';
import { CustomDiffResult } from '../../interfaces';
import DiffListItem from './DiffListItem';

type Props = {
  diff: Record<string, CustomDiffResult[]> | null;
};
function DiffGroupItem({ diff }: Props) {
  const t = useTranslations('TemplateSection');

  if (!diff) {
    return <span className='text-xs'>{t('noImpact')}</span>;
  }
  return (
    <ul className='max-h-[50vh] overflow-auto'>
      {Object.entries(diff).map(([key, value]) => (
        <li key={key} className='bg-indigo-50 mb-2 p-2 rounded-md'>
          <h3 className='text-sm'>
            {t('fields')}: {t(key as any)}
          </h3>
          {value.length === 0 ? (
            <span className='text-xs'>{t('noImpact')}</span>
          ) : null}
          <ul>
            {value.map((field, index) => (
              <DiffListItem key={index} groupName={key as any} field={field} />
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
export default DiffGroupItem;
