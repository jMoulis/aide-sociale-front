import { format } from 'date-fns';
import { useCalendarStore } from '../store/useCalendarStore';

type Props = {
  days: Date[];
};
function WeekHeader({ days }: Props) {
  const { locale } = useCalendarStore();

  return (
    <div className='grid grid-cols-7 border-b' style={{ height: 48 }}>
      {days.map((day, index) => (
        <span
          key={index}
          className='text-sm flex items-center justify-center border-r font-semibold'>
          {format(day, 'EEE dd', { locale })}
        </span>
      ))}
    </div>
  );
}
export default WeekHeader;
