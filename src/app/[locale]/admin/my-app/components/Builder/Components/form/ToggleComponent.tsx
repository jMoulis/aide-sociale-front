import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { useFormContext } from '../FormContext';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils/shadcnUtils';
import { useCallback } from 'react';

function ToggleComponent({ props, context }: PropsWithChildrenAndContext) {
  const { onUpdateForm, getFormFieldValue } = useFormContext();
  const value = getFormFieldValue(context);

  const handleChangeValue = useCallback(
    (values: boolean) => {
      const storeId = context.dataset?.connexion?.input?.storeId;
      const filedName = context.dataset?.connexion?.input?.field;
      if (!storeId || !filedName) return;
      onUpdateForm(context, storeId, filedName, values);
    },
    [context, onUpdateForm]
  );

  return (
    <div
      ref={props.ref}
      onClick={props.onClick}
      className={cn('flex w-fit m-1 p-1', props.className)}>
      <Switch
        checked={(value as boolean) ?? false}
        onCheckedChange={handleChangeValue}
        disabled={props.readOnly}
        required={props.required}
      />
    </div>
  );
}

export default ToggleComponent;
