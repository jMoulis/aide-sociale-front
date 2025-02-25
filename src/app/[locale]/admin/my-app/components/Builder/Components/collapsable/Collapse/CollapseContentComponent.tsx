import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import ChildrenDndWrapper from '../../ChildrenDndWrapper';
import { CollapsibleContent } from '@/components/ui/collapsible';

const CollapseContentComponent = ({
  props,
  children,
  dndChildrenContainerRef
}: PropsWithChildrenAndContext) => {
  const { className, ...rest } = props || {};

  return (
    <CollapsibleContent>
      <div className={className} onClick={rest.onClick}>
        <ChildrenDndWrapper ref={dndChildrenContainerRef}>
          {children}
        </ChildrenDndWrapper>
      </div>
    </CollapsibleContent>
  );
};

export default CollapseContentComponent;
