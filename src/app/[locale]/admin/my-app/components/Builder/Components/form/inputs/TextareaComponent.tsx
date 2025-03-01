import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { useFormContext } from '../../FormContext';
import Textarea from '@/components/form/Textarea';
import { ChangeEvent, useCallback } from 'react';

function TextareaComponent({ props, context }: PropsWithChildrenAndContext) {
  const { onUpdateForm, getFormFieldValue } = useFormContext();
  const value = getFormFieldValue(context);

  const handleChangeValue = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      const { value } = e.target;
      const storeId = context.dataset?.connexion?.input?.storeId;
      const filedName = context.dataset?.connexion?.input?.field;
      if (!storeId || !filedName) return;
      onUpdateForm(context, storeId, filedName, value);
    },
    [context, onUpdateForm]
  );
  return (
    <Textarea
      {...props}
      {...context.input}
      data-store={context.dataset?.connexion?.input?.storeId}
      data-listindex={context.listIndex}
      onChange={handleChangeValue}
      value={value}
      name={context.dataset?.connexion?.input?.field}
    />
  );
}

export default TextareaComponent;
