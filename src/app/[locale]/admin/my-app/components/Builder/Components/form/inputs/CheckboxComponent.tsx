import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { useFormContext } from '../../FormContext';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckedState } from '@radix-ui/react-checkbox';
import { useCallback } from 'react';

function CheckboxComponent({ props, context }: PropsWithChildrenAndContext) {
  const { onUpdateForm, getFormFieldValue } = useFormContext();
  const value = getFormFieldValue(context);

  const handleChangeValue = useCallback(
    (value: CheckedState) => {
      const storeId = context.dataset?.connexion?.input?.storeId;
      const filedName = context.dataset?.connexion?.input?.field;
      if (!storeId || !filedName) return;
      onUpdateForm(context, storeId, filedName, value);
    },
    [context, onUpdateForm]
  );
  return (
    <Checkbox {...props} checked={value} onCheckedChange={handleChangeValue} />
  );
}

export default CheckboxComponent;
