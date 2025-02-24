import { PositionedEvent } from "../interfaces";


/** Overlap logic: Assign a `columnIndex` to each event so that
 * simultaneous events appear side by side rather than stacked.
 */
export function assignDayEventColumns(
  partials: Omit<PositionedEvent, 'columnIndex'>[]
): PositionedEvent[] {
  // Sort by start time
  const sorted = [...partials].sort(
    (a, b) => a.start.getTime() - b.start.getTime()
  );

  const columns: PositionedEvent[][] = [];
  const result: PositionedEvent[] = [];

  for (const evt of sorted) {
    let placed = false;
    // Attempt to place in an existing column
    for (let colIndex = 0; colIndex < columns.length; colIndex++) {
      // Check if it overlaps with any event in that column
      const hasOverlap = columns[colIndex].some((colEvt) => {
        // overlap if colEvt.start < evt.end && colEvt.end > evt.start
        return colEvt.start < evt.end && colEvt.end > evt.start;
      });
      if (!hasOverlap) {
        // place it in this column
        const withCol = { ...evt, columnIndex: colIndex };
        columns[colIndex].push(withCol);
        result.push(withCol);
        placed = true;
        break;
      }
    }
    // If not placed, create a new column
    if (!placed) {
      const newColIndex = columns.length;
      const withCol = { ...evt, columnIndex: newColIndex };
      columns.push([withCol]);
      result.push(withCol);
    }
  }

  return result;
}