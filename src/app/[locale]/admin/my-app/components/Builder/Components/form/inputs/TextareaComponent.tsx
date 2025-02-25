import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { useFormContext } from '../../FormContext';
import Textarea from '@/components/form/Textarea';

function TextareaComponent({ props, context }: PropsWithChildrenAndContext) {
  const { onInputChange, getFormFieldValue } = useFormContext();
  const value = getFormFieldValue(context);

  return (
    <Textarea
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

export default TextareaComponent;
