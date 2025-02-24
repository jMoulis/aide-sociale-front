import { endOfDay, isAfter, isBefore, startOfDay } from 'date-fns';
import { assignSideBySideColumns, TOTAL_DAY_HEIGHT } from './weekHelpers';
import { CalendarEvent } from '@/components/Scheduler/interfaces';
import PositionedEvent from './PositionedEvent';
import { useMemo } from 'react';
import { TimedPositionedEvent } from '../interfaces';

type Props = {
  day: Date;
  singleDayEvents: CalendarEvent[];
};

function DayCell({ day, singleDayEvents }: Props) {
  const dayStart = startOfDay(day);

  const props = useMemo(() => {
    const dayEnd = endOfDay(day);
    // Single-day or partial events for this day
    // (We consider them 'timed' events, not multi-day)
    // Clip them if they cross midnight but are not truly multi-day
    const dayEvents = singleDayEvents.filter((evt) => {
      return !(isBefore(evt.end, dayStart) || isAfter(evt.start, dayEnd));
    });

    // 3.1) Build partial events for overlap logic

    const partials: Omit<TimedPositionedEvent, 'columnIndex'>[] = dayEvents.map(
      (evt) => {
        // clip if needed
        const clippedStart = isBefore(evt.start, dayStart)
          ? dayStart
          : evt.start;
        const clippedEnd = isAfter(evt.end, dayEnd) ? dayEnd : evt.end;
        return {
          ...evt,
          start: clippedStart,
          end: clippedEnd
        };
      }
    );

    // 3.2) Overlap logic => assign columns
    const positioned = assignSideBySideColumns(partials);

    // how many columns do we need?
    const maxColIndex = positioned.reduce(
      (acc, e) => Math.max(acc, e.columnIndex),
      0
    );
    const totalCols = maxColIndex + 1;
    return {
      totalCols,
      positioned
    };
  }, [day, dayStart, singleDayEvents]);

  return (
    <div className='relative border-r' style={{ height: TOTAL_DAY_HEIGHT }}>
      {/* Place events side by side */}
      {props.positioned.map((evt) => (
        <PositionedEvent
          key={evt._id}
          event={evt}
          dayStart={dayStart}
          totalCols={props.totalCols}
        />
      ))}
    </div>
  );
}
export default DayCell;
