import React from 'react';
import { buildColumns } from './timelineUtils';
import { useCalendarStore } from '../store/useCalendarStore';
import { Resource, TimelineViewScale } from './interfaces';
import { RowEventSpanner } from './RowEventSpanner';

interface StickyTimelineProps {
  currentDate: Date;
  resources: Resource[];
}

export const TimelineView: React.FC<StickyTimelineProps> = ({
  currentDate,
  resources
}) => {
  const { locale, viewScale, setViewScale, events } = useCalendarStore();
  const columns = buildColumns(currentDate, viewScale, locale);

  // We'll put the grid in a horizontally scrollable container
  return (
    <div>
      <select
        value={viewScale}
        onChange={(e) => setViewScale(e.target.value as TimelineViewScale)}>
        <option value={TimelineViewScale.YEAR}>Year</option>
        <option value={TimelineViewScale.MONTH}>Month</option>
        <option value={TimelineViewScale.WEEK}>Week</option>
        <option value={TimelineViewScale.DAY}>Day</option>
      </select>

      <div className='relative overflow-x-auto' style={{ maxWidth: '100vw' }}>
        <div
          className={`grid `}
          style={{
            gridTemplateColumns: `200px repeat(${columns.length}, 1fr)`,
            position: 'relative',
            minWidth: '600px'
          }}>
          {/* (A) top-left cell => resource label heading (optional) */}
          <div
            className='border p-2 font-semibold text-center bg-white'
            style={{
              gridRow: 1,
              gridColumn: 1,
              position: 'sticky',
              top: 0,
              left: 0,
              zIndex: 3
            }}>
            Resource
          </div>

          {/* (B) Column headers => row=1, col=2..(columns.length+1) */}
          {columns.map((col, cIndex) => (
            <div
              key={cIndex}
              className='border p-2 text-center font-semibold bg-white'
              style={{
                gridRow: 1,
                gridColumn: cIndex + 2,
                position: 'sticky',
                top: 0,
                zIndex: 2
              }}>
              {col.label}
            </div>
          ))}

          {/* (C) Resource rows => row=2.., with resource label pinned left */}
          {resources.map((res, rIndex) => {
            const rowNum = rIndex + 2;
            return (
              <React.Fragment key={res.id}>
                {/* pinned left resource name */}
                <div
                  className='border p-2 font-semibold bg-white'
                  style={{
                    gridRow: rowNum,
                    gridColumn: 1,
                    position: 'sticky',
                    left: 0,
                    zIndex: 2
                  }}>
                  {res.name}
                </div>

                {/* background cells for day/hour columns */}
                {columns.map((col, cIndex) => (
                  <div
                    key={cIndex}
                    className='border relative'
                    style={{
                      gridRow: rowNum,
                      gridColumn: cIndex + 2,
                      minHeight: 100
                    }}
                  />
                ))}

                {/* Event bars spanner */}
                <RowEventSpanner
                  rowNum={rowNum}
                  columns={columns}
                  resource={res}
                  events={events}
                />
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
