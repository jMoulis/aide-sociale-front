import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import { usePageBuilderStore } from '../../stores/pagebuilder-store-provider';
import {
  faChevronDown,
  faChevronRight
} from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MenusBuilder from '@/app/[locale]/my-app/components/MenusBuilder/MenusBuilder';
import { IMenu } from '@/lib/interfaces/interfaces';
import { useTranslations } from 'next-intl';
import MenuItems from '../../MenusBuilder/MenuItems';

const MenusMenuPanel = () => {
  const [open, setOpen] = useState(false);
  const website = usePageBuilderStore((state) => state.website);
  const setWebsite = usePageBuilderStore((state) => state.setWebsite);
  const onUpdateWebsite = usePageBuilderStore((state) => state.onSaveWebsite);
  const t = useTranslations('WebsiteSection');
  const handleUpdateMenus = (menus: IMenu[]) => {
    if (!website) return;
    setWebsite({ ...website, menus });
    onUpdateWebsite(false, t);
  };
  return (
    <div className='p-2'>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <div className='flex items-center justify-between border disabled:cursor-not-allowed w-full disabled:opacity-50 shadow-sm border-input rounded-md px-3 py-1 md:text-sm text-lg'>
            <button className='grid grid-cols-[20px_1fr] w-full items-center'>
              <FontAwesomeIcon icon={open ? faChevronDown : faChevronRight} />
              <span className='text-left whitespace-nowrap overflow-hidden'>
                Menus
              </span>
            </button>
            <MenusBuilder
              menus={website?.menus ?? []}
              onUpdateMenus={handleUpdateMenus}
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className='p-2 rounded'>
          <MenuItems
            initialMenus={website?.menus ?? []}
            onUpdateMenus={handleUpdateMenus}
          />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
export default MenusMenuPanel;
