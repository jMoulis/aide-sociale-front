import Button from '@/components/buttons/Button';
import Dialog from '@/components/dialog/Dialog';
import { useEffect, useState } from 'react';
import CssEditor from './Properties/CssEditor';
import FormFooterAction from '@/components/dialog/FormFooterAction';
import { generateTailwind } from '../actions';
import CancelButton from '@/components/buttons/CancelButton';

type Props = {
  prevScript: string;
  onUpdateWebsite: (script: string) => void;
  path: string;
};

function TailwindConfig({ prevScript, onUpdateWebsite, path }: Props) {
  const [open, setOpen] = useState(false);
  const [script, setScript] = useState(prevScript);
  const [generating, setGenerating] = useState(false);
  const [generatedCss, setGeneratedCss] = useState<string | null>(null);

  useEffect(() => {
    setScript(prevScript);
  }, [prevScript]);

  const handleUpdateScript = (script: string) => {
    setScript(script);
  };

  const handleGenerate = async () => {
    // eslint-disable-next-line no-console
    console.info('Generating Tailwind CSS...');
    try {
      setGenerating(true);
      const css = await generateTailwind(script, path);
      setGeneratedCss(css);
      setGenerating(false);
      onUpdateWebsite(script);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.info(error);
      setGenerating(false);
    }
  };
  const handleClose = () => {
    setOpen(false);
    setGeneratedCss(null);
  };
  return (
    <Dialog
      title='Tailwind Config'
      contentStyle={{
        width: '80vw',
        minWidth: '80vw',
        height: '80vh',
        display: 'flex',
        flexDirection: 'column',
        gap: 0
      }}
      open={open}
      onOpenChange={setOpen}
      Trigger={<Button>Theme tailwind</Button>}>
      <CssEditor
        value={script}
        onUpdate={handleUpdateScript}
        lang='javascript'
      />
      <CssEditor
        readOnly
        value={generatedCss || ''}
        onUpdate={handleUpdateScript}
        lang='css'
      />
      <FormFooterAction>
        <Button
          loading={generating}
          disabled={generating}
          onClick={handleGenerate}>
          Generate and Save
        </Button>
        <CancelButton disabled={generating} onClick={handleClose} />
      </FormFooterAction>
    </Dialog>
  );
}
export default TailwindConfig;
