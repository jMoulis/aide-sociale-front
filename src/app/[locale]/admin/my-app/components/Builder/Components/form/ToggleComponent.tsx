import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { useFormContext } from '../FormContext';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils/shadcnUtils';

function ToggleComponent({ props, context }: PropsWithChildrenAndContext) {
  const { onUpdateForm, getFormFieldValue } = useFormContext();
  const value = getFormFieldValue(context);

  const handleChangeValue = (value: boolean) => {
    const collectionSlug = context.dataset?.collectionSlug;
    const filedName = context.dataset?.connexion?.field;
    if (!collectionSlug || !filedName) return;
    onUpdateForm(collectionSlug, filedName, value, context.listIndex);
  };
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
