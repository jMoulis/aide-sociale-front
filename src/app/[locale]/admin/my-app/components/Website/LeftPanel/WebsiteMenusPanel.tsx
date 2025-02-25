import PagesMenu from '../../Pages/PagesMenu';
import DialogPageForm from '../../Pages/DialogPageForm';
import { faAdd } from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { usePageBuilderStore } from '../../stores/pagebuilder-store-provider';

const WebsiteMenusPanel = () => {
  const website = usePageBuilderStore((state) => state.website);
  const organizationId = usePageBuilderStore((state) => state.organizationId);

  if (!website || !organizationId) return null;
  return (
    <div className='p-2'>
      <DialogPageForm
        icon={faAdd}
        create={true}
        initialPage={null}
        buttonLabel='Add Page'
        websiteId={website._id}
        organizationId={organizationId}
      />
      <PagesMenu />
    </div>
  );
};
export default WebsiteMenusPanel;
