'use client';

import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils/shadcnUtils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { useTranslations } from 'next-intl';
import { format } from 'date-fns';
import PickerFullNavigation from './PickerFullNavigation';

type Props = {
  onChange: (date?: Date) => void;
  date?: Date;
  required?: boolean;
  disabled?: boolean;
};
export function DatePicker({ onChange, date, required, disabled }: Props) {
  const t = useTranslations('GlobalSection');

  return (
    <Popover modal>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          disabled={disabled}
          className={cn(
            'w-fit justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}>
          <CalendarIcon />
          {date ? (
            format(date, 'dd/MM/yyyy')
          ) : (
            <span>{t('actions.pickADate')}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start' asChild>
        <div>
          <PickerFullNavigation
            selectedDate={date || new Date()}
            required={required}
            disabled={disabled}
            onChange={onChange}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
