import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { useFormContext } from './FormContext';

function TextComponent({ props, context }: PropsWithChildrenAndContext) {
  const { getFormFieldValue } = useFormContext();
  const value = getFormFieldValue(context);
  const CustomTag = `${context.as || 'span'}`;
  return <CustomTag {...props}>{value || context.textContent}</CustomTag>;
}

export default TextComponent;
