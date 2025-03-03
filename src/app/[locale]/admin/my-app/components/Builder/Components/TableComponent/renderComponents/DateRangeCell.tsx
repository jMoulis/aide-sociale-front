import React from 'react';

import type { CustomCellRendererProps } from 'ag-grid-react';
import { format } from 'date-fns';

const DateRangeCell = (params: CustomCellRendererProps) => {
  const { from, to } = params.value as { from: Date; to: Date };
  return (
    <div>
      <span>{format(from, 'dd/MM/yyyy')}</span>
      <span>-</span>
      <span>{format(to, 'dd/MM/yyyy')}</span>
    </div>
  );
};

export default DateRangeCell;
