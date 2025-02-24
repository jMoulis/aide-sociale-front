import React from 'react';
import { startOfDay, endOfDay, isBefore, isAfter } from 'date-fns';
import { Resource } from './interfaces';
import { CalendarEvent } from '@/components/Scheduler/interfaces';

interface ResourceRowProps {
  resource: Resource;
  days: Date[];
  events: CalendarEvent[];
}

export const ResourceRow: React.FC<ResourceRowProps> = ({
  resource,
  days,
  events
}) => {
  return (
    <div className='flex border-b'>
      {/* Resource label on the left */}
      <div className='md:w-40 border-r p-2 font-semibold'>{resource.name}</div>

      {/* 7 day columns */}
      {days.map((day, dayIndex) => {
        // For each day, filter events that intersect [dayStart..dayEnd]
        const dayStart = startOfDay(day);
        const dayEnd = endOfDay(day);
        const dayEvents = events.filter((evt) => {
          return !(isBefore(evt.end, dayStart) || isAfter(evt.start, dayEnd));
        });

        return (
          <div key={dayIndex} className='flex-1 border-r p-2'>
            {dayEvents.map((evt) => (
              <div
                key={evt._id}
                className='text-sm bg-blue-100 mb-1 px-1 rounded'>
                {evt.title}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};
