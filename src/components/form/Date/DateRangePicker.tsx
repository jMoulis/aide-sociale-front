'use client';

import { useRef, useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { CalendarMonth, DateRange, MonthCaption } from 'react-day-picker';
import { cn } from '@/lib/utils/shadcnUtils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import PickerNavigation, { PickerNavigationRef } from './PickerNavigation';
import { fr } from 'date-fns/locale';
import { useTranslations } from 'next-intl';

type Props = {
  onChange: (date?: DateRange) => void;
  date?: DateRange;
  className?: string;
  disabled?: boolean;
  required?: boolean;
};

export function DateRangePicker({
  className,
  onChange,
  date,
  disabled,
  required
}: Props) {
  const pickerNavigationRef = useRef<PickerNavigationRef>(null);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const t = useTranslations('GlobalSection');

  const handleShowYearMonthPicker = (
    props: {
      calendarMonth: CalendarMonth;
      displayIndex: number;
    } & React.HTMLAttributes<HTMLDivElement>
  ) => {
    const { calendarMonth, displayIndex } = props;
    setSelectedMonth(calendarMonth.date);
    pickerNavigationRef.current?.selectStep('year');
    setSelectedIndex(displayIndex);
  };

  const handleChange = (updatedDate: Date) => {
    let updatedDateRange = date;
    if (selectedIndex === 0) {
      updatedDateRange = {
        ...date,
        from: updatedDate
      };
    } else {
      updatedDateRange = {
        ...date,
        to: updatedDate
      } as DateRange;
    }
    onChange(updatedDateRange);
  };
  return (
    <div className={cn('grid gap-2', className)}>
      <Popover modal>
        <PopoverTrigger asChild>
          <Button
            id='date'
            variant={'outline'}
            disabled={disabled}
            className={cn(
              'w-fit justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}>
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'dd/MM/yyyy')} -{' '}
                  {format(date.to, 'dd/MM/yyyy')}
                </>
              ) : (
                format(date.from, 'dd/MM/yyyy')
              )
            ) : (
              <span>{t('actions.pickRangeDate')}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0 z-[9000]' align='start'>
          <Calendar
            mode='range'
            defaultMonth={date?.from}
            selected={date}
            disabled={disabled}
            required={required}
            onSelect={onChange}
            numberOfMonths={2}
            startMonth={new Date(1950, 1)}
            endMonth={new Date(2025, 11)}
            components={{
              MonthCaption: ({ ...props }) => {
                return (
                  <MonthCaption
                    {...props}
                    onClick={() => handleShowYearMonthPicker(props)}
                  />
                );
              }
            }}
          />
          <PickerNavigation
            ref={pickerNavigationRef}
            month={selectedMonth}
            locale={fr}
            onChange={handleChange}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
