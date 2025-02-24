// MonthView.tsx
import React from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays
} from 'date-fns';
import { useCalendarStore } from '../store/useCalendarStore';
import { ResponsiveWeekRow } from './ResponsiveWeekRow';
import WeekHeader from './WeekHeader';
import { START_OF_WEEK } from '../WeekView/weekHelpers';

/** Helper to produce an array of weeks, each an array of 7 Date objects. */
function getMonthWeeks(date: Date): Date[][] {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart, {
    weekStartsOn: START_OF_WEEK
  });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: START_OF_WEEK });

  const weeks: Date[][] = [];

  let cursor = calendarStart;

  while (cursor <= calendarEnd) {
    const oneWeek: Date[] = [];
    for (let i = 0; i < 7; i++) {
      oneWeek.push(addDays(cursor, i));
    }
    weeks.push(oneWeek);
    cursor = addDays(cursor, 7);
  }
  return weeks;
}

interface MonthViewProps {
  currentDate: Date;
}

/** The main MonthView component. */
export const MonthView: React.FC<MonthViewProps> = ({ currentDate }) => {
  const { events, locale } = useCalendarStore();
  const weeks = getMonthWeeks(currentDate);

  return (
    <div>
      <div className='text-center font-bold text-xl mb-2'>
        {format(currentDate, 'MMMM yyyy', { locale })}
      </div>

      {/* Weekday headers */}
      <WeekHeader locale={locale} />

      {/* Render one row per week */}
      {weeks.map((weekDays, index) => (
        <ResponsiveWeekRow
          key={index}
          weekDays={weekDays}
          events={events}
          currentDate={currentDate}
        />
      ))}
    </div>
  );
};
