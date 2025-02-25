import Button from '@/components/buttons/Button';
import ResponsiveIcon from './ResponsiveIcon';
import { usePageBuilderStore } from '../../stores/pagebuilder-store-provider';

function ResponsiveMenu() {
  const breakpoints = ['desktop', 'tablet', 'mobile'];
  const onSelectBreakpoint = usePageBuilderStore(
    (state) => state.onSelectBreakpoint
  );
  const selectedBreakpoint = usePageBuilderStore(
    (state) => state.selectedBreakPoint
  );
  return (
    <div className='flex space-x-2'>
      {breakpoints.map((breakpoint) => (
        <Button
          style={{
            backgroundColor:
              selectedBreakpoint?.name === breakpoint
                ? 'rgba(0, 0, 0, 0.1)'
                : 'transparent'
          }}
          key={breakpoint}
          onClick={() =>
            onSelectBreakpoint(breakpoint as 'desktop' | 'tablet' | 'mobile')
          }>
          <ResponsiveIcon
            breakpoint={breakpoint as 'desktop' | 'tablet' | 'mobile'}
          />
        </Button>
      ))}
    </div>
  );
}
export default ResponsiveMenu;
