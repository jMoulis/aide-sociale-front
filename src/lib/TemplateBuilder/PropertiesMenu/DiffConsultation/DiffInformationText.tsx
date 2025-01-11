import { faQuestionCircle } from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslations } from 'next-intl';

function DiffInformationText() {
  const t = useTranslations('TemplateSection');

  return (
    <div className='flex items-center space-x-2'>
      <FontAwesomeIcon icon={faQuestionCircle} className='text-green-500' />
      <p className='text-xs'>{t('impactInfo')}</p>
    </div>
  );
}
export default DiffInformationText;
