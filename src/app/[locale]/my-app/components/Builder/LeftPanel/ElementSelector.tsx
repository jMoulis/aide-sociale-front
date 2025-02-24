import { usePageBuilderStore } from '../../stores/pagebuilder-store-provider';
import Button from '@/components/buttons/Button';
import Dialog from '@/components/dialog/Dialog';
import { ENUM_COMPONENTS } from '../../interfaces';
import { useState } from 'react';
import { sortArray } from '@/lib/utils/utils';

function ElementsSelector() {
  const [open, setOpen] = useState(false);
  const elementsConfig = usePageBuilderStore((state) => state.elementsConfig);
  const onAddComponent = usePageBuilderStore((state) => state.onAddComponent);

  const handleAddComponent = (type: ENUM_COMPONENTS) => {
    onAddComponent?.(type);
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      title='Add Elements'
      contentStyle={{
        width: '60vw',
        maxWidth: '60vw'
      }}
      Trigger={<Button>Add Element</Button>}>
      <ul className='grid grid-cols-6 gap-2 h-[50vh] overflow-y-auto'>
        {sortArray(elementsConfig, 'label').map((elementConfig) => (
          <li key={elementConfig._id}>
            <Button
              className='w-full h-full items-center justify-center'
              onClick={() => handleAddComponent(elementConfig.type)}>
              {elementConfig.label}
            </Button>
          </li>
        ))}
      </ul>
    </Dialog>
  );
}
export default ElementsSelector;
