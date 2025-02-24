import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import ChildrenDndWrapper from '../../ChildrenDndWrapper';

import { Collapsible } from '@/components/ui/collapsible';
const CollapseComponent = ({
  props,
  children,
  dndChildrenContainerRef
}: PropsWithChildrenAndContext) => {
  const { className, ...rest } = props || {};

  return (
    <Collapsible>
      <div className={className} onClick={rest.onClick}>
        <ChildrenDndWrapper ref={dndChildrenContainerRef}>
          {children}
        </ChildrenDndWrapper>
      </div>
    </Collapsible>
  );
};

export default CollapseComponent;
