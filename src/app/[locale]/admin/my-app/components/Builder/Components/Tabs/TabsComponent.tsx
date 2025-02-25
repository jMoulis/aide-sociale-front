import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { cn } from '@/lib/utils/shadcnUtils';
import ChildrenDndWrapper from '../ChildrenDndWrapper';
import { Tabs } from '@/components/ui/tabs';

const TabsComponent = ({
  props,
  children,
  dndChildrenContainerRef
}: PropsWithChildrenAndContext) => {
  const { className, value, ...rest } = props || {};
  return (
    <Tabs className={cn('', className)} {...rest} defaultValue={value}>
      <ChildrenDndWrapper ref={dndChildrenContainerRef}>
        {children}
      </ChildrenDndWrapper>
    </Tabs>
  );
};

export default TabsComponent;
