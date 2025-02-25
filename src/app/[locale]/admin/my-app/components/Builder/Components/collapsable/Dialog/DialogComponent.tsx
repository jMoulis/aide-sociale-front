import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { Dialog } from '@/components/ui/dialog';
import { cn } from '@/lib/utils/shadcnUtils';
import {} from '@radix-ui/react-dialog';

const DialogComponent = ({ props, children }: PropsWithChildrenAndContext) => {
  const { ...rest } = props || {};
  return (
    <Dialog>
      <div className={cn('max-h-[90vh] max-w-[90vw]')} onClick={rest.onClick}>
        {children}
      </div>
    </Dialog>
  );
};

export default DialogComponent;
