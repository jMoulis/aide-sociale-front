import { useMemo } from 'react';
import EventComponent from '../EventComponent';
import { SpanningEvent } from '../interfaces';

type Props = {
  visibleEvents: SpanningEvent[];
  topOffset: number;
  chipHeight: number;
  chipGap: number;
};
function VisibleEvents({
  visibleEvents,
  topOffset,
  chipGap,
  chipHeight
}: Props) {
  const colWidthPercent = useMemo(() => 100 / 7, []);

  return (
    <div
      id='weekrow-events'
      style={{
        position: 'absolute',
        top: topOffset,
        left: 0,
        right: 0,
        bottom: 0
        // We'll allow it to extend downward until bottom,
        // but hidden events won't show anyway.
      }}>
      {visibleEvents.map((evt: SpanningEvent) => {
        const totalDays = evt.endCol - evt.startCol + 1;
        const leftPct = evt.startCol * colWidthPercent;
        const widthPct = totalDays * colWidthPercent;
        const topPx = evt.rowIndex * (chipHeight + chipGap);

        return (
          <EventComponent
            key={evt._id}
            event={evt}
            style={{
              left: `${leftPct}%`,
              width: `calc(${widthPct}% - 2px)`,
              top: topPx,
              height: chipHeight
            }}>
            {evt.title}
          </EventComponent>
        );
      })}
    </div>
  );
}
export default VisibleEvents;
