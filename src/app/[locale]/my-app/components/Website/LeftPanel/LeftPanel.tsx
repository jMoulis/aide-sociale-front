import MenusMenuPanel from './MenusMenuPanel';
import PagesMenuPanel from './WebsiteMenusPanel';

const LeftPanel = () => {
  return (
    <div className='p-2'>
      <PagesMenuPanel />
      <MenusMenuPanel />
    </div>
  );
};
export default LeftPanel;
