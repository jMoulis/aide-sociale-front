import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { useFormContext } from '../../FormContext';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckedState } from '@radix-ui/react-checkbox';
import FormLabel from '@/components/form/FormLabel';
import FormField from '@/components/form/FormField';
import { useEffect, useState } from 'react';
import { SelectboxOption } from '@/components/form/Selectbox';
import { buildOptions } from '../../utils';

function CheckboxComponent({ props, context }: PropsWithChildrenAndContext) {
  const { getFormFieldValue, asyncData, getMultichoiceOptions } =
    useFormContext();
  const value = getFormFieldValue(context);
  const [options, setOptions] = useState<SelectboxOption[]>(
    buildOptions(asyncData, context)
  );
  const handleInputChange = (_state: CheckedState) => {
    //TODO:  Add the possibility to select multiple options
    // onMultiSelectChange({
    //   target: {
    //     name: context.dataset?.connexion?.input?.field,
    //     value: state,
    //     dataset: {
    //       store: context.dataset?.connexion?.input?.storeSlug
    //     } as any
    //   }
    // } as React.ChangeEvent<HTMLInputElement>);
  };

  useEffect(() => {
    getMultichoiceOptions(context.dataset).then((choices) =>
      setOptions(choices)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.dataset]);

  return (
    <FormField>
      {options.map((opt: { label: string; value: string }, i: number) => (
        <div key={i} className='flex items-center space-x-2'>
          <Checkbox
            {...props}
            checked={value}
            onCheckedChange={handleInputChange}
          />
          <FormLabel
            className='mb-0'
            htmlFor={`${i}-${context.dataset?.connexion?.input?.field}`}>
            {opt.label}
          </FormLabel>
        </div>
      ))}
    </FormField>
  );
}

export default CheckboxComponent;
