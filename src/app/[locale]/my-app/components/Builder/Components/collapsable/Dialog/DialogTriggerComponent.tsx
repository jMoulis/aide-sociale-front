import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import ChildrenDndWrapper from '../../ChildrenDndWrapper';
import { DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils/shadcnUtils';

const DialogTriggerComponent = ({
  props,
  children,
  dndChildrenContainerRef
}: PropsWithChildrenAndContext) => {
  const { className } = props || {};

  return (
    <DialogTrigger className={cn('p-1', className)}>
      <ChildrenDndWrapper ref={dndChildrenContainerRef}>
        <div>{children}</div>
      </ChildrenDndWrapper>
    </DialogTrigger>
  );
};

export default DialogTriggerComponent;
