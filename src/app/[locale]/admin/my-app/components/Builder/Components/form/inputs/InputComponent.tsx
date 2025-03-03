import Input from '@/components/form/Input';
import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { useFormContext } from '../../FormContext';
import { ChangeEvent, useCallback } from 'react';

function InputComponent({ props, context }: PropsWithChildrenAndContext) {
  const { onUpdateForm, getFormFieldValue } = useFormContext();
  const value = getFormFieldValue(context);

  const handleChangeValue = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      const storeSlug = context.dataset?.connexion?.input?.storeSlug;
      const filedName = context.dataset?.connexion?.input?.field;
      if (!storeSlug || !filedName) return;
      onUpdateForm(context, storeSlug, filedName, value);
    },
    [context, onUpdateForm]
  );

  return (
    <Input
      {...props}
      {...context.input}
      onChange={handleChangeValue}
      // onBlur={handleOnBlur}
      value={value}
      name={context.dataset?.connexion?.input?.field}
    />
  );
}

export default InputComponent;
