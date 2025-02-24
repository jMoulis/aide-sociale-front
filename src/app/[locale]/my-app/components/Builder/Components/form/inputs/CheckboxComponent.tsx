import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { useFormContext } from '../../FormContext';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckedState } from '@radix-ui/react-checkbox';

function CheckboxComponent({ props, context }: PropsWithChildrenAndContext) {
  const { onInputChange, getFormFieldValue } = useFormContext();
  const value = getFormFieldValue(context);

  const handleInputChange = (state: CheckedState) => {
    onInputChange({
      target: {
        name: context.dataset?.connexion?.field,
        value: state,
        dataset: {
          collection: context.dataset?.collectionSlug,
          listindex: context.listIndex
        } as any
      }
    } as React.ChangeEvent<HTMLInputElement>);
  };
  return (
    <Checkbox {...props} checked={value} onCheckedChange={handleInputChange} />
  );
}

export default CheckboxComponent;
