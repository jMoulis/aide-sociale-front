import { usePageBuilderStore } from '../../stores/pagebuilder-store-provider';
import ResponsiveMenu from './ResponsiveMenu';
import Button from '@/components/buttons/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGrid4,
  faObjectGroup
} from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';

function DisplayOptions() {
  const gridDisplay = usePageBuilderStore((state) => state.gridDisplay);
  const designMode = usePageBuilderStore((state) => state.designMode);
  const setDesignMode = usePageBuilderStore((state) => state.setDesignMode);
  const setGridDisplay = usePageBuilderStore((state) => state.setGridDisplay);

  return (
    <div className='mt-2 flex space-x-2'>
      <Button
        className={designMode ? 'bg-indigo-500 text-white' : ''}
        onClick={() => setDesignMode(!designMode)}>
        <FontAwesomeIcon icon={faObjectGroup} />
      </Button>
      <Button
        className={gridDisplay ? 'bg-indigo-500 text-white' : ''}
        onClick={() => setGridDisplay(!gridDisplay)}>
        <FontAwesomeIcon icon={faGrid4} />
      </Button>

      <ResponsiveMenu />
    </div>
  );
}
export default DisplayOptions;
