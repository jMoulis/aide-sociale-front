import Button from '@/components/buttons/Button';
import Dialog from '@/components/dialog/Dialog';
import { useState } from 'react';
import PageForm from './PageForm';
import { ITreePage } from '@/lib/interfaces/interfaces';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd } from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { usePageBuilderStore } from './usePageBuilderStore';

type Props = {
  page: ITreePage;
};
function PageListItem({ page }: Props) {
  const [open, setOpen] = useState(false);
  const setSelectedPage = usePageBuilderStore((state) => state.setSelectedPage);
  const selectedPage = usePageBuilderStore((state) => state.selectedPage);

  return (
    <li>
      <div className='flex'>
        <Button
          className={`w-full ${
            selectedPage?._id === page._id ? 'bg-black text-white' : ''
          }`}
          onClick={() => setSelectedPage(page)}>
          {page.name}
        </Button>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          Trigger={
            <Button>
              <FontAwesomeIcon icon={faAdd} />
            </Button>
          }>
          <PageForm onClose={() => setOpen(false)} parentId={page._id} create />
        </Dialog>
      </div>
      <ul className='ml-4'>
        {page.children.map((subPage) => (
          <li key={subPage._id}>
            <Button
              className={`w-full ${
                selectedPage?._id === subPage._id ? 'bg-black text-white' : ''
              }`}
              onClick={() => setSelectedPage(subPage)}>
              {subPage.name}
            </Button>
          </li>
        ))}
      </ul>
    </li>
  );
}
export default PageListItem;
