import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { cn } from '@/lib/utils/shadcnUtils';
import ChildrenDndWrapper from '../ChildrenDndWrapper';
import { TabsContent } from '@/components/ui/tabs';

const TabsContentComponent = ({
  props,
  children,
  dndChildrenContainerRef
}: PropsWithChildrenAndContext) => {
  const { className, ...rest } = props || {};
  return (
    <TabsContent className={cn('', className)} {...rest}>
      <ChildrenDndWrapper ref={dndChildrenContainerRef}>
        {children}
      </ChildrenDndWrapper>
    </TabsContent>
  );
};

export default TabsContentComponent;
