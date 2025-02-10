import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { useFormContext } from '../FormContext';
import Selectbox from '@/components/form/Selectbox';

function SelectComponent({ props, context }: PropsWithChildrenAndContext) {
  const { onInputChange, getFormFieldValue } = useFormContext();
  const value = getFormFieldValue(context.dataset);
  return (
    <Selectbox
      {...props}
      onClick={props.onClick}
      disabled={props.disabled || context.isBuilderMode}
      options={[]}
      name={props.name}
      backdrop={context.isBuilderMode}
    />
  );
}

export default SelectComponent;
