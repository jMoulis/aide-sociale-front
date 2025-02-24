import Button from '@/components/buttons/Button';
import MenusMenuPanel from './MenusMenuPanel';
import PagesMenuPanel from './WebsiteMenusPanel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { useState } from 'react';

const LeftPanel = () => {
  const [open, setOpen] = useState(true);

  return (
    <div className='p-2'>
      <Button onClick={() => setOpen(!open)} className='w-10 h-10'>
        <FontAwesomeIcon icon={faBars} />
      </Button>
      <div
        className={`flex flex-col ${
          open ? 'w-64' : 'w-16'
        } overflow-hidden transition-all duration-300`}>
        {open ? (
          <>
            <PagesMenuPanel />
            <MenusMenuPanel />
          </>
        ) : null}
      </div>
    </div>
  );
};
export default LeftPanel;
