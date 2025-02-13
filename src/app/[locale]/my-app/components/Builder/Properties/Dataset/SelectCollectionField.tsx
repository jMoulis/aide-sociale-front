import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import SelectboxCollections from './SelectboxCollections';
import { ICollection, IDataset } from '@/lib/interfaces/interfaces';
import { useTranslations } from 'next-intl';
import { ElementConfigProps, IVDOMNode } from '../../../interfaces';
import CollectionFormDialog from './CollectionFormDialog';
import Button from '@/components/buttons/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatasetPopupInfo from './DatasetPopupInfo';
import { faUnlink } from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';

type Props = {
  collections: Record<string, ICollection>;
  config: ElementConfigProps;
  parentForm: IVDOMNode | null;
  onSelectCollection: (collection?: string) => void;
  currentDataset: IDataset | null;
  collectionsSelectedCollection: ICollection | null;
  fetchCollections: () => void;
  onClearSelectedCollection: () => void;
};
function SelectCollectionField({
  collections,
  config,
  parentForm,
  currentDataset,
  collectionsSelectedCollection,
  onSelectCollection,
  onClearSelectedCollection,
  fetchCollections
}: Props) {
  const t = useTranslations('CollectionSection');

  return (
    <div>
      <FormField>
        <FormLabel className='text-gray-700 text-sm'>
          {t('selectCollection')}
        </FormLabel>
        <div className='flex'>
          <SelectboxCollections
            collections={collections}
            disabled={
              !config.options?.includes('SELECT_COLLECTION') ||
              Boolean(parentForm)
            }
            onValueChange={onSelectCollection}
            defaultValue={currentDataset?.collectionSlug || ''}
            value={currentDataset?.collectionSlug || ''}
            triggerLabel={
              parentForm?.context?.dataset?.collectionName ||
              currentDataset?.collectionName ||
              t('selectCollection')
            }
          />

          {config.options?.includes('SELECT_COLLECTION') ? (
            <>
              {collectionsSelectedCollection ? (
                <CollectionFormDialog
                  prevCollection={collectionsSelectedCollection}
                  onSubmit={fetchCollections}
                  onOpen={onSelectCollection}
                />
              ) : (
                <span />
              )}
              <CollectionFormDialog onSubmit={fetchCollections} />
              <Button onClick={onClearSelectedCollection}>
                <FontAwesomeIcon icon={faUnlink} />
              </Button>
            </>
          ) : null}
        </div>
        <DatasetPopupInfo parentForm={parentForm} />
      </FormField>
    </div>
  );
}
export default SelectCollectionField;
