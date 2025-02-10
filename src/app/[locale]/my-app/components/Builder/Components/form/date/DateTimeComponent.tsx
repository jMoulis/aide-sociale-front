import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { useFormContext } from '../../FormContext';
import { DateTimePicker } from '@/components/form/Date/DateTimePicker';
import DateBuilderPlaceholder from './DateBuilderPlaceholder';

function DateTimeComponent({ props, context }: PropsWithChildrenAndContext) {
  const { onUpdateForm, getFormFieldValue } = useFormContext();
  const value = getFormFieldValue(context.dataset);
  const handleDateInputChange = (date?: Date) => {
    const collectionSlug = context.dataset?.collectionSlug;
    const filedName = context.dataset?.connexion?.field;
    if (!collectionSlug || !filedName) return;
    onUpdateForm(collectionSlug, filedName, date);
  };

  if (context.isBuilderMode) return <DateBuilderPlaceholder {...props} />;
  return (
    <DateTimePicker
      data-collection={context.dataset?.collectionSlug}
      onChange={handleDateInputChange}
      date={value as Date}
    />
  );
}

export default DateTimeComponent;
