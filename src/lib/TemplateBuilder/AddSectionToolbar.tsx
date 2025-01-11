import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useTranslations } from 'next-intl';
import Button from '@/components/buttons/Button';
import { useTemplateBuilder } from './TemplateBuilderContext';
import { useState } from 'react';
import { BlockLayout } from './interfaces';

function AddSectionToolbar() {
  const [open, setOpen] = useState(false);
  const t = useTranslations('TemplateSection');
  const { addBlock } = useTemplateBuilder();
  const handleSelectBlock = (blockType: BlockLayout) => {
    addBlock(blockType);
    setOpen(false);
  };
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button className=' flex justify-center bg-white mb-3 '>
          {t('addBlock')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem>
          <Button onClick={() => handleSelectBlock('single-column')}>
            + {t('layout.singleColumn')} bloc
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Button onClick={() => handleSelectBlock('two-column')}>
            + {t('layout.twoColumns')} bloc
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Button onClick={() => handleSelectBlock('three-column')}>
            + {t('layout.threeColumns')} bloc
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default AddSectionToolbar;
