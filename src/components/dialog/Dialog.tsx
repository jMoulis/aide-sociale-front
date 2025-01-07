import {
  Dialog as DialogComponent,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils/shadcnUtils';
import { JSX } from 'react';

type Props = {
  title?: string;
  triggerText?: string;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  Trigger?: JSX.Element;
  contentClassname?: string;
};
function Dialog({
  onOpenChange,
  title,
  open,
  children,
  triggerText,
  Trigger,
  contentClassname
}: Props) {
  return (
    <DialogComponent open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild={Boolean(Trigger)}>
        {Trigger ? Trigger : triggerText ?? 'Open Dialog'}
      </DialogTrigger>
      <DialogContent className={cn(`w-fit`, contentClassname)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className='hidden'>{title}</DialogDescription>
          {children}
        </DialogHeader>
      </DialogContent>
    </DialogComponent>
  );
}

export default Dialog;
