import Input from '@/components/form/Input';
import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { useFormContext } from '../../FormContext';

function InputComponent({ props, context }: PropsWithChildrenAndContext) {
  const { onInputChange, getFormFieldValue } = useFormContext();
  const value = getFormFieldValue(context);

  return (
    <Input
      {...props}
      {...context.input}
      data-collection={context.dataset?.collectionSlug}
      data-listindex={context.listIndex}
      onChange={onInputChange}
      value={value}
      name={context.dataset?.connexion?.field}
    />
  );
}

export default InputComponent;
