import { addDays, startOfWeek } from 'date-fns';
import { START_OF_WEEK } from './weekHelpers';
import { useCalendarStore } from '../store/useCalendarStore';
import { CalendarEvent } from '@/components/Scheduler/interfaces';
import AllDay from './AllDay';
import { useMemo } from 'react';
import WeekHeader from './WeekHeader';
import TimedEventGrid from './TimedEventGrid';
import { MultiDayEventPosition } from '../interfaces';

type Props = {
  singleDayEvents: CalendarEvent[];
  allDayEvents: CalendarEvent[];
  allDayRegionHeight: number;
  hoursArray: number[];
  positionedAllDayEvents: MultiDayEventPosition[];
};
function MainWeekArea({
  singleDayEvents,
  allDayRegionHeight,
  hoursArray,
  positionedAllDayEvents
}: Props) {
  const { currentDate } = useCalendarStore();
  const days = useMemo(() => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: START_OF_WEEK });
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [currentDate]);

  return (
    <div className='flex-1 relative'>
      {/* (1) HEADERS for each day */}
      <WeekHeader days={days} />
      {/* (2) ALL-DAY EVENTS region (multi-day) */}
      <AllDay
        allDayRegionHeight={allDayRegionHeight}
        positionedAllDayEvents={positionedAllDayEvents}
      />
      {/* (3) TIMED EVENT GRID (24h timeline) */}
      <TimedEventGrid
        days={days}
        hoursArray={hoursArray}
        singleDayEvents={singleDayEvents}
      />
    </div>
  );
}
export default MainWeekArea;
