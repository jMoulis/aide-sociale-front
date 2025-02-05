import { useFormContext } from './FormContext';
import Input from '@/components/form/Input';
import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';

function InputComponent({ props, context }: PropsWithChildrenAndContext) {
  const { onInputChange, getFormFieldValue } = useFormContext();
  const value = getFormFieldValue(context.dataset);
  return (
    <Input
      {...props}
      {...context.input}
      data-collection={context.dataset?.collectionSlug}
      onChange={onInputChange}
      value={value}
      name={context.dataset?.connexion?.field}
    />
  );
}

export default InputComponent;
