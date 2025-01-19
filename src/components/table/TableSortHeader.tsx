import { useMemo } from 'react';
import { Header } from '@tanstack/react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSort,
  faSortDown,
  faSortUp
} from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';

type Props<T> = {
  header: Header<T, any>;
};

function TableSortHeader<T>({ header }: Props<T>) {
  const sortIcon = useMemo(() => {
    if (!header.column.getCanSort()) return null;

    const sort = {
      asc: <FontAwesomeIcon icon={faSortDown} />,
      desc: <FontAwesomeIcon icon={faSortUp} />
    }[header.column.getIsSorted() as string];

    if (!sort) return <FontAwesomeIcon icon={faSort} />;
    return sort;
  }, [header.column]);

  return <>{sortIcon}</>;
}
export default TableSortHeader;
