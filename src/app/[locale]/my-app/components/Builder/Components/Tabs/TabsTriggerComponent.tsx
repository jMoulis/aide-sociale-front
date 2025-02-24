import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { TabsTrigger } from '@/components/ui/tabs';
import ChildrenDndWrapper from '../ChildrenDndWrapper';

const TabsTriggerComponent = ({
  props,
  children
}: PropsWithChildrenAndContext) => {
  const { ...rest } = props || {};
  return (
    <TabsTrigger value={rest.value} {...rest}>
      <ChildrenDndWrapper ref={rest.dndChildrenContainerRef}>
        {children}
      </ChildrenDndWrapper>
    </TabsTrigger>
  );
};

export default TabsTriggerComponent;
