import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { useFormContext } from '../../FormContext';
import { DateRangePicker } from '@/components/form/Date/DateRangePicker';
import DateBuilderPlaceholder from './DateBuilderPlaceholder';
import { DateRange } from 'react-day-picker';
import { useCallback } from 'react';

function DateRangePickerComponent({
  props,
  context
}: PropsWithChildrenAndContext) {
  const { onUpdateForm, getFormFieldValue } = useFormContext();
  const value = getFormFieldValue(context);

  const handleDateInputChange = useCallback(
    (date?: DateRange) => {
      const storeSlug = context.dataset?.connexion?.input?.storeSlug;
      const filedName = context.dataset?.connexion?.input?.field;

      if (!storeSlug || !filedName) return;
      onUpdateForm(context, storeSlug, filedName, date);
    },
    [context, onUpdateForm]
  );

  if (context.isBuilderMode) return <DateBuilderPlaceholder {...props} />;

  return (
    <DateRangePicker
      onChange={handleDateInputChange}
      date={value as DateRange}
    />
  );
}

export default DateRangePickerComponent;
