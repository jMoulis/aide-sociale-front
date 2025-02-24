import React, { useMemo } from 'react';
import { startOfWeek } from 'date-fns';
// If you store them in a separate file, adjust imports accordingly
import { useCalendarStore } from '../store/useCalendarStore';
import {
  ALL_DAY_ROW_HEIGHT,
  assignMultiDayRows,
  getEventDaySpan,
  HOURS_IN_DAY,
  isMultiDayEvent,
  START_OF_WEEK
} from './weekHelpers';
import HoursColumn from './HoursColumn';
import MainWeekArea from './MainWeekArea';
import { MultiDayEventPosition } from '../interfaces';

interface WeekViewProps {
  currentDate: Date;
}

export const WeekView: React.FC<WeekViewProps> = ({ currentDate }) => {
  const { events } = useCalendarStore();
  const parsedEvents = useMemo(() => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: START_OF_WEEK });
    // Separate multi-day (all-day) from single-day or partial-day
    const multiDayEvents = events.filter((evt) =>
      isMultiDayEvent(evt.start, evt.end)
    );
    const singleDayEvents = events.filter(
      (evt) => !isMultiDayEvent(evt.start, evt.end)
    );
    const mappedAllDayEvents: MultiDayEventPosition[] = multiDayEvents.map(
      (evt) => {
        const { startDayIndex, endDayIndex } = getEventDaySpan(
          evt.start,
          evt.end,
          weekStart
        );
        return {
          ...evt,
          startDayIndex,
          endDayIndex,
          rowIndex: -1 // assigned next
        };
      }
    );
    const positionedAllDayEvents = assignMultiDayRows(mappedAllDayEvents);
    const maxAllDayRow = positionedAllDayEvents.reduce(
      (max, e) => Math.max(max, e.rowIndex),
      0
    );
    return {
      allDayRegionHeight: (maxAllDayRow + 1) * ALL_DAY_ROW_HEIGHT,
      positionedAllDayEvents,
      singleDayEvents,
      allDayEvents: multiDayEvents
    };
  }, [events, currentDate]);

  const hoursArray = useMemo(
    () => Array.from({ length: HOURS_IN_DAY }, (_, i) => i),
    []
  );

  return (
    <div className='flex w-full'>
      <HoursColumn
        hoursArray={hoursArray}
        allDayRegionHeight={parsedEvents.allDayRegionHeight}
      />
      <MainWeekArea {...parsedEvents} hoursArray={hoursArray} />
    </div>
  );
};
