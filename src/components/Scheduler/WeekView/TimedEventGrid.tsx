import { HOUR_BLOCK_HEIGHT, TOTAL_DAY_HEIGHT } from './weekHelpers';
import { CalendarEvent } from '../interfaces';
import DayCell from './DayCell';

type Props = {
  days: Date[];
  hoursArray: number[];
  singleDayEvents: CalendarEvent[];
};
function TimedEventGrid({ days, hoursArray, singleDayEvents }: Props) {
  return (
    <div
      className='grid grid-cols-7 relative'
      style={{ height: TOTAL_DAY_HEIGHT }}>
      {hoursArray.map((hour) => {
        const topOffset = hour * HOUR_BLOCK_HEIGHT;
        return (
          <div
            key={hour}
            className='absolute border-b border-gray-200 w-full left-0'
            style={{ top: topOffset }}
          />
        );
      })}

      {days.map((day, dayIndex) => (
        <DayCell key={dayIndex} day={day} singleDayEvents={singleDayEvents} />
      ))}
    </div>
  );
}
export default TimedEventGrid;
