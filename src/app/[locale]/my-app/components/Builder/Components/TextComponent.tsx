import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { useFormContext } from './FormContext';

function TextComponent({ props, context }: PropsWithChildrenAndContext) {
  const { getFormFieldValue } = useFormContext();
  const value = getFormFieldValue(context.dataset);
  const CustomTag = `${context.as || 'p'}`;
  return <CustomTag {...props}>{value || context.textContent}</CustomTag>;
}

export default TextComponent;
