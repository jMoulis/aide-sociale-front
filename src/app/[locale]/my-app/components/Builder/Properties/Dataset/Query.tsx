import { IDataset } from '@/lib/interfaces/interfaces';
import { ElementConfigProps, IVDOMNode } from '../../../interfaces';
import { usePageBuilderStore } from '../../../stores/pagebuilder-store-provider';
import Dialog from '@/components/dialog/Dialog';
import Button from '@/components/buttons/Button';
import IDE from '../IDE';
import { useCallback, useState } from 'react';

type Props = {
  selectedNode: IVDOMNode | null;
  config: ElementConfigProps;
};
function Query({ selectedNode, config }: Props) {
  const [query, setQuery] = useState(
    selectedNode?.context?.dataset?.connexion?.query || ''
  );
  const [open, setOpen] = useState(false);

  const onUpdateNodeProperty = usePageBuilderStore(
    (state) => state.onUpdateNodeProperty
  );
  const handleSubmit = () => {
    const updatedDataset: IDataset = {
      ...(selectedNode?.context?.dataset || ({} as IDataset)),
      connexion: {
        ...selectedNode?.context?.dataset?.connexion,
        query
      }
    };
    onUpdateNodeProperty(
      { [config.propKey]: updatedDataset || '' },
      config.context
    );
    setOpen(false);
  };
  const handleInputChange = useCallback((value: string) => {
    setQuery(value);
  }, []);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      Trigger={<Button>Query</Button>}
      title='Query'>
      <div className='p-4 h-[40vh] overflow-auto'>
        <Button onClick={handleSubmit}>Save</Button>
        <IDE lang='json' value={query} onChange={handleInputChange} />
      </div>
    </Dialog>
  );
}
export default Query;
