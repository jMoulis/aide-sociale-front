import MasterTemplateForm from './MasterTemplateForm';
import { usePageBuilderStore } from './stores/pagebuilder-store-provider';
import PageTemplateVersionsList from './PageTemplateVersionsList';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import { useMemo, useState } from 'react';
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
  const onSelectMasterTemplate = usePageBuilderStore(
    (state) => state.setSelectMasterTemplate
  );
  const selectedMasterTemplate = usePageBuilderStore(
    (state) => state.selectedMasterTemplate
  );

  const masterTemplate = useMemo<IMasterTemplate | null>(
    () => masterTemplates.find((mt) => mt._id === masterTemplateId) || null,
    [masterTemplateId, masterTemplates]
  );

  const handleSelectMasterTemplate = () => {
    if (masterTemplate) onSelectMasterTemplate(masterTemplate);
    if (selectedMasterTemplate?._id === masterTemplateId) {
      setOpen((prev) => !prev);
    } else {
      setOpen(true);
    }
  };

  return (
    <>
      <div
        className='flex items-center justify-between border disabled:cursor-not-allowed w-full disabled:opacity-50 shadow-sm border-input rounded-md px-3 py-1 md:text-sm text-lg'
        style={{
          backgroundColor:
            selectedMasterTemplate?._id === masterTemplateId ? '#000' : '',
          color: selectedMasterTemplate?._id === masterTemplateId ? '#fff' : ''
        }}>
        <button
          onClick={handleSelectMasterTemplate}
          className='text-left grid grid-cols-[20px_1fr] items-center justify-start w-full'>
          <FontAwesomeIcon icon={open ? faChevronDown : faChevronRight} />
          <div className='flex flex-col justify-start'>
            <span className='text-sm block'>{masterTemplate?.title}</span>
            <span className='text-[8px] block text-gray-500'>Templates</span>
          </div>
        </button>
        <MasterTemplateForm
          initialMasterTemplate={masterTemplate}
          page={page}
        />
      </div>
      <Collapsible className='mt-1' open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <button hidden />
        </CollapsibleTrigger>
        <CollapsibleContent className='rounded'>
          <PageTemplateVersionsList
            masterTemplate={masterTemplate}
            page={page}
          />
        </CollapsibleContent>
      </Collapsible>
    </>
  );
}
export default MasterTemplateItem;
