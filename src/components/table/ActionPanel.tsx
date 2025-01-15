import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import Button from '../buttons/Button';
import { useTranslations } from 'next-intl';
import { cloneElement, JSX, useState } from 'react';

type Props<T> = {
  lool?: T;
  actions: JSX.Element[];
};

function ActionPanel<T>({ actions }: Props<T>) {
  const t = useTranslations('TableSection');
  const [open, setOpen] = useState(false);
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button className='h-8 w-8 p-0 flex justify-center'>
          <span className='sr-only'>Open menu</span>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' asChild>
        <div>
          <DropdownMenuLabel>{t('actions')}</DropdownMenuLabel>
          {actions.map((action, index) => (
            <DropdownMenuItem asChild key={index}>
              {cloneElement(action, {
                onSuccess: () => {
                  document.body.style.pointerEvents = 'unset';
                  setOpen(false);
                }
              })}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default ActionPanel;
