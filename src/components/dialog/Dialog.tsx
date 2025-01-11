import {
  Dialog as DialogComponent,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { JSX } from 'react';

type Props = {
  title?: string;
  triggerText?: string;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  Trigger?: JSX.Element;
  contentClassname?: string;
  contentStyle?: React.CSSProperties;
};
function Dialog({
  onOpenChange,
  title,
  open,
  children,
  triggerText,
  Trigger,
  contentClassname,
  contentStyle
}: Props) {
  return (
    <DialogComponent open={open} onOpenChange={onOpenChange} modal>
      <DialogTrigger asChild={Boolean(Trigger)}>
        {Trigger ? Trigger : triggerText ?? 'Open Dialog'}
      </DialogTrigger>
      <DialogContent className={`${contentClassname}`} style={contentStyle}>
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
