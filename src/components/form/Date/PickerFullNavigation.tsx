import { Calendar } from '@/components/ui/calendar';
import { MonthCaption } from 'react-day-picker';
import { fr } from 'date-fns/locale';
import { forwardRef, useRef, useState } from 'react';
import PickerNavigation, { PickerNavigationRef } from './PickerNavigation';
import ManualDateInput from './ManualDateInput';

export interface PickerFullNavigationRef {
  clear: () => void;
}
type Props = {
  selectedDate: Date;
  required?: boolean;
  onChange: (_date?: Date) => void;
  disabled?: boolean;
};
const PickerFullNavigation = forwardRef<PickerFullNavigationRef, Props>(
  function PickerFullNavigation(
    { selectedDate, required, disabled, onChange }: Props,
    _ref
  ) {
    const pickerNavigationRef = useRef<PickerNavigationRef>(null);

    const [month, setMonth] = useState(selectedDate || new Date());

    const handleShowYearMonthPicker = () => {
      pickerNavigationRef.current?.selectStep('year');
    };

    const handleChange = (date: Date) => {
      setMonth(date);
      onChange(date);
    };

    return (
      <>
        <Calendar
          required={required}
          locale={fr}
          month={month}
          onMonthChange={setMonth}
          mode='single'
          selected={selectedDate}
          onSelect={onChange}
          disabled={disabled}
          components={{
            MonthCaption: ({ ...props }) => {
              return (
                <MonthCaption {...props} onClick={handleShowYearMonthPicker} />
              );
            }
          }}
        />
        <PickerNavigation
          ref={pickerNavigationRef}
          month={month}
          locale={fr}
          onChange={handleChange}
        />
        <ManualDateInput onChange={onChange} />
      </>
    );
  }
);
export default PickerFullNavigation;
