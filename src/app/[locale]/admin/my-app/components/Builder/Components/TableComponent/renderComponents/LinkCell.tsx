import React, { useMemo } from 'react';

import type { CustomCellRendererProps } from 'ag-grid-react';
import { format } from 'date-fns';

const LinkCell = (params: CustomCellRendererProps) => {
  const url = useMemo(() => {
    console.log(params);
  }, [params]);

  return (
    <div>
      <span>{params.value}</span>
    </div>
  );
};

export default LinkCell;
