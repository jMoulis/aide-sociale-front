import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { Collapsible } from '@/components/ui/collapsible';

const CollapseComponent = ({
  props,
  children
}: PropsWithChildrenAndContext) => {
  const { className, ...rest } = props || {};

  return (
    <Collapsible>
      <div className={className} onClick={rest.onClick}>
        {children}
      </div>
    </Collapsible>
  );
};

export default CollapseComponent;
