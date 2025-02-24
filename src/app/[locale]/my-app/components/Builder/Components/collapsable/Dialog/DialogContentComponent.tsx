import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import ChildrenDndWrapper from '../../ChildrenDndWrapper';
import {
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils/shadcnUtils';

const DialogContentComponent = ({
  props,
  children,
  dndChildrenContainerRef
}: PropsWithChildrenAndContext) => {
  const { ...rest } = props || {};

  return (
    <DialogContent
      className={cn('max-h-[90vh] max-w-[90vw] overflow-auto')}
      onClick={rest.onClick}>
      <DialogHeader>
        <DialogTitle>{props.name}</DialogTitle>
        <DialogDescription hidden>{props.name}</DialogDescription>
      </DialogHeader>
      <ChildrenDndWrapper ref={dndChildrenContainerRef}>
        {children}
      </ChildrenDndWrapper>
    </DialogContent>
  );
};

export default DialogContentComponent;
