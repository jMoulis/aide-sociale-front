import Button from '@/components/buttons/Button';
import Dialog from '@/components/dialog/Dialog';
import { useEffect, useState } from 'react';
import FormFooterAction from '@/components/dialog/FormFooterAction';
import CancelButton from '@/components/buttons/CancelButton';
import { isValidJSON } from '@/lib/utils/utils';
import { usePageBuilderStore } from '../stores/pagebuilder-store-provider';
import { generateTailwind } from '../../actions';
import IDE from '../Builder/Properties/IDE';

type GenerateError = {
  column: number | null;
  command: string | null;
  errorMessage: string | null;
  errorType: string | null;
  line: string | null;
};

function TailwindConfig() {
  const website = usePageBuilderStore((state) => state.website);
  const [open, setOpen] = useState(false);
  const [script, setScript] = useState(website?.tailwindConfig || '');
  const [generating, setGenerating] = useState(false);
  const [generatedCss, setGeneratedCss] = useState<string | null>(null);
  const [error, setError] = useState<GenerateError | null>(null);
  const organizationId = usePageBuilderStore((state) => state.organizationId);

  useEffect(() => {
    setScript(website?.tailwindConfig || '');
  }, [website?.tailwindConfig]);

  const handleUpdateScript = (script: string) => {
    setScript(script);
  };

  useEffect(() => {
    if (!website?.stylesheets) return;
    const compiledCssUri = website.stylesheets?.find(
      (stylesheet) => stylesheet.name === 'compiled'
    );
    if (!compiledCssUri || !open) return;

    fetch(compiledCssUri.uri, {
      cache: 'no-cache'
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.text();
      })
      .then((css) => {
        setGeneratedCss(css);
      });
  }, [website?.stylesheets, open]);
  const handleGenerate = async () => {
    if (!organizationId || !website) return;
    // eslint-disable-next-line no-console
    console.info('Generating Tailwind CSS...');
    try {
      setGenerating(true);
      await generateTailwind(script, organizationId, website);
      setGenerating(false);
      setError(null);
    } catch (err: any) {
      if (isValidJSON(err.message)) {
        setError(JSON.parse(err.message) as GenerateError);
      }
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
        overflow: 'hidden',
        height: '80vh',
        display: 'flex',
        flexDirection: 'column',
        gap: 0
      }}
      open={open}
      onOpenChange={setOpen}
      Trigger={<Button>Theme tailwind</Button>}>
      <div className='max-h-[80vh] overflow-y-auto'>
        <IDE
          value={script}
          title='Fichier de configuration Tailwind'
          onChange={handleUpdateScript}
          lang='javascript'
        />
        <IDE
          readOnly
          value={generatedCss || ''}
          onChange={handleUpdateScript}
          lang='css'
          title='Generated CSS'
        />
      </div>
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
