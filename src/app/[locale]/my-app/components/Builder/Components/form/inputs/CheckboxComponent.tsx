import Input from '@/components/form/Input';
import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { useFormContext } from '../../FormContext';
import { Checkbox } from '@/components/ui/checkbox';

function CheckboxComponent({ props, context }: PropsWithChildrenAndContext) {
  const { onInputChange, getFormFieldValue } = useFormContext();
  const value = getFormFieldValue(context.dataset);
  return <Checkbox {...props} />;
}

export default CheckboxComponent;
