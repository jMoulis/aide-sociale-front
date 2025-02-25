import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { useFormContext } from '../../FormContext';
import { DatePicker } from '@/components/form/Date/DatePicker';
import DateBuilderPlaceholder from './DateBuilderPlaceholder';

function DateComponent({ props, context }: PropsWithChildrenAndContext) {
  const { onUpdateForm, getFormFieldValue } = useFormContext();
  const value = getFormFieldValue(context);

  const handleDateInputChange = (date?: Date) => {
    const collectionSlug = context.dataset?.collectionSlug;
    const filedName = context.dataset?.connexion?.field;
    if (!collectionSlug || !filedName) return;
    onUpdateForm(collectionSlug, filedName, date, context.listIndex);
  };
  if (context.isBuilderMode) return <DateBuilderPlaceholder {...props} />;
  return (
    <DatePicker
      data-collection={context.dataset?.collectionSlug}
      onChange={handleDateInputChange}
      date={value as Date}
    />
  );
}

export default DateComponent;
