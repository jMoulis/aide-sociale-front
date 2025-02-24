import { startOfWeek, addDays, format } from 'date-fns';
import type { Locale } from 'date-fns';
import { useMemo } from 'react';

export const getDaysHeader = (
  date: Date = new Date(),
  locale?: Locale
): string[] => {
  const start = startOfWeek(date, { locale });
  return Array.from({ length: 7 }, (_, index) => {
    // 'EEEEEE' gives a narrow format (e.g., "M", "T") – change to 'EEE' or 'EEEE' if needed.
    return format(addDays(start, index), 'EEE', { locale });
  });
};

type Props = {
  locale?: Locale;
};
function WeekHeader({ locale }: Props) {
  const headers = useMemo(() => getDaysHeader(new Date(), locale), [locale]);
  return (
    <div
      id='weekday-headers'
      className='flex text-center font-semibold border-b'>
      {headers.map((dayName) => (
        <div key={dayName} className='flex-1 p-1'>
          {dayName}
        </div>
      ))}
    </div>
  );
}
export default WeekHeader;
