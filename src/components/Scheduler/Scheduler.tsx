// Calendar.tsx
import React, { useEffect, useImperativeHandle } from 'react';
import { MonthView } from './MonthView/MonthView';
import { WeekView } from './WeekView/WeekView';
import { DayView } from './DayView/DayView';
import { EventForm } from './EventForm/EventForm';
import { CalendarView, useCalendarStore } from './store/useCalendarStore';
import { TimelineView } from './TimelineView/TimelineView';
import { Resource } from './TimelineView/interfaces';
import Navigation from './Navigation';
import { CalendarEvent } from './interfaces';

const resources: Resource[] = [
  { id: 'r1', name: 'Alice' },
  { id: 'r2', name: 'Bob' },
  { id: 'r3', name: 'Room A' }
];

// const events: CalendarEvent[] = [
//   // some sample events
//   {
//     id: 'evt1',
//     summary: 'Meeting',
//     resourceId: 'r1',
//     start: new Date(2025, 1, 19, 9, 0),
//     end: new Date(2025, 1, 21, 10, 30)
//   },
//   {
//     id: 'evt2',
//     summary: 'Server Maint',
//     resourceId: 'r2',
//     start: new Date(2025, 1, 19, 9, 30),
//     end: new Date(2025, 1, 19, 11, 0)
//   },
//   {
//     id: 'evt3',
//     summary: 'Project Work',
//     resourceId: 'r1',
//     start: new Date(2025, 1, 19, 12, 0),
//     end: new Date(2025, 1, 21, 14, 0) // crosses multiple days
//   }
// ];

type Props = {
  customForm?: React.ReactNode | null;
  events?: CalendarEvent[];
  onSelectEvent?: (event: CalendarEvent) => void;
  onUpsertEvent?: (eventId: string, updates: CalendarEvent) => Promise<void>;
  onRemoveEvent?: (eventId: string) => Promise<void>;
  onAddEvent?: (event: CalendarEvent) => void;
  onNext?: (date: Date) => void;
  onPrev?: (date: Date) => void;
  ref?: any;
};
export const Scheduler: React.FC<Props> = ({
  events,
  onSelectEvent,
  onUpsertEvent,
  onRemoveEvent,
  onNext,
  onPrev,
  onAddEvent,
  customForm,
  ref
}) => {
  const { view, currentDate, setEvents, setEventCallbacks, upsertEvent } =
    useCalendarStore();

  useImperativeHandle(
    ref,
    () => ({
      upsertEvent: (eventId: string, event: CalendarEvent) => {
        upsertEvent(eventId, event);
      }
    }),
    [upsertEvent]
  );

  useEffect(() => {
    setEventCallbacks({
      onSelectEvent,
      onUpsertEvent,
      onRemoveEvent,
      onAddEvent,
      onNext,
      onPrev
    });
  }, [
    onSelectEvent,
    onUpsertEvent,
    onRemoveEvent,
    setEventCallbacks,
    onAddEvent,
    onNext,
    onPrev
  ]);

  useEffect(() => {
    setEvents(events || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events]);

  return (
    <div className='p-4'>
      <EventForm customForm={customForm} />
      <Navigation />
      {view === CalendarView.MONTH && <MonthView currentDate={currentDate} />}
      {view === CalendarView.WEEK && <WeekView currentDate={currentDate} />}
      {view === CalendarView.DAY && <DayView currentDate={currentDate} />}
      {view === CalendarView.TIMELINE && (
        <TimelineView currentDate={currentDate} resources={resources} />
      )}
    </div>
  );
};
