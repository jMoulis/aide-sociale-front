import { ITreePage } from '@/lib/interfaces/interfaces';
import {
  faAdd,
  faChevronDown,
  faChevronRight,
  faCog,
  faPage
} from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import DialogPageForm from './DialogPageForm';
import { usePageBuilderStore } from '../stores/pagebuilder-store-provider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MasterTemplateItem from '../MasterTemplateItem';
import { removeObjectFields } from '@/lib/utils/utils';
import MasterTemplateForm from '../MasterTemplateForm';
import { useTranslations } from 'next-intl';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import { useState } from 'react';

type Props = {
  parentPage?: ITreePage;
  page: ITreePage;
  add: boolean;
};
function PageListItem({ page, add, parentPage }: Props) {
  const [open, setOpen] = useState(false);
  const setSelectedPage = usePageBuilderStore((state) => state.setSelectedPage);
  const selectedPage = usePageBuilderStore((state) => state.selectedPage);
  const t = useTranslations('WebsiteSection');
  const handleSelectPage = (incomingPage: ITreePage) => {
    setSelectedPage(removeObjectFields(incomingPage, ['children']));
  };

  return (
    <div className='flex flex-col flex-1'>
      <div className='flex'>
        <div
          className={`grid grid-cols-[20px_1fr] items-center border disabled:cursor-not-allowed w-fit disabled:opacity-50 shadow-sm border-input rounded-md px-3 py-1 md:text-sm text-lg ${
            selectedPage?._id === page._id ? 'bg-black text-white' : ''
          }`}>
          <button onClick={() => setOpen((prev) => !prev)}>
            <FontAwesomeIcon icon={open ? faChevronDown : faChevronRight} />
          </button>
          <button
            className={`w-full grid grid-cols-[20px_1fr] items-center justify-items-start text-xs overflow-hidden `}
            onClick={() => handleSelectPage(page)}>
            <FontAwesomeIcon icon={faPage} />
            <span className='text-xs whitespace-nowrap overflow-hidden text-ellipsis max-w-full'>
              {page.name}
            </span>
          </button>
        </div>
        <DialogPageForm
          icon={faCog}
          create={false}
          initialPage={page}
          parentPage={parentPage}
        />
        {add ? (
          <DialogPageForm
            icon={faAdd}
            create={true}
            initialPage={null}
            parentPage={page}
          />
        ) : null}
      </div>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <button hidden />
        </CollapsibleTrigger>
        <CollapsibleContent className='rounded'>
          <div className='ml-2'>
            <div className='flex items-center justify-between'>
              <div className='border disabled:cursor-not-allowed justify-between disabled:opacity-50 shadow-sm border-input rounded-md px-3 py-1 md:text-sm text-lg flex items-center w-full'>
                <span className='text-xs'>{t('labels.templates')}</span>
                <MasterTemplateForm initialMasterTemplate={null} page={page} />
              </div>
            </div>
            <ul className='ml-2'>
              {page.masterTemplateIds?.map((masterTemplateId) => (
                <MasterTemplateItem
                  key={masterTemplateId}
                  masterTemplateId={masterTemplateId}
                  page={page}
                />
              ))}
            </ul>
          </div>
          <ul className='ml-4'>
            {page.children.map((subPage) => (
              <li key={subPage._id} className='flex mt-2'>
                <PageListItem parentPage={page} page={subPage} add={true} />
              </li>
            ))}
          </ul>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
export default PageListItem;
