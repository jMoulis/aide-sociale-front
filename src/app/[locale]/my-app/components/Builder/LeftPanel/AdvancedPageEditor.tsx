import { usePageBuilderStore } from '../../stores/pagebuilder-store-provider';
import { useEffect, useState } from 'react';
import { IPageTemplateVersion } from '@/lib/interfaces/interfaces';
import IDE from '../Properties/IDE';
import Dialog from '@/components/dialog/Dialog';
import SaveButton from '@/components/buttons/SaveButton';
import { isValidJSON } from '@/lib/utils/utils';
import Button from '@/components/buttons/Button';
import { useTranslations } from 'next-intl';
import FormFooterAction from '@/components/dialog/FormFooterAction';
import RenderLayout from '@/app/[locale]/app/components/RenderLayout';
import { nanoid } from 'nanoid';

function AdvancedPageEditor() {
  const selectedPageVersion = usePageBuilderStore((state) => state.pageVersion);
  const onEditPageTemplateVersion = usePageBuilderStore(
    (state) => state.onEditPageTemplateVersion
  );
  const [generatedUuid, setGeneratedUuid] = useState('');
  const t = useTranslations('WebsiteSection');
  const [pageVersion, setPageVersion] = useState<IPageTemplateVersion | null>(
    selectedPageVersion
  );
  useEffect(() => {
    setPageVersion(selectedPageVersion);
  }, [selectedPageVersion]);

  const handleChange = (value: string) => {
    if (!isValidJSON(value)) return;
    setPageVersion((prev) => {
      if (prev) {
        return {
          ...prev,
          vdom: JSON.parse(value)
        };
      }
      return prev;
    });
  };
  const handleSave = () => {
    if (!pageVersion) return;
    onEditPageTemplateVersion({ vdom: pageVersion.vdom });
  };
  const handleGenerateUuid = () => {
    const uuid = nanoid();
    setGeneratedUuid(uuid);
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedUuid);
  };
  if (!pageVersion) return null;
  return (
    <Dialog
      contentStyle={{
        width: '80vw',
        minWidth: '80vw',
        overflow: 'hidden',
        height: '80vh',
        display: 'flex',
        flexDirection: 'column',
        gap: 0
      }}
      title={t('labels.advancedPageEditor')}
      Trigger={<Button>{t('labels.advancedPageEditor')}</Button>}>
      <div>
        <div className='grid grid-cols-2 gap-4'>
          <IDE
            onChange={handleChange}
            lang='json'
            value={JSON.stringify(pageVersion?.vdom || {}, undefined, 2)}
          />
          <RenderLayout pageVersion={pageVersion} forms={[]} />
        </div>
        <FormFooterAction>
          <Button type='button' onClick={handleGenerateUuid}>
            Generate id
          </Button>

          <code onClick={handleCopy}>{generatedUuid}</code>
          <SaveButton type='button' onClick={handleSave} />
        </FormFooterAction>
      </div>
    </Dialog>
  );
}
export default AdvancedPageEditor;
