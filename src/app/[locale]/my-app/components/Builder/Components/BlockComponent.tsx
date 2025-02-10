import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { cn } from '@/lib/utils/shadcnUtils';
import ChildrenDndWrapper from './ChildrenDndWrapper';

const BlockComponent = ({
  props,
  context,
  children,
  dndChildrenContainerRef
}: PropsWithChildrenAndContext) => {
  const { className, ...rest } = props || {};
  const CustomTag = `${context.as || 'div'}` as any;

  return (
    <CustomTag className={cn('p-3', className)} {...rest}>
      <ChildrenDndWrapper ref={dndChildrenContainerRef}>
        {children}
      </ChildrenDndWrapper>
    </CustomTag>
  );
};

export default BlockComponent;
