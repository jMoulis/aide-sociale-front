import Input from '@/components/form/Input';
import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { useFormContext } from '../../FormContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FormLabel } from '@/components/ui/form';

function RadioComponent({ props, context }: PropsWithChildrenAndContext) {
  const { onInputChange, getFormFieldValue } = useFormContext();
  const value = getFormFieldValue(context.dataset);
  const options = [] as any;
  return (
    <>
      {/* <FormLabel required={props.required}>{field.label}</FormLabel> */}
      <RadioGroup
        name={props.name}
        //  defaultValue={value}
        onValueChange={(v) => {}}>
        {options.map((opt: { label: string; value: string }, i: number) => (
          <div key={i} className='flex items-center space-x-2'>
            <RadioGroupItem value={opt.value} id={`${i}-${props.name}`} />
            <FormLabel className='mb-0' htmlFor={`${i}-${props.name}`}>
              {opt.label}
            </FormLabel>
          </div>
        ))}
      </RadioGroup>
    </>
  );
}

export default RadioComponent;
