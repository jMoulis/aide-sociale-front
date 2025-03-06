import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { cn } from '@/lib/utils/shadcnUtils';
import { CollapsibleTrigger } from '@/components/ui/collapsible';

const CollapseTriggerComponent = ({
  props,
  children
}: PropsWithChildrenAndContext) => {
  const { className } = props || {};

  return (
    <CollapsibleTrigger className={cn('p-1', className)}>
      <div>{children}</div>
    </CollapsibleTrigger>
  );
};

export default CollapseTriggerComponent;
