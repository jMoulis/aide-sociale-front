import { addDays } from 'date-fns';
import { useCalendarStore } from '../store/useCalendarStore';
import { useMemo } from 'react';

type Props = {
  hiddenCountsPerDay: number[];
  weekStart: Date;
};
function DisplayMore({ hiddenCountsPerDay, weekStart }: Props) {
  const { onNavigateToDay } = useCalendarStore();
  const colWidthPercent = useMemo(() => 100 / 7, []);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 5, // small offset from bottom
        left: 0,
        right: 0
      }}>
      {hiddenCountsPerDay.map((count, colIndex) => {
        if (count <= 0) return null;
        const leftPct = colIndex * colWidthPercent;
        const widthPct = colWidthPercent;

        return (
          <button
            key={colIndex}
            className='absolute text-xs text-blue-600'
            style={{
              left: `${leftPct}%`,
              width: `calc(${widthPct}% - 2px)`,
              textAlign: 'right',
              paddingRight: '2px',
              bottom: 0,
              zIndex: 1
            }}
            onClick={() => {
              const dayDate = addDays(weekStart, colIndex);
              onNavigateToDay(dayDate);
            }}>
            +{count} more
          </button>
        );
      })}
    </div>
  );
}
export default DisplayMore;
