import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import PagesMenu from '../../Pages/PagesMenu';
import Button from '@/components/buttons/Button';
import { usePageBuilderStore } from '../../stores/pagebuilder-store-provider';
import DialogPageForm from '../../Pages/DialogPageForm';
import {
  faAdd,
  faChevronDown,
  faChevronRight
} from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const WebsiteMenusPanel = () => {
  const [open, setOpen] = useState(false);
  const selectedPage = usePageBuilderStore((state) => state.selectedPage);

  return (
    <div className='p-2'>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <Button className='grid grid-cols-[20px_1fr]'>
            <FontAwesomeIcon icon={open ? faChevronDown : faChevronRight} />
            <span>PAGES: {selectedPage?.name}</span>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className='p-2 rounded'>
          <div>
            <DialogPageForm
              icon={faAdd}
              create={true}
              initialPage={null}
              buttonLabel='Add Page'
            />
            <PagesMenu />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
export default WebsiteMenusPanel;
