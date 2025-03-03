import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { useFormContext } from '../../FormContext';
import { DatePicker } from '@/components/form/Date/DatePicker';
import DateBuilderPlaceholder from './DateBuilderPlaceholder';
import { useCallback } from 'react';

function DateComponent({ props, context }: PropsWithChildrenAndContext) {
  const { onUpdateForm, getFormFieldValue } = useFormContext();
  const value = getFormFieldValue(context);

  const handleDateInputChange = useCallback(
    (date?: Date) => {
      const storeSlug = context.dataset?.connexion?.input?.storeSlug;
      const fieldName = context.dataset?.connexion?.input?.field;
      if (!storeSlug || !fieldName) return;
      onUpdateForm(context, storeSlug, fieldName, date);
    },
    [context, onUpdateForm]
  );

  if (context.isBuilderMode) return <DateBuilderPlaceholder {...props} />;
  return (
    <DatePicker
      data-store={context.dataset?.connexion?.input?.storeSlug}
      onChange={handleDateInputChange}
      date={value ? new Date(value as string) : undefined}
    />
  );
}

export default DateComponent;
