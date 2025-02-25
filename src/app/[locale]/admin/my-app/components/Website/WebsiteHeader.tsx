import { IWebsite } from '@/lib/interfaces/interfaces';
import { faCog } from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import WebsiteForm from './WebsiteForm';
import Dialog from '@/components/dialog/Dialog';
import Button from '@/components/buttons/Button';
import TailwindConfig from './TailwindConfig';
import { useTranslations } from 'next-intl';
import { usePageBuilderStore } from '../stores/pagebuilder-store-provider';
import { useState } from 'react';
import { PublishedDot } from '../PublishedDot';

type Props = {
  website: IWebsite;
  create: boolean;
};
function WebsiteHeader({ create, website }: Props) {
  const t = useTranslations('GlobalSection.actions');
  const tWebsite = useTranslations('WebsiteSection');
  const setWebsite = usePageBuilderStore((state) => state.setWebsite);
  const onSaveWebsite = usePageBuilderStore((state) => state.onSaveWebsite);
  const [saving, setSaving] = useState(false);

  const handlePublish = async () => {
    try {
      setSaving(true);
      setWebsite({ ...website, published: true });
      await onSaveWebsite(false, tWebsite);
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className='flex gap-2'>
      <Dialog
        title='Website'
        Trigger={
          <Button>
            <span>{website?.name}</span>
            <FontAwesomeIcon icon={faCog} />
          </Button>
        }>
        <WebsiteForm create={create} />
        <TailwindConfig />
      </Dialog>
      <Button onClick={handlePublish} disabled={saving} loading={saving}>
        {t('publish')}
        {website.published ? <PublishedDot /> : null}
      </Button>
    </div>
  );
}
export default WebsiteHeader;
