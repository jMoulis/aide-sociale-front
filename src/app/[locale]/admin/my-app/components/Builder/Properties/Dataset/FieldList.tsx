import FormLabel from '@/components/form/FormLabel';
import { Checkbox } from '@/components/ui/checkbox';
import { ICollection } from '@/lib/interfaces/interfaces';
import { CheckedState } from '@radix-ui/react-checkbox';
import { useTranslations } from 'next-intl';

type Props = {
  selectedCollection: ICollection | null;
  currentField?: string;
  onSelectField: (state: CheckedState, field: string, system?: boolean) => void;
};
function FieldList({ selectedCollection, onSelectField, currentField }: Props) {
  const t = useTranslations('CollectionSection');
  if (!selectedCollection) return null;
  return (
    <div className='my-2 max-h-44 overflow-auto'>
      <FormLabel className='text-gray-700'>{t('selectValueField')}</FormLabel>
      <ul className='ml-2'>
        {selectedCollection.fields.map((field, index) => (
          <li key={index} className='mt-2 flex items-center'>
            <Checkbox
              id={`${field.key}`}
              onCheckedChange={(state) => onSelectField(state, field.key)}
              value={field.key}
              checked={currentField === `data.${field.key}`}
            />
            <FormLabel className='mb-0 ml-1' htmlFor={field.key}>
              {field.label}
            </FormLabel>
          </li>
        ))}
      </ul>
      <FormLabel className='text-gray-700'>{t('selectSystemField')}</FormLabel>
      <ul className='ml-2'>
        {Object.keys(selectedCollection || {}).map((key) => {
          const value = (selectedCollection as any)[key];
          if (typeof value !== 'string') return null;
          return (
            <li key={key} className='mt-2 flex items-center'>
              <Checkbox
                id={`${key}`}
                onCheckedChange={(state) => onSelectField(state, key, true)}
                value={key}
                checked={currentField === `${key}`}
              />
              <FormLabel className='mb-0 ml-1' htmlFor={key}>
                {key}
              </FormLabel>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
export default FieldList;
