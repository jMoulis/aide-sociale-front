export const getEventColors = ({ end, color }: { end: Date, color?: string }) => {
  const now = new Date();
  const isPast = end < now;
  const futureBg = color || '#E1ECF9';
  const futureBorder = color || '#93CEE4';
  const pastBg = '#EFEFEF';
  const pastBorder = '#CCCCCC';

  const bg = isPast ? pastBg : futureBg;
  const border = isPast ? pastBorder : futureBorder;

  return {
    backgroundColor: bg,
    border: `1px solid ${border}`,
    opacity: isPast ? 0.6 : 1
  }
}