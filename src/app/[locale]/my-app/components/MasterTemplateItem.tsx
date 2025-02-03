import MasterTemplateForm from './MasterTemplateForm';
import { usePageBuilderStore } from './stores/pagebuilder-store-provider';
import PageTemplateVersionsList from './PageTemplateVersionsList';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faChevronRight
} from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { IMasterTemplate } from '@/lib/TemplateBuilder/interfaces';
import { ITreePage } from '@/lib/interfaces/interfaces';

type Props = {
  masterTemplateId: string;
  page: ITreePage;
};
function MasterTemplateItem({ masterTemplateId, page }: Props) {
  const [open, setOpen] = useState(false);
  const masterTemplates = usePageBuilderStore((state) => state.masterTemplates);

  const [masterTemplate, setMasterTemplate] = useState<IMasterTemplate | null>(
    masterTemplates.find((mt) => mt._id === masterTemplateId) || null
  );
  // useEffect(() => {
  //   if (masterTemplateId) {
  //     client
  //       .get<IMasterTemplate>(ENUM_COLLECTIONS.TEMPLATES_MASTER, {
  //         _id: masterTemplateId
  //       })
  //       .then(({ data }) => {
  //         setMasterTemplate(data);
  //       });
  //   }
  // }, [masterTemplateId]);

  return (
    <Collapsible className='mt-1' open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <div className='flex items-center justify-between border disabled:cursor-not-allowed w-full disabled:opacity-50 shadow-sm border-input rounded-md px-3 py-1 md:text-sm text-lg'>
          <button className='text-left grid grid-cols-[20px_1fr] items-center justify-start w-full'>
            <FontAwesomeIcon icon={open ? faChevronDown : faChevronRight} />
            <div className='flex flex-col justify-start'>
              <span className='text-sm block'>{masterTemplate?.title}</span>
              <span className='text-[8px] block text-gray-500'>Templates</span>
            </div>
          </button>
          <MasterTemplateForm
            initialMasterTemplate={masterTemplate}
            page={page}
            onSubmit={setMasterTemplate}
          />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className='rounded'>
        <PageTemplateVersionsList masterTemplate={masterTemplate} />
      </CollapsibleContent>
    </Collapsible>
  );
}
export default MasterTemplateItem;
