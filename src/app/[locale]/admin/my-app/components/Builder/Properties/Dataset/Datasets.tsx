import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import { ElementConfigProps } from '../../../interfaces';
import Dataset from './Dataset';
import { useState } from 'react';

type Props = {
  config: ElementConfigProps;
};
function Datasets({ config }: Props) {
  const [inputOpen, setInputOpen] = useState(false);
  const [outputOpen, setOutputOpen] = useState(false);
  return (
    <div>
      <Collapsible open={inputOpen} onOpenChange={setInputOpen}>
        <CollapsibleTrigger>
          <h1>Input</h1>
        </CollapsibleTrigger>
        <CollapsibleContent className='rounded'>
          <Dataset config={config} datasetKey='input' />
        </CollapsibleContent>
      </Collapsible>
      {}
      <Collapsible open={outputOpen} onOpenChange={setOutputOpen}>
        <CollapsibleTrigger>
          <h1>Output</h1>
        </CollapsibleTrigger>
        <CollapsibleContent className='rounded'>
          <Dataset config={config} datasetKey='output' />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
export default Datasets;
