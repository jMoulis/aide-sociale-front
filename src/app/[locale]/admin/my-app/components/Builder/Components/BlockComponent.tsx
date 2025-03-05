import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { cn } from '@/lib/utils/shadcnUtils';

const BlockComponent = ({
  props,
  context,
  children
}: PropsWithChildrenAndContext) => {
  const { className, ...rest } = props || {};
  const CustomTag = `${context.as || 'div'}` as any;
  return (
    <CustomTag className={cn('p-1', className)} {...rest}>
      {children}
    </CustomTag>
  );
};

export default BlockComponent;
