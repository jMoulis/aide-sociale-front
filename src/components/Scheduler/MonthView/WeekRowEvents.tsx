import {
  differenceInCalendarDays,
  endOfDay,
  isAfter,
  isBefore,
  startOfDay
} from 'date-fns';
import { CalendarEvent, SpanningEvent } from '../interfaces';
import { assignRowIndexes } from './monthHelpers';
import { useMemo } from 'react';
import VisibleEvents from './VisibleEvents';
import DisplayMore from './DisplayMore';

interface WeekRowEventsProps {
  weekDays: Date[];
  events: CalendarEvent[];
  topOffset: number;
  bottomReserve: number;
  chipHeight: number;
  chipGap: number;
  maxVisibleRows: number;
}

export function WeekRowEvents({
  weekDays,
  events,
  topOffset,
  chipHeight,
  chipGap,
  maxVisibleRows
}: WeekRowEventsProps) {
  // Clip events to [weekStart, weekEnd] so they don't draw beyond
  const weekStart = useMemo(() => startOfDay(weekDays[0]), [weekDays]);
  const weekEnd = useMemo(() => endOfDay(weekDays[6]), [weekDays]);

  const parsedEvents = useMemo(() => {
    const rowEvents = events.filter(
      (evt) => evt.end >= weekStart && evt.start <= weekEnd
    );

    const spanning: SpanningEvent[] = rowEvents.map((evt) => {
      const clippedStart = isBefore(evt.start, weekStart)
        ? weekStart
        : evt.start;
      const clippedEnd = isAfter(evt.end, weekEnd) ? weekEnd : evt.end;

      const startCol = differenceInCalendarDays(
        startOfDay(clippedStart),
        weekStart
      );
      const endCol = differenceInCalendarDays(
        startOfDay(clippedEnd),
        weekStart
      );

      return {
        ...evt,
        startCol,
        endCol,
        rowIndex: -1
      };
    });

    const positionedEvents = assignRowIndexes(spanning);

    // We'll track how many are hidden in each day col
    const hiddenCountsPerDay = Array(7).fill(0);
    const visibleEvents: SpanningEvent[] = [];
    const hiddenEvents: SpanningEvent[] = [];

    // Decide visible vs hidden
    positionedEvents.forEach((evt) => {
      if (evt.rowIndex < maxVisibleRows) {
        visibleEvents.push(evt);
      } else {
        hiddenEvents.push(evt);
        for (let col = evt.startCol; col <= evt.endCol; col++) {
          if (col >= 0 && col < 7) {
            hiddenCountsPerDay[col]++;
          }
        }
      }
    });
    return {
      visibleEvents,
      hiddenEvents,
      hiddenCountsPerDay
    };
  }, [maxVisibleRows, events, weekEnd, weekStart]);
  // Overlap logic => rowIndex

  return (
    <>
      {/* Container for the event chips; pinned below topOffset. */}
      <VisibleEvents
        visibleEvents={parsedEvents.visibleEvents}
        topOffset={topOffset}
        chipHeight={chipHeight}
        chipGap={chipGap}
      />

      {/* Container pinned to the bottom for "+X more" badges */}
      <DisplayMore
        hiddenCountsPerDay={parsedEvents.hiddenCountsPerDay}
        weekStart={weekStart}
      />
    </>
  );
}
