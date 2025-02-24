import EventComponent from '../EventComponent';
import { MultiDayEventPosition } from '../interfaces';
import { ALL_DAY_ROW_HEIGHT } from './weekHelpers';

type Props = {
  allDayRegionHeight: number;
  positionedAllDayEvents: MultiDayEventPosition[];
};
function AllDay({ allDayRegionHeight, positionedAllDayEvents }: Props) {
  return (
    <div className='relative border-b' style={{ height: allDayRegionHeight }}>
      {positionedAllDayEvents.map((evt) => {
        const daySpan = evt.endDayIndex - evt.startDayIndex + 1;
        const leftPercent = (evt.startDayIndex / 7) * 100;
        const widthPercent = (daySpan / 7) * 100;
        const topOffset = evt.rowIndex * ALL_DAY_ROW_HEIGHT;

        return (
          <EventComponent
            key={evt._id}
            event={evt}
            className='absolute flex items-center !bg-purple-200 rounded p-1 m-1 text-sm overflow-hidden'
            style={{
              top: topOffset,
              left: `${leftPercent}%`,
              width: `calc(${widthPercent}% - 8px)`,
              height: ALL_DAY_ROW_HEIGHT - 4
            }}>
            <div className='text-sm'>{evt.title}</div>
            {evt.description && (
              <div className='text-xs'>{evt.description}</div>
            )}
          </EventComponent>
        );
      })}
    </div>
  );
}
export default AllDay;
