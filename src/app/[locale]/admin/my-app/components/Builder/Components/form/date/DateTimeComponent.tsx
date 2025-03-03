import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { useFormContext } from '../../FormContext';
import { DateTimePicker } from '@/components/form/Date/DateTimePicker';
import DateBuilderPlaceholder from './DateBuilderPlaceholder';
import { useCallback } from 'react';

function DateTimeComponent({ props, context }: PropsWithChildrenAndContext) {
  const { onUpdateForm, getFormFieldValue } = useFormContext();
  const value = getFormFieldValue(context);

  const handleDateInputChange = useCallback(
    (date?: Date) => {
      const storeSlug = context.dataset?.connexion?.input?.storeSlug;
      const filedName = context.dataset?.connexion?.input?.field;
      if (!storeSlug || !filedName) return;
      onUpdateForm(context, storeSlug, filedName, date);
    },
    [context, onUpdateForm]
  );

  if (context.isBuilderMode) return <DateBuilderPlaceholder {...props} />;
  return (
    <DateTimePicker
      data-store={context.dataset?.connexion?.input?.storeSlug}
      onChange={handleDateInputChange}
      date={value as Date}
    />
  );
}

export default DateTimeComponent;
