'use client';

import { useState, useEffect, useRef } from 'react';
import { format, setHours, setMinutes } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils/shadcnUtils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { useTranslations } from 'next-intl';
import { fr } from 'date-fns/locale';
import TimeListSelectors from './TimePicker/TimeListSelectors';
import PickerNavigation, { PickerNavigationRef } from './PickerNavigation';
import { MonthCaption } from 'react-day-picker';

type Props = {
  onChange: (date?: Date) => void;
  date?: Date;
  required?: boolean;
  disabled?: boolean;
};
export function DateTimePicker({ onChange, date, required, disabled }: Props) {
  const [timeValue, setTimeValue] = useState<string>('00:00');
  const t = useTranslations('GlobalSection');
  const [month, setMonth] = useState(new Date());

  const pickerNavigationRef = useRef<PickerNavigationRef>(null);

  useEffect(() => {
    if (date) {
      setTimeValue(format(date, 'HH:mm'));
    }
  }, [date]);

  const handleTimeChange = (time: string) => {
    if (!date) {
      setTimeValue(time);
      return;
    }
    const [hours, minutes] = time.split(':').map((str) => parseInt(str, 10));
    const newSelectedDate = setHours(setMinutes(date, minutes), hours);
    onChange(newSelectedDate);
    setTimeValue(time);
  };

  const handleShowYearMonthPicker = () => {
    pickerNavigationRef.current?.selectStep('year');
  };

  const handleDateChange = (newDate?: Date) => {
    if (!newDate) {
      onChange(undefined);
      return;
    }
    const [hours, minutes] = timeValue
      .split(':')
      .map((str) => parseInt(str, 10));
    const newSelectedDate = setHours(setMinutes(newDate, minutes), hours);
    setMonth(newSelectedDate);
    onChange(newSelectedDate);
  };

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
            format(date, 'dd/MM/yyyy HH:mm')
          ) : (
            <span>{t('actions.pickADate')}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='w-auto p-0 h-[330px] flex flex-col'
        align='start'>
        <div className='flex max-h-[300px] relative'>
          <Calendar
            required={required}
            locale={fr}
            month={month}
            onMonthChange={setMonth}
            mode='single'
            selected={date}
            onSelect={handleDateChange}
            disabled={disabled}
            components={{
              MonthCaption: ({ ...props }) => {
                return (
                  <MonthCaption
                    {...props}
                    onClick={handleShowYearMonthPicker}
                  />
                );
              }
            }}
          />
          <PickerNavigation
            ref={pickerNavigationRef}
            month={month}
            locale={fr}
            onChange={handleDateChange}
          />
          <TimeListSelectors
            required={required}
            disabled={disabled}
            onChange={handleTimeChange}
            time={timeValue}
            flat
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
