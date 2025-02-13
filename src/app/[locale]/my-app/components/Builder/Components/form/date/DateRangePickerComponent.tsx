import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { useFormContext } from '../../FormContext';
import { DateRangePicker } from '@/components/form/Date/DateRangePicker';
import DateBuilderPlaceholder from './DateBuilderPlaceholder';
import { DateRange } from 'react-day-picker';

function DateRangePickerComponent({
  props,
  context
}: PropsWithChildrenAndContext) {
  const { onUpdateForm, getFormFieldValue } = useFormContext();
  const value = getFormFieldValue(context);

  const handleDateInputChange = (date?: DateRange) => {
    const collectionSlug = context.dataset?.collectionSlug;
    const filedName = context.dataset?.connexion?.field;
    if (!collectionSlug || !filedName) return;
    onUpdateForm(collectionSlug, filedName, date);
  };

  if (context.isBuilderMode) return <DateBuilderPlaceholder {...props} />;

  return (
    <DateRangePicker
      data-collection={context.dataset?.collectionSlug}
      onChange={handleDateInputChange}
      date={value as DateRange}
    />
  );
}

export default DateRangePickerComponent;
