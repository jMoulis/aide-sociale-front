import { Locale, setYear } from 'date-fns';
import MonthSelector from './MonthSelector';
import YearSelector from './YearSelector';
import { forwardRef, useImperativeHandle, useState } from 'react';

export interface PickerNavigationRef {
  selectStep: (step: 'month' | 'year') => void;
}
type Props = {
  month: Date;
  locale: Locale;
  onChange: (date: Date) => void;
};
const PickerNavigation = forwardRef<PickerNavigationRef, Props>(
  function PickerNavigation({ month, locale, onChange }, ref) {
    const [selectedStep, setSelectedStep] = useState<'month' | 'year' | null>(
      null
    );

    useImperativeHandle(ref, () => ({
      selectStep: (step: 'month' | 'year') => setSelectedStep(step)
    }));

    const handleSelectYear = (year: number) => {
      const updatedDate = setYear(month, year);
      setSelectedStep('month');
      onChange(updatedDate);
    };

    const handleSelectMonth = (newMonth: number) => {
      const previousYear = month.getFullYear();
      const updatedDate = new Date(previousYear, newMonth);
      onChange(updatedDate);
      setSelectedStep(null);
    };

    return (
      <div>
        {selectedStep === 'year' ? (
          <YearSelector
            onYearSelect={handleSelectYear}
            currentYear={month.getFullYear()}
          />
        ) : null}
        {selectedStep === 'month' ? (
          <MonthSelector
            onSelect={handleSelectMonth}
            locale={locale}
            selectedDate={month}
          />
        ) : null}
      </div>
    );
  }
);
export default PickerNavigation;
