import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { useFormContext } from '../FormContext';
import { cn } from '@/lib/utils/shadcnUtils';

const ImagePlaceholder = (props: any) => (
  <div
    onClick={props.onClick}
    className={cn(
      'w-full h-64 bg-gray-300 flex items-center justify-center',
      props.className
    )}>
    <p className='text-gray-500'>Image</p>
  </div>
);
function ImageComponent({ props, context }: PropsWithChildrenAndContext) {
  const { _dndChildrenContainerRef, ...rest } = props;

  const { getFormFieldValue } = useFormContext();
  const value = getFormFieldValue(context);
  if (!value && !rest.src) return <ImagePlaceholder {...props} />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...rest}
      className={cn('', props.className)}
      src={value || props.src}
      alt={props.alt || 'image'}
    />
  );
}

export default ImageComponent;
