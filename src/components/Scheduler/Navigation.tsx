import { useTranslations } from 'next-intl';
import { CalendarView, useCalendarStore } from './store/useCalendarStore';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight
} from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';

function Navigation() {
  const { view, currentDate, setView, onNext, onPrev, locale } =
    useCalendarStore();
  const t = useTranslations('CalendarSection');

  return (
    <div className='flex items-center justify-between mb-4 flex-wrap'>
      <div className='flex items-center flex-wrap mb-2'>
        <button
          onClick={onPrev}
          className='bg-blue-500 text-white mr-1 md:h-9 md:w-9 w-6 h-6 flex items-center justify-center rounded-full'>
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <button
          onClick={onNext}
          className='bg-blue-500 text-white md:h-9 md:w-9 w-6 h-6 flex items-center justify-center rounded-full'>
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
        <span className='ml-3 text-sm font-semibold'>
          {format(currentDate, 'PPPP', { locale })}
        </span>
      </div>
      <div className='flex items-center space-x-2'>
        <button
          onClick={() => setView(CalendarView.MONTH)}
          className={`text-sm px-3 py-1 rounded ${
            view === CalendarView.MONTH
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200'
          }`}>
          {t('month')}
        </button>
        <button
          onClick={() => setView(CalendarView.WEEK)}
          className={`text-sm px-3 py-1 rounded ${
            view === CalendarView.WEEK
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200'
          }`}>
          {t('week')}
        </button>
        <button
          onClick={() => setView(CalendarView.DAY)}
          className={`text-sm  px-3 py-1 rounded ${
            view === CalendarView.DAY ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}>
          {t('day')}
        </button>
        <button
          onClick={() => setView(CalendarView.TIMELINE)}
          className={`text-sm px-3 py-1 rounded ${
            view === CalendarView.TIMELINE
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200'
          }`}>
          {t('timeline')}
        </button>
      </div>
    </div>
  );
}
export default Navigation;
