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
import MasterTemplateItem from '../MasterTemplateItem';
import { removeObjectFields } from '@/lib/utils/utils';
import MasterTemplateForm from '../MasterTemplateForm';
import { useTranslations } from 'next-intl';

type Props = {
  parentPage?: ITreePage;
  page: ITreePage;
  add: boolean;
};
function PageListItem({ page, add, parentPage }: Props) {
  const setSelectedPage = usePageBuilderStore((state) => state.setSelectedPage);
  const selectedPage = usePageBuilderStore((state) => state.selectedPage);
  const t = useTranslations('WebsiteSection');
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
      <div className='ml-2 mt-2'>
        <div className='flex items-center justify-between'>
          <h3 className='text-sm'>{t('labels.templates')}</h3>
          <MasterTemplateForm initialMasterTemplate={null} page={page} />
        </div>
        <ul>
          {page.masterTemplateIds?.map((masterTemplateId) => (
            <MasterTemplateItem
              key={masterTemplateId}
              masterTemplateId={masterTemplateId}
              page={page}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
export default PageListItem;
