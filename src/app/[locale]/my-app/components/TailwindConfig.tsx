import Button from '@/components/buttons/Button';
import Dialog from '@/components/dialog/Dialog';
import { useEffect, useState } from 'react';
import CssEditor from './Properties/CssEditor';
import FormFooterAction from '@/components/dialog/FormFooterAction';
import { generateTailwind } from '../actions';
import CancelButton from '@/components/buttons/CancelButton';
import { isValidJSON } from '@/lib/utils/utils';
import { IWebsite } from '@/lib/interfaces/interfaces';

type GenerateError = {
  column: number | null;
  command: string | null;
  errorMessage: string | null;
  errorType: string | null;
  line: string | null;
};
type Props = {
  prevScript: string;
  onUpdateWebsite: (script: string, path: string) => void;
  organizationId: string;
  website: IWebsite;
};

function TailwindConfig({
  prevScript,
  onUpdateWebsite,
  organizationId,
  website
}: Props) {
  const [open, setOpen] = useState(false);
  const [script, setScript] = useState(prevScript);
  const [generating, setGenerating] = useState(false);
  const [generatedCss, setGeneratedCss] = useState<string | null>(null);
  const [error, setError] = useState<GenerateError | null>(null);

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
      const { css, path } = await generateTailwind(
        script,
        organizationId,
        website
      );
      setGeneratedCss(css);
      setGenerating(false);
      onUpdateWebsite(script, path);
      setError(null);
    } catch (err: any) {
      if (isValidJSON(err.message)) {
        setError(JSON.parse(err.message) as GenerateError);
      }
      // setError(err.message);
      setGenerating(false);
    }
  };
  const handleClose = () => {
    setOpen(false);
    setGeneratedCss(null);
    setError(null);
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
        title='Fichier de configuration Tailwind'
        onUpdate={handleUpdateScript}
        lang='javascript'
      />
      <CssEditor
        readOnly
        value={generatedCss || ''}
        onUpdate={handleUpdateScript}
        lang='css'
        title='Generated CSS'
      />
      <FormFooterAction>
        {error ? (
          <span className='flex-1 bg-red-500 text-sm text-white p-2 rounded'>
            {error.errorMessage}
          </span>
        ) : null}
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
