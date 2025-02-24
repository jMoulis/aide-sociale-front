import { useEffect, useRef, useState } from 'react';
import { CalendarEvent } from '../interfaces';
import { format, isSameMonth, isToday } from 'date-fns';
import { WeekRowEvents } from './WeekRowEvents';

// A row representing one week in the month view
interface ResponsiveWeekRowProps {
  weekDays: Date[];
  events: CalendarEvent[];
  currentDate: Date;
}

export function ResponsiveWeekRow({
  weekDays,
  events,
  currentDate
}: ResponsiveWeekRowProps) {
  // We'll measure the row's actual height in pixels
  const rowRef = useRef<HTMLDivElement>(null);
  const [rowHeight, setRowHeight] = useState<number>(100); // a default guess

  // We'll respond to window resize or mount to measure
  useEffect(() => {
    function measure() {
      if (rowRef.current) {
        const rect = rowRef.current.getBoundingClientRect();
        setRowHeight(rect.height);
      }
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Constants for layout
  const TOP_OFFSET = 35; // px below day label
  const CHIP_HEIGHT = 18;
  const CHIP_GAP = 2;
  const BOTTOM_RESERVE = 20; // px for "+X more"
  const HEIGHT_ROW = 150; // px for the day label row
  // Calculate how many stacked rows can fit
  // We subtract top offset & bottom area from total
  const usableHeight = rowHeight - TOP_OFFSET - BOTTOM_RESERVE;
  let maxVisibleRows = Math.floor(usableHeight / (CHIP_HEIGHT + CHIP_GAP));
  if (maxVisibleRows < 0) maxVisibleRows = 0; // in case rowHeight is too small

  return (
    <div
      ref={rowRef}
      className='border-b relative'
      id='week-row'
      style={{
        // You could set a minHeight to ensure a baseline
        minHeight: HEIGHT_ROW,
        position: 'relative'
      }}>
      {/* The 7 day cells for date labels */}
      <div
        className='flex'
        style={{
          minHeight: HEIGHT_ROW
        }}>
        {weekDays.map((dayDate, i) => {
          const isInMonth = isSameMonth(dayDate, currentDate);
          return (
            <div
              key={i}
              className={`flex-1 px-1 flex justify-center pt-2 ${
                isInMonth ? 'bg-white' : 'bg-gray-100 text-gray-400'
              } border-r flex items-start`}
              style={{ position: 'relative' }}>
              <span
                className={`text-xs h-6 w-6 font-semibold flex items-center justify-center rounded-full ${
                  isToday(dayDate) ? 'bg-blue-600 text-white' : ''
                } `}>
                {format(dayDate, 'd')}
              </span>
            </div>
          );
        })}
      </div>

      {/* The overlaid events & "+X more" */}
      <WeekRowEvents
        weekDays={weekDays}
        events={events}
        topOffset={TOP_OFFSET}
        bottomReserve={BOTTOM_RESERVE}
        chipHeight={CHIP_HEIGHT}
        chipGap={CHIP_GAP}
        maxVisibleRows={maxVisibleRows}
      />
    </div>
  );
}
