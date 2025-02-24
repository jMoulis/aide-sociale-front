// store/calendarStore.ts
import { create } from "zustand"
import { addDays, addMonths, addWeeks, addYears, Locale, subDays, subMonths, subWeeks, subYears } from "date-fns";
import { fr } from "date-fns/locale";
import { TimelineViewScale } from "../TimelineView/interfaces";
import { CalendarEvent, PositionedEvent, SpanningEvent } from '@/components/Scheduler/interfaces';

export enum CalendarView {
  MONTH = 'MONTH',
  WEEK = 'WEEK',
  DAY = 'DAY',
  TIMELINE = 'TIMELINE'
}



interface CalendarStore {
  events: CalendarEvent[]
  selectedEvent: CalendarEvent | SpanningEvent | PositionedEvent | null;
  currentDate: Date;
  view: CalendarView;
  locale?: Locale;
  detailOpen: boolean;
  viewScale: TimelineViewScale;
  eventsCallbacks: {
    onSelectEvent?: (event: CalendarEvent) => void;
    onRemoveEvent?: (eventId: string) => Promise<void>;
    onUpsertEvent?: (eventId: string, updates: CalendarEvent) => Promise<void>;
    onAddEvent?: (event: CalendarEvent) => void;
    onNext?: (date: Date) => void;
    onPrev?: (date: Date) => void;
  }
  setEventCallbacks: (callbacks: {
    onSelectEvent?: (event: CalendarEvent) => void;
    onUpsertEvent?: (eventId: string, updates: CalendarEvent) => Promise<void>;
    onRemoveEvent?: (eventId: string) => Promise<void>;
    onAddEvent?: (event: CalendarEvent) => void;
    onNext?: (date: Date) => void;
    onPrev?: (date: Date) => void;
  }) => void;
  setOpenDetail: () => void;
  setEvents: (event: CalendarEvent[]) => void
  addEvent: (event: CalendarEvent) => void
  removeEvent: (eventId: string) => void
  upsertEvent: (eventId: string, updates: CalendarEvent) => void
  setSelectedEvent: (event: CalendarEvent | null) => void;
  setCurrentDate: (date: Date) => void;
  setView: (view: CalendarView) => void;
  onNext: () => void;
  onPrev: () => void;
  onNavigateToDay: (date: Date) => void;
  switchLocale: (locale: Locale) => void;
  setViewScale: (viewScale: TimelineViewScale) => void;
}

export const useCalendarStore = create<CalendarStore>((set, get) => ({
  locale: fr,
  events: [],
  eventsCallbacks: {},
  currentDate: new Date(),
  selectedEvent: null,
  view: CalendarView.MONTH,
  viewScale: TimelineViewScale.MONTH,
  detailOpen: false,
  setEventCallbacks: (callbacks) => {
    set({ eventsCallbacks: callbacks });
  },
  setOpenDetail: () => set({ detailOpen: !get().detailOpen }),
  setEvents: (events) => set({ events }),
  switchLocale: (locale) => set({ locale }),
  setSelectedEvent: (event) => {
    if (get().eventsCallbacks.onSelectEvent && event) {
      get()?.eventsCallbacks?.onSelectEvent?.(event);
    }
    set({ selectedEvent: event })
  },
  setViewScale(viewScale) {
    set({ viewScale })
  },
  addEvent: (event) => {
    get().eventsCallbacks.onAddEvent?.(event);
    set((state) => ({ events: [...state.events, event] }))
  },
  removeEvent: (eventId) =>
    set((state) => ({
      events: state.events.filter((evt) => evt._id !== eventId)
    })),
  upsertEvent: (eventId, updates) => {
    const prevEvent = get().events.find((evt) => evt._id === eventId);

    if (!prevEvent) {
      set((state) => ({
        events: [...state.events, { ...updates, _id: eventId }]
      }));
      return;
    };
    set((state) => ({
      events: state.events.map((evt) =>
        evt._id === eventId ? { ...evt, ...updates } : evt
      )
    }))
  },
  setCurrentDate: (date) => set({ currentDate: date }),
  setView: (view) => set({ view }),
  onNext: () => {
    const view = get().view;
    const currentDate = get().currentDate;
    let updatedDate = currentDate;
    if (view === CalendarView.MONTH) updatedDate = addMonths(currentDate, 1);
    if (view === CalendarView.WEEK) updatedDate = addWeeks(currentDate, 1);
    if (view === CalendarView.DAY) updatedDate = addDays(currentDate, 1);
    if (view === CalendarView.TIMELINE) {
      if (get().viewScale === TimelineViewScale.YEAR) {
        updatedDate = addYears(currentDate, 1);
        // set({ currentDate: addYears(currentDate, 1) });
      }
      if (get().viewScale === TimelineViewScale.MONTH) {
        updatedDate = addMonths(currentDate, 1);
      }
      if (get().viewScale === TimelineViewScale.WEEK) {
        updatedDate = addWeeks(currentDate, 1);
      }
      if (get().viewScale === TimelineViewScale.DAY) {
        updatedDate = addDays(currentDate, 1);
      }
    };
    set({ currentDate: updatedDate });
    get().eventsCallbacks.onNext?.(updatedDate);
  },
  onPrev: () => {
    const view = get().view;
    const currentDate = get().currentDate;
    let updatedDate = currentDate;
    if (view === CalendarView.MONTH) updatedDate = subMonths(currentDate, 1);
    if (view === CalendarView.WEEK) updatedDate = subWeeks(currentDate, 1);
    if (view === CalendarView.DAY) updatedDate = subDays(currentDate, 1);
    if (view === CalendarView.TIMELINE) {
      if (get().viewScale === TimelineViewScale.YEAR) {
        updatedDate = subYears(currentDate, 1);
      }
      if (get().viewScale === TimelineViewScale.MONTH) {
        updatedDate = subMonths(currentDate, 1);
      }
      if (get().viewScale === TimelineViewScale.WEEK) {
        updatedDate = subWeeks(currentDate, 1);
      }
      if (get().viewScale === TimelineViewScale.DAY) {
        updatedDate = subDays(currentDate, 1);
      }
    }
    set({ currentDate: updatedDate });
    get().eventsCallbacks.onPrev?.(updatedDate);
  },
  onNavigateToDay: (date) => {
    set({ currentDate: date });
    // set({ currentDate: date, view: CalendarView.DAY });
  }
}))
