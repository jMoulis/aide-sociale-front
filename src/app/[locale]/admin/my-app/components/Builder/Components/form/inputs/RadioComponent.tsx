import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { useFormContext } from '../../FormContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCallback, useEffect, useState } from 'react';
import { SelectboxOption } from '@/components/form/Selectbox';
import FormLabel from '@/components/form/FormLabel';
import { buildOptions } from '../../utils';

function RadioComponent({ context, props }: PropsWithChildrenAndContext) {
  const { onUpdateForm, getFormFieldValue, asyncData, getMultichoiceOptions } =
    useFormContext();
  const [options, setOptions] = useState<SelectboxOption[]>(
    buildOptions(asyncData, context)
  );
  const value = getFormFieldValue(context);

  useEffect(() => {
    getMultichoiceOptions(context.dataset).then((choices) =>
      setOptions(choices)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.dataset]);

  const handleChangeValue = useCallback(
    (value: string) => {
      const storeId = context.dataset?.connexion?.input?.storeId;
      const filedName = context.dataset?.connexion?.input?.field;
      if (!storeId || !filedName) return;
      onUpdateForm(context, storeId, filedName, value);
    },
    [context, onUpdateForm]
  );

  if (context.isBuilderMode) {
    return (
      <RadioGroup
        ref={props.ref}
        data-store={context.dataset?.connexion?.input?.storeId}
        data-listindex={context.listIndex}
        className={props.className}
        onClick={props.onClick}
        name={context.dataset?.connexion?.input?.field}
        defaultValue={value as string | undefined}
        onValueChange={handleChangeValue}>
        <div className='flex items-center space-x-2'>
          <RadioGroupItem value='option1' id='option1' />
          <FormLabel className='mb-0' htmlFor={`option1`}>
            Option 1
          </FormLabel>
        </div>
      </RadioGroup>
    );
  }

  return (
    <RadioGroup
      name={context.dataset?.connexion?.input?.field}
      defaultValue={value as string | undefined}
      onValueChange={handleChangeValue}>
      {options.map((opt: { label: string; value: string }, i: number) => (
        <div key={i} className='flex items-center space-x-2'>
          <RadioGroupItem
            value={opt.value}
            id={`${i}-${context.dataset?.connexion?.input?.field}`}
          />
          <FormLabel
            className='mb-0'
            htmlFor={`${i}-${context.dataset?.connexion?.input?.field}`}>
            {opt.label}
          </FormLabel>
        </div>
      ))}
    </RadioGroup>
  );
}

export default RadioComponent;
