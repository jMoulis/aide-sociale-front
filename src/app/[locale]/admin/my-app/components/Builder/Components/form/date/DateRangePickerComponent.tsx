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
      const storeId = context.dataset?.connexion?.input?.storeId;
      const filedName = context.dataset?.connexion?.input?.field;
      if (!storeId || !filedName) return;
      onUpdateForm(context, storeId, filedName, date);
    },
    [context, onUpdateForm]
  );

  if (context.isBuilderMode) return <DateBuilderPlaceholder {...props} />;

  return (
    <DateRangePicker
      data-store={context.dataset?.connexion?.input?.storeId}
      onChange={handleDateInputChange}
      date={value as DateRange}
    />
  );
}

export default DateRangePickerComponent;
