'use client';

import { TimerIcon } from 'lucide-react';
import { cn } from '@/lib/utils/shadcnUtils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { useTranslations } from 'next-intl';
import TimeListSelectors from './TimeListSelectors';

type Props = {
  onChange: (time: string) => void;
  time?: string;
  required?: boolean;
  disabled?: boolean;
  flat?: boolean;
};
export function TimePicker({
  onChange,
  time,
  required,
  disabled,
  flat
}: Props) {
  const t = useTranslations('GlobalSection');

  return (
    <Popover modal>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          disabled={disabled}
          className={cn(
            'w-fit justify-start text-left font-normal',
            !time && 'text-muted-foreground'
          )}>
          <TimerIcon />
          {time ?? <span>{t('actions.pickADate')}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0 h-full flex flex-col' align='start'>
        <TimeListSelectors
          time={time}
          onChange={onChange}
          required={required}
          disabled={disabled}
          flat={flat}
        />
      </PopoverContent>
    </Popover>
  );
}
