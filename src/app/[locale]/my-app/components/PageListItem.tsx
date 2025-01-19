import Button from '@/components/buttons/Button';
import Dialog from '@/components/dialog/Dialog';
import { Dispatch, SetStateAction, useState } from 'react';
import PageForm from './PageForm';
import { IPage, IWebsite } from '@/lib/interfaces/interfaces';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd } from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';

type Props = {
  organizationId: string;
  websiteId: string;
  onUpdateWebsite: Dispatch<SetStateAction<IWebsite>>;
  page: IPage;
  onSelectPage: (page: IPage) => void;
  selectedPage: IPage | null;
};
function PageListItem({
  organizationId,
  websiteId,
  onUpdateWebsite,
  page,
  onSelectPage,
  selectedPage
}: Props) {
  const [open, setOpen] = useState(false);
  const handleCreatePage = (createdPage: IPage) => {
    onUpdateWebsite((prev) => {
      return {
        ...prev,
        pages: prev.pages.map((p) => {
          if (p._id === page._id) {
            return {
              ...p,
              subPages: [...p.subPages, createdPage]
            };
          }
          return p;
        })
      };
    });
    setOpen(false);
  };
  return (
    <li>
      <div className='flex'>
        <Button
          className={`${
            selectedPage?._id === page._id ? 'bg-black text-white' : ''
          }`}
          onClick={() => onSelectPage(page)}>
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
          <PageForm
            initialPage={null}
            organizationId={organizationId}
            onSubmit={handleCreatePage}
            websiteId={websiteId}
          />
        </Dialog>
      </div>
      <ul className='ml-4'>
        {page.subPages.map((subPage) => (
          <Button
            className={`${
              selectedPage?._id === subPage._id ? 'bg-black text-white' : ''
            }`}
            key={subPage._id}
            onClick={() => onSelectPage(subPage)}>
            {subPage.name}
          </Button>
        ))}
      </ul>
    </li>
  );
}
export default PageListItem;
