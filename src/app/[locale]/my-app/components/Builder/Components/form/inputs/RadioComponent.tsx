import {
  PropsWithChildrenAndContext,
  VDOMContext
} from '@/lib/interfaces/interfaces';
import { useFormContext } from '../../FormContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useEffect, useState } from 'react';
import { SelectboxOption } from '@/components/form/Selectbox';
import FormLabel from '@/components/form/FormLabel';

const buildOptions = (
  lists: Record<string, any[]>,
  context: VDOMContext
): SelectboxOption[] => {
  const connexion = context?.dataset?.connexion;
  if (!connexion) return [];

  const externalDataOptions = connexion.externalDataOptions;
  const staticDataOptions = connexion.staticDataOptions;
  if (!externalDataOptions && !staticDataOptions) return [];

  if (
    externalDataOptions?.collectionSlug &&
    externalDataOptions?.labelField &&
    externalDataOptions?.valueField
  ) {
    const list = lists[externalDataOptions.collectionSlug];
    if (!list) return [] as any;
    const options = list.reduce((acc: SelectboxOption[], item) => {
      if (!item[externalDataOptions.labelField]) return acc;
      return [
        ...acc,
        {
          label: item[externalDataOptions.labelField],
          value: item[externalDataOptions.valueField]
        }
      ];
    }, []);
    return options;
  }
  if (staticDataOptions) {
    return staticDataOptions.map((option) => ({
      value: option,
      label: option
    }));
  }
  return [] as any;
};
function RadioComponent({ context, props }: PropsWithChildrenAndContext) {
  const { onInputChange, getFormFieldValue, lists } = useFormContext();
  const [options, setOptions] = useState<SelectboxOption[]>(
    buildOptions(lists, context)
  );
  const value = getFormFieldValue(context);

  useEffect(() => {
    setOptions(buildOptions(lists, context));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.dataset]);

  const handleSelectOption = (selectedValue: string) => {
    onInputChange({
      target: {
        name: context.dataset?.connexion?.field,
        value: selectedValue,
        dataset: {
          collection: context.dataset?.collectionSlug
        } as any
      }
    } as React.ChangeEvent<HTMLInputElement>);
  };
  if (context.isBuilderMode) {
    return (
      <RadioGroup
        ref={props.ref}
        data-collection={context.dataset?.collectionSlug}
        className={props.className}
        onClick={props.onClick}
        name={context.dataset?.connexion?.field}
        defaultValue={value as string | undefined}
        onValueChange={handleSelectOption}>
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
      name={context.dataset?.connexion?.field}
      defaultValue={value as string | undefined}
      onValueChange={handleSelectOption}>
      {options.map((opt: { label: string; value: string }, i: number) => (
        <div key={i} className='flex items-center space-x-2'>
          <RadioGroupItem
            value={opt.value}
            id={`${i}-${context.dataset?.connexion?.field}`}
          />
          <FormLabel
            className='mb-0'
            htmlFor={`${i}-${context.dataset?.connexion?.field}`}>
            {opt.label}
          </FormLabel>
        </div>
      ))}
    </RadioGroup>
  );
}

export default RadioComponent;
