import Button from '@/components/buttons/Button';
import { ITreePage } from '@/lib/interfaces/interfaces';
import {
  faAdd,
  faCog,
  faPage
} from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import DialogPageForm from './DialogPageForm';
import { usePageBuilderStore } from '../stores/pagebuilder-store-provider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RolesBlock from '../Website/RolesBlock';
import MasterTemplateItem from '../MasterTemplateItem';
import { removeObjectFields } from '@/lib/utils/utils';

type Props = {
  page: ITreePage;
  add: boolean;
};
function PageListItem({ page, add }: Props) {
  const setSelectedPage = usePageBuilderStore((state) => state.setSelectedPage);
  const selectedPage = usePageBuilderStore((state) => state.selectedPage);

  const handleSelectPage = (incomingPage: ITreePage) => {
    setSelectedPage(removeObjectFields(incomingPage, ['children']));
  };
  return (
    <div className='flex flex-col'>
      <div className='flex'>
        <Button
          className={`w-full grid grid-cols-[20px_1fr] justify-items-start ${
            selectedPage?._id === page._id ? 'bg-black text-white' : ''
          }`}
          onClick={() => handleSelectPage(page)}>
          <FontAwesomeIcon icon={faPage} />
          {page.name}
        </Button>
        <DialogPageForm
          icon={faCog}
          create={false}
          initialPage={page}
          parentId={page._id}
        />
        {add ? (
          <DialogPageForm
            icon={faAdd}
            create={true}
            initialPage={null}
            parentId={page._id}
          />
        ) : null}
      </div>
      <div className='ml-2'>
        <MasterTemplateItem
          masterTemplateId={page.masterTemplateId}
          page={page}
        />
        <RolesBlock />
      </div>
    </div>
  );
}
export default PageListItem;
