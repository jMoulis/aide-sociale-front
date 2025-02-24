import { cn } from '@/lib/utils/shadcnUtils';
import { useCalendarStore } from './store/useCalendarStore';
import {
  CalendarEvent,
  MultiDayEventPosition,
  PositionedEvent,
  SpanningEvent
} from '@/components/Scheduler/interfaces';
import { getEventColors } from './utils';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  event:
    | CalendarEvent
    | SpanningEvent
    | PositionedEvent
    | MultiDayEventPosition;
}

function EventComponent({ event, children, style, className }: Props) {
  const { setSelectedEvent } = useCalendarStore();

  return (
    <button
      key={event._id}
      className={cn(
        'absolute flex items-start pl-1 text-xs rounded overflow-hidden',
        className
      )}
      onClick={() => {
        setSelectedEvent(event);
      }}
      style={{
        ...style,
        boxSizing: 'border-box',
        ...getEventColors({ end: event.end, color: event.color })
      }}
      title={event.title}>
      {children}
    </button>
  );
}
export default EventComponent;
