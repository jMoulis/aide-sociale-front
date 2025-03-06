import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { CollapsibleContent } from '@/components/ui/collapsible';

const CollapseContentComponent = ({
  props,
  children
}: PropsWithChildrenAndContext) => {
  const { className, ...rest } = props || {};

  return (
    <CollapsibleContent>
      <div className={className} onClick={rest.onClick}>
        {children}
      </div>
    </CollapsibleContent>
  );
};

export default CollapseContentComponent;
