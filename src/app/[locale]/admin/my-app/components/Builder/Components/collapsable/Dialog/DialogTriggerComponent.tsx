import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils/shadcnUtils';

const DialogTriggerComponent = ({
  props,
  children
}: PropsWithChildrenAndContext) => {
  const { className } = props || {};

  return (
    <DialogTrigger className={cn('p-1', className)}>
      <div>{children}</div>
    </DialogTrigger>
  );
};

export default DialogTriggerComponent;
