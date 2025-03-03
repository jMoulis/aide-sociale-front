import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { useFormContext } from '../FormContext';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils/shadcnUtils';
import { useCallback } from 'react';

function RangeComponent({ props, context }: PropsWithChildrenAndContext) {
  const { onUpdateForm, getFormFieldValue } = useFormContext();
  const value = getFormFieldValue(context);

  const handleChangeValue = useCallback(
    (values: number[]) => {
      const storeSlug = context.dataset?.connexion?.input?.storeSlug;
      const filedName = context.dataset?.connexion?.input?.field;
      if (!storeSlug || !filedName) return;
      onUpdateForm(context, storeSlug, filedName, values);
    },
    [context, onUpdateForm]
  );

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
