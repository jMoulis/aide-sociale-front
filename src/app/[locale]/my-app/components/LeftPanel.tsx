import FormLabel from '@/components/form/FormLabel';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckedState } from '@radix-ui/react-checkbox';
import React from 'react';
import Button from '@/components/buttons/Button';
import { usePageBuilderStore } from './usePageBuilderStore';

function LeftPanel() {
  const gridDisplay = usePageBuilderStore((state) => state.gridDisplay);
  const designMode = usePageBuilderStore((state) => state.designMode);
  const elementsConfig = usePageBuilderStore((state) => state.elementsConfig);
  const setDesignMode = usePageBuilderStore((state) => state.setDesignMode);
  const setGridDisplay = usePageBuilderStore((state) => state.setGridDisplay);
  const onAddComponent = usePageBuilderStore((state) => state.onAddComponent);

  const handleCheckboxChange = (
    status: CheckedState,
    stateName: 'designMode' | 'gridDisplay'
  ) => {
    if (typeof status === 'boolean') {
      if (stateName === 'gridDisplay') {
        setGridDisplay(status);
      } else {
        if (!status) {
          setGridDisplay(status);
        }
        setDesignMode(status);
      }
    }
  };

  return (
    <div className='w-1/4 border-r p-4 flex flex-col'>
      <h2 className='text-xl font-bold'>Add Elements</h2>
      <FormLabel className='block'>
        <span className='text-gray-700'>Element Type:</span>
        <ul>
          {elementsConfig.map((elementConfig) => (
            <li key={elementConfig._id}>
              <Button onClick={() => onAddComponent?.(elementConfig.component)}>
                {elementConfig.component}
              </Button>
            </li>
          ))}
        </ul>
      </FormLabel>
      <div className='mt-2'>
        <FormLabel className='flex items-center'>
          <Checkbox
            checked={designMode || false}
            onCheckedChange={(e) => handleCheckboxChange(e, 'designMode')}
            className='mr-2'
          />
          <span>Design Mode</span>
        </FormLabel>
        <FormLabel className='flex items-center'>
          <Checkbox
            checked={gridDisplay}
            disabled={!designMode}
            onCheckedChange={(e) => handleCheckboxChange(e, 'gridDisplay')}
            className='mr-2'
          />
          <span>Grid display</span>
        </FormLabel>
      </div>
    </div>
  );
}
export default LeftPanel;
