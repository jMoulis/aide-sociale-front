import PagesMenu from '../../Pages/PagesMenu';
import DialogPageForm from '../../Pages/DialogPageForm';
import { faAdd } from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';

const WebsiteMenusPanel = () => {
  return (
    <div className='p-2'>
      <DialogPageForm
        icon={faAdd}
        create={true}
        initialPage={null}
        buttonLabel='Add Page'
      />
      <PagesMenu />
    </div>
  );
};
export default WebsiteMenusPanel;
