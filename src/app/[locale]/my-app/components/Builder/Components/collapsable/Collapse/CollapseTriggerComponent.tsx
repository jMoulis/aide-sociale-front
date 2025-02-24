import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import ChildrenDndWrapper from '../../ChildrenDndWrapper';
import { cn } from '@/lib/utils/shadcnUtils';
import {
  CollapsibleTrigger
} from '@/components/ui/collapsible';

const CollapseTriggerComponent = ({
  props,
  children,
  dndChildrenContainerRef
}: PropsWithChildrenAndContext) => {
  const { className } = props || {};

  return (
    <CollapsibleTrigger className={cn('p-1', className)}>
      <ChildrenDndWrapper ref={dndChildrenContainerRef}>
        <div>{children}</div>
      </ChildrenDndWrapper>
    </CollapsibleTrigger>
  );
};

export default CollapseTriggerComponent;
