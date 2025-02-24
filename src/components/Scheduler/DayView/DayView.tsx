import React, { useMemo } from 'react';
import {
  startOfDay,
  endOfDay,
  differenceInMinutes,
  isBefore,
  isAfter,
  format
} from 'date-fns';
import { useCalendarStore } from '../store/useCalendarStore';
import { assignDayEventColumns } from './dayUtils';
import EventComponent from '../EventComponent';
import { PositionedEvent } from '../interfaces';

interface DayViewProps {
  currentDate: Date;
}

/**
 * We’ll display a single column for 24 hours,
 * but place overlapping events side-by-side.
 */
export const DayView: React.FC<DayViewProps> = ({ currentDate }) => {
  const { events, locale } = useCalendarStore();

  // 24-hour layout from 0:00 to 23:59
  const HOURS_IN_DAY = 24;
  const HOUR_BLOCK_HEIGHT = 60; // each hour row ~60px
  const TOTAL_DAY_HEIGHT = HOURS_IN_DAY * HOUR_BLOCK_HEIGHT;

  const parsedEvents = useMemo(() => {
    const dayStart = startOfDay(currentDate);
    const dayEnd = endOfDay(currentDate);

    // Filter events that intersect this day
    // (any event that ends after dayStart and starts before dayEnd)
    const dayEvents = events.filter(
      (evt) => evt.end >= dayStart && evt.start <= dayEnd
    );

    // We'll clip events to the day boundary so they don't overflow

    // 1) Build partial events
    const partials: PositionedEvent[] = dayEvents.map((evt) => {
      const clippedStart = isBefore(evt.start, dayStart) ? dayStart : evt.start;
      const clippedEnd = isAfter(evt.end, dayEnd) ? dayEnd : evt.end;
      return {
        ...evt,
        start: clippedStart,
        end: clippedEnd,
        columnIndex: 0
      };
    });

    // 2) Assign columns to overlapping events
    const positionedEvents = assignDayEventColumns(partials);

    // 3) Compute how many columns we actually need
    const maxColIndex = positionedEvents.reduce(
      (max, e) => Math.max(max, e.columnIndex),
      0
    );
    const totalColumns = maxColIndex + 1;

    return {
      dayStart,
      dayEnd,
      totalColumns,
      positionedEvents
    };
  }, [currentDate, events]);

  return (
    <div className='flex w-full'>
      {/* Hour labels column on the left */}
      <div className='w-14 border-r'>
        {/* Spacer for day header if needed */}
        <div className='h-12'></div>
        {/* 24 hour rows */}
        {Array.from({ length: HOURS_IN_DAY }).map((_, hour) => (
          <div
            key={hour}
            className='h-16 border-t flex items-start justify-end pr-1 text-xs'
            style={{ height: HOUR_BLOCK_HEIGHT }}>
            {String(hour).padStart(2, '0')}:00
          </div>
        ))}
      </div>

      {/* Main day column, position events absolutely */}
      <div className='flex-1 relative'>
        {/* Day header */}
        <div className='h-12 flex items-center justify-center border-b font-semibold'>
          {format(currentDate, 'EEEE, d MMMM', { locale })}
        </div>

        {/* Background hour lines */}
        <div
          className='absolute left-0 right-0'
          style={{ top: 48, bottom: 0 /* matches .h-12 above */ }}>
          {Array.from({ length: HOURS_IN_DAY }).map((_, hour) => {
            const topY = hour * HOUR_BLOCK_HEIGHT;
            return (
              <div
                key={hour}
                className='w-full border-b border-gray-200 absolute'
                style={{ top: topY }}
              />
            );
          })}
        </div>

        {/* Events layer */}
        <div
          className='absolute left-0 right-0'
          style={{ top: 48, height: TOTAL_DAY_HEIGHT }}>
          {parsedEvents.positionedEvents.map((evt, index) => {
            const startOffsetMin = differenceInMinutes(
              evt.start,
              parsedEvents.dayStart
            );
            const endOffsetMin = differenceInMinutes(
              evt.end,
              parsedEvents.dayStart
            );
            const eventTop = (startOffsetMin / 60) * HOUR_BLOCK_HEIGHT;
            const eventHeight =
              ((endOffsetMin - startOffsetMin) / 60) * HOUR_BLOCK_HEIGHT;

            // Each column shares the day column’s width
            const colWidthPercent = 100 / parsedEvents.totalColumns;
            const leftPct =
              evt.columnIndex > 0
                ? evt.columnIndex * colWidthPercent - index * 2
                : 0;

            return (
              <EventComponent
                key={evt._id}
                event={evt}
                style={{
                  top: eventTop,
                  height: eventHeight,
                  left: `${leftPct}%`,
                  width: `calc(${colWidthPercent}% - 4px)`
                }}>
                <div className='font-semibold'>{evt.title}</div>
              </EventComponent>
            );
          })}
        </div>
      </div>
    </div>
  );
};
