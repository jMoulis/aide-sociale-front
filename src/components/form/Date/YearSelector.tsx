import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../../buttons/Button';
import {
  faChevronLeft,
  faChevronRight
} from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { useState } from 'react';
import { buttonVariants } from '../../ui/button';
import { cn } from '@/lib/utils/shadcnUtils';

type Props = {
  onYearSelect: (year: number) => void;
  currentYear: number;
};
const YearSelector = ({ onYearSelect, currentYear }: Props) => {
  const initialStartYear = currentYear;
  const step = 12;

  const [startYear, setStartYear] = useState<number>(initialStartYear);

  const handlePrevious = () => {
    setStartYear((prev) => prev - step);
  };

  const handleNext = () => {
    setStartYear((prev) => prev + step);
  };
  const handleThisYear = () => {
    const currentYear = new Date().getFullYear();
    setStartYear(currentYear);
    onYearSelect(currentYear);
  };
  const yearsRange = Array.from(
    { length: step },
    (_, index) => startYear + index
  );
  return (
    <div className='absolute bg-white top-0 left-0 z-10 bottom-0 right-0 p-2 flex flex-col'>
      <div className='flex justify-between'>
        <Button
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 z-10'
          )}
          onClick={handlePrevious}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </Button>
        <Button className='bg-white' onClick={handleThisYear}>
          {new Date().getFullYear()}
        </Button>
        <Button
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 z-10'
          )}
          onClick={handleNext}>
          <FontAwesomeIcon icon={faChevronRight} />
        </Button>
      </div>
      <div className='grid grid-cols-4 flex-1 m-2'>
        {yearsRange.map((year) => (
          <button
            className={`rounded hover:bg-accent ${
              year === currentYear
                ? 'bg-primary text-white'
                : year === new Date().getFullYear()
                ? 'bg-accent'
                : ''
            }`}
            onClick={() => onYearSelect(year)}
            key={year}>
            {year}
          </button>
        ))}
      </div>
    </div>
  );
};
export default YearSelector;
