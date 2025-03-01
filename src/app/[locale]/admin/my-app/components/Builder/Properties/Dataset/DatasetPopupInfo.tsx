import Popup from '@/components/popup/Popup';
import { faInfoCircle } from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IVDOMNode } from '../../../interfaces';
import { useTranslations } from 'next-intl';

type Props = {
  parentForm?: IVDOMNode | null;
  datasetKey: 'input' | 'output';
};
function DatasetPopupInfo({ parentForm, datasetKey }: Props) {
  const t = useTranslations('CollectionSection');
  if (!parentForm) return null;
  return (
    <Popup
      trigger={
        <span className='mt-1 text-xs text-gray-700 block text-left'>
          <FontAwesomeIcon icon={faInfoCircle} className='mr-1 text-blue-600' />
          {t('parentCollection', {
            collectionName:
              parentForm?.context?.dataset?.connexion?.[datasetKey]?.storeId
          })}
        </span>
      }>
      <div className='p-2'>
        <p className='font-bold text-xs text-gray-700 whitespace-pre'>
          Informations
        </p>
        <p className='text-xs text-gray-700 whitespace-pre'>
          Les champs de formulaire sont liés à la collection du formulaire
          parent.
        </p>
        <p className='text-xs text-gray-700 whitespace-pre'>
          Pour modifier la collection, veuillez modifier le formulaire parent.
        </p>
      </div>
    </Popup>
  );
}
export default DatasetPopupInfo;
