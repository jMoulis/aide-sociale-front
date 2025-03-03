import { useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import { ElementConfigProps } from '../../../interfaces';
import { usePageBuilderStore } from '../../../stores/pagebuilder-store-provider';
import Dataset from './Dataset';

type Props = {
  config: ElementConfigProps;
};

const Outputs = ({ config }: Props) => {
  const selectedNode = usePageBuilderStore((state) => state.selectedNode);

  const [outputOpen, setOutputOpen] = useState(false);
  return (
    <div>
      <h1>Outputs</h1>
      {selectedNode?.context?.dataset?.connexion?.outputs?.map(
        (output, index) => (
          <div key={index}>
            <Collapsible open={outputOpen} onOpenChange={setOutputOpen}>
              <CollapsibleTrigger>
                <h1>Outputs</h1>
              </CollapsibleTrigger>
              <CollapsibleContent className='rounded'>
                <Dataset config={config} datasetKey='output' />
              </CollapsibleContent>
            </Collapsible>
          </div>
        )
      )}
    </div>
  );
};
export default Outputs;
