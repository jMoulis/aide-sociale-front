import { useMemo } from 'react';
import { CalendarEvent } from '@/components/Scheduler/interfaces';
import { Resource } from './interfaces';
import { assignOverlapColumns, ColumnInfo } from './timelineUtils';
import EventComponent from '../EventComponent';

interface RowEventSpannerProps {
  rowNum: number;
  columns: ColumnInfo[];
  resource: Resource;
  events: CalendarEvent[];
}

/**
 * This <div> covers row={rowNum}, col=2..(columns.length+1),
 * position: relative => we place spanning bars absolutely inside it.
 */
export const RowEventSpanner: React.FC<RowEventSpannerProps> = ({
  rowNum,
  columns,
  resource,
  events
}) => {
  const memoizedParams = useMemo(() => {
    const resourceEvents = events.filter((e) => e.resourceId === resource.id);
    // Build partial events => find startCol/endCol
    const partials = resourceEvents
      .map((evt) => {
        let startCol = -1;
        let endCol = -1;
        for (let i = 0; i < columns.length; i++) {
          // event intersects col i if evt.end > columns[i].start && evt.start < columns[i].end
          if (evt.end > columns[i].start && evt.start < columns[i].end) {
            if (startCol === -1) startCol = i;
            endCol = i;
          }
        }
        return {
          ...evt,
          startCol,
          endCol
        };
      })
      .filter((p) => p.startCol !== -1);

    // Overlap logic => side-by-side if partials share columns
    const positioned = assignOverlapColumns(partials);
    // The max columnIndex => we know how many vertical slots we need
    const maxIndex = positioned.reduce((m, e) => Math.max(m, e.columnIndex), 0);
    const totalOverlapCols = maxIndex + 1;
    return { positioned, totalOverlapCols };
  }, [columns, events, resource.id]);
  // Filter events for this resource

  // This container spans row=rowNum, col=2..(columns.length+1)
  return (
    <div
      className='relative'
      style={{
        gridRow: rowNum,
        gridColumn: `2 / ${columns.length + 2}`, // from col=2 to the end
        minHeight: 60
      }}>
      {/* Absolutely place each event bar */}
      {memoizedParams.positioned.map((evt) => {
        const colSpan = evt.endCol - evt.startCol + 1;
        const leftPct = (evt.startCol / columns.length) * 100;
        const widthPct = (colSpan / columns.length) * 100;
        // side-by-side overlap => vertical offset
        const overlapSlot = 100 / memoizedParams.totalOverlapCols;
        const topPct = evt.columnIndex * overlapSlot;

        return (
          <EventComponent
            event={evt}
            key={evt._id}
            className='absolute text-xs rounded p-1 overflow-hidden shadow'
            style={{
              top: `${topPct}%`,
              left: `${leftPct}%`,
              width: `calc(${widthPct}% - 4px)`,
              height: `calc(${overlapSlot}% - 4px)`
            }}
            title={evt.title}>
            {evt.title}
          </EventComponent>
        );
      })}
    </div>
  );
};
