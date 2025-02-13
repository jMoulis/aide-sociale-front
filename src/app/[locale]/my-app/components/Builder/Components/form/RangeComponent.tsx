import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { useFormContext } from '../FormContext';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils/shadcnUtils';

function RangeComponent({ props, context }: PropsWithChildrenAndContext) {
  const { onUpdateForm, getFormFieldValue } = useFormContext();
  const value = getFormFieldValue(context);

  const handleChangeValue = (values: number[]) => {
    const collectionSlug = context.dataset?.collectionSlug;
    const filedName = context.dataset?.connexion?.field;
    if (!collectionSlug || !filedName) return;
    onUpdateForm(collectionSlug, filedName, values);
  };

  return (
    <div {...props} className={cn('flex m-1 p-1', props.className)}>
      <Slider
        value={(value as number[]) || [0]}
        onValueChange={handleChangeValue}
        disabled={props.readOnly}
        min={props.min ?? 0}
        max={props.max ?? 100}
        step={props.step ?? 1}
      />
    </div>
  );
}

export default RangeComponent;
