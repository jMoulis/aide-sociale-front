import FormLabel from '@/components/form/FormLabel';
import { Checkbox } from '@/components/ui/checkbox';
import { ICollection, IDataset } from '@/lib/interfaces/interfaces';
import { CheckedState } from '@radix-ui/react-checkbox';
import { useTranslations } from 'next-intl';

type Props = {
  selectedCollection: ICollection | null;
  currentCollection: IDataset | null;
  onSelectField: (state: CheckedState, field: string) => void;
};
function FieldList({
  selectedCollection,
  currentCollection,
  onSelectField
}: Props) {
  const t = useTranslations('CollectionSection');

  if (!selectedCollection) return null;
  return (
    <div className='my-2'>
      <FormLabel className='text-gray-700'>{t('selectValueField')}</FormLabel>
      <ul className='ml-2'>
        {selectedCollection.fields.map((field, index) => (
          <li key={index} className='mt-2 flex items-center'>
            <Checkbox
              id={`${field.key}`}
              onCheckedChange={(state) => onSelectField(state, field.key)}
              value={field.key}
              checked={currentCollection?.connexion?.field === field.key}
            />
            <FormLabel className='mb-0 ml-1' htmlFor={field.key}>
              {field.label}
            </FormLabel>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default FieldList;
