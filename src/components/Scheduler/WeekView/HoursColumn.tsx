import { useTranslations } from 'next-intl';
import { HOUR_BLOCK_HEIGHT } from './weekHelpers';

type Props = {
  hoursArray: number[];
  allDayRegionHeight: number;
};
function HoursColumn({ hoursArray, allDayRegionHeight }: Props) {
  const t = useTranslations('CalendarSection');
  return (
    <div className='md:w-16 w-8 border-r'>
      {/* All day label region */}
      <div
        className='border-b flex items-center justify-center text-xs'
        style={{ height: allDayRegionHeight + 48 }}>
        {t('allDay')}
      </div>

      {/* Then hour labels */}
      {hoursArray.map((hour) => (
        <div
          key={hour}
          className='border-b text-xs flex items-start justify-end pr-1'
          style={{ height: HOUR_BLOCK_HEIGHT }}>
          {String(hour).padStart(2, '0')}:00
        </div>
      ))}
    </div>
  );
}
export default HoursColumn;
