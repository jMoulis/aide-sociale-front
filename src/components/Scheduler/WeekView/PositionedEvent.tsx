import { differenceInMinutes } from 'date-fns';
import EventComponent from '../EventComponent';
import { HOUR_BLOCK_HEIGHT } from './weekHelpers';
import { useMemo } from 'react';
import { TimedPositionedEvent } from '../interfaces';

type Props = {
  event: TimedPositionedEvent;
  dayStart: Date;
  totalCols: number;
};
function PositionedEvent({ event, dayStart, totalCols }: Props) {
  const paramters = useMemo(() => {
    const startOffsetMin = differenceInMinutes(event.start, dayStart);
    const endOffsetMin = differenceInMinutes(event.end, dayStart);
    let eventHeight =
      ((endOffsetMin - startOffsetMin) / 60) * HOUR_BLOCK_HEIGHT;
    if (eventHeight < 15) eventHeight = 15;

    const colWidthPct = 100 / totalCols;
    const leftPct = event.columnIndex * colWidthPct;
    return {
      topPx: (startOffsetMin / 60) * HOUR_BLOCK_HEIGHT,
      leftPct,
      eventHeight,
      colWidthPct
    };
  }, [dayStart, event.columnIndex, event.end, event.start, totalCols]);

  return (
    <EventComponent
      event={event}
      className='absolute bg-blue-200 flex-col rounded p-1 m-1 text-sm overflow-hidden'
      style={{
        top: paramters.topPx,
        height: paramters.eventHeight,
        left: `${paramters.leftPct}%`,
        width: `calc(${paramters.colWidthPct}% - 8px)`
      }}>
      <div className='font-semibold text-xs'>{event.title}</div>
      <div className='text-xs'>
        {/* optionally show times */}
        {`${event.start.getHours()}:${String(event.start.getMinutes()).padStart(
          2,
          '0'
        )} - ${event.end.getHours()}:${String(event.end.getMinutes()).padStart(
          2,
          '0'
        )}`}
      </div>
    </EventComponent>
  );
}
export default PositionedEvent;
