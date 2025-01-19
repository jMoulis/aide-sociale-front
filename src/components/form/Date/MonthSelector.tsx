import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../../buttons/Button';
import {
  faChevronLeft,
  faChevronRight
} from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { useRef } from 'react';
import { format, Locale } from 'date-fns';

type Props = {
  onSelect: (month: number) => void;
  locale: Locale;
  selectedDate: Date;
};
const MonthSelector = ({ onSelect, locale, selectedDate }: Props) => {
  const months = useRef(
    Array.from({ length: 12 }, (_: number, i: any) => ({
      label: locale.localize.month(i, {
        width: 'abbreviated'
      }),
      value: i
    }))
  );
  return (
    <div className='absolute bg-white top-0 left-0 z-10 bottom-0 right-0 p-2 flex flex-col'>
      <div className='flex justify-between'>
        <Button>
          <FontAwesomeIcon icon={faChevronLeft} />
        </Button>
        <Button onClick={() => onSelect(new Date().getMonth())}>
          <span className='mr-1'>{format(new Date(), 'MMMM', { locale })}</span>
          <span>{selectedDate.getFullYear()}</span>
        </Button>
        <Button>
          <FontAwesomeIcon icon={faChevronRight} />
        </Button>
      </div>
      <div className='grid grid-cols-4 flex-1 m-2'>
        {months.current.map((month, index) => (
          <button
            className={`rounded hover:bg-accent ${
              month.value === selectedDate.getMonth()
                ? 'bg-primary text-white'
                : month.value === new Date().getMonth()
                ? 'bg-accent'
                : ''
            }`}
            onClick={() => onSelect(month.value)}
            key={index}>
            {month.label}
          </button>
        ))}
      </div>
    </div>
  );
};
export default MonthSelector;
