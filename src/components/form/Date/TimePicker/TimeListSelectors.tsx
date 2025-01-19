import { useState, useEffect } from 'react';
import PickersList from './PickersList';

type Props = {
  onChange: (time: string) => void;
  time?: string;
  required?: boolean;
  disabled?: boolean;
  pickersClassName?: string;
  flat?: boolean;
};
function TimeListSelectors({
  time,
  onChange,
  required,
  disabled,
  pickersClassName,
  flat
}: Props) {
  const [hoursRef, setHoursRef] = useState<HTMLUListElement | null>(null);
  const [minutesRef, setMinutesRef] = useState<HTMLUListElement | null>(null);

  const [selectedHour, setSelectedHour] = useState(
    time ? time.split(':')[0] : '00'
  );
  const [selectedMinute, setSelectedMinute] = useState(
    time ? time.split(':')[1] : '00'
  );

  const hours = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, '0')
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, '0')
  );
  const handleHourClick = (hour: string) => {
    setSelectedHour(hour);
    if (onChange) onChange(`${hour}:${selectedMinute}`);
  };

  const handleMinuteClick = (minute: string) => {
    setSelectedMinute(minute);
    if (onChange) onChange(`${selectedHour}:${minute}`);
  };

  const handleScroll = (ref: HTMLUListElement | null, delta: number) => {
    if (ref) {
      ref.scrollTop += delta;
    }
  };

  useEffect(() => {
    const hoursList = hoursRef;
    const minutesList = minutesRef;
    const onWheelHours = (event: WheelEvent) => {
      event.preventDefault();
      handleScroll(hoursList, event.deltaY);
    };

    const onWheelMinutes = (event: WheelEvent) => {
      event.preventDefault();
      handleScroll(minutesList, event.deltaY);
    };

    hoursList?.addEventListener('wheel', onWheelHours);
    minutesList?.addEventListener('wheel', onWheelMinutes);

    return () => {
      hoursList?.removeEventListener('wheel', onWheelHours);
      minutesList?.removeEventListener('wheel', onWheelMinutes);
    };
  }, [hoursRef, minutesRef]);

  return (
    <div className='flex gap-2 p-2 flex-grow'>
      <PickersList
        setPickerRef={setHoursRef}
        items={hours}
        selectedItem={selectedHour}
        onChange={handleHourClick}
        pickersClassName={pickersClassName}
        disabled={disabled}
        required={required}
        flat={flat}
      />
      <PickersList
        setPickerRef={setMinutesRef}
        items={minutes}
        selectedItem={selectedMinute}
        onChange={handleMinuteClick}
        pickersClassName={pickersClassName}
        disabled={disabled}
        required={required}
        flat={flat}
      />
    </div>
  );
}
export default TimeListSelectors;
