import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import Button from '@/components/buttons/Button';
import ChildrenDndWrapper from './ChildrenDndWrapper';

function ButtonComponent({
  props,
  children,
  dndChildrenContainerRef
}: PropsWithChildrenAndContext) {
  return (
    <Button {...props}>
      <ChildrenDndWrapper ref={dndChildrenContainerRef}>
        {children}
      </ChildrenDndWrapper>
    </Button>
  );
}

export default ButtonComponent;
