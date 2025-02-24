import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { cn } from '@/lib/utils/shadcnUtils';
import ChildrenDndWrapper from '../ChildrenDndWrapper';
import { TabsList } from '@/components/ui/tabs';

const TabsListComponent = ({
  props,
  children,
  dndChildrenContainerRef
}: PropsWithChildrenAndContext) => {
  const { className, ...rest } = props || {};
  return (
    <TabsList className={cn('', className)} {...rest}>
      <ChildrenDndWrapper ref={dndChildrenContainerRef}>
        {children}
      </ChildrenDndWrapper>
    </TabsList>
  );
};

export default TabsListComponent;
