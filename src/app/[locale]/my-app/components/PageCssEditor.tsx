import { Drawer } from '@/components/drawer/Drawer';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Button from '@/components/buttons/Button';
import CssEditor from './Properties/CssEditor';
import FormFooterAction from '@/components/dialog/FormFooterAction';
import { IPage, IStylesheet } from '@/lib/interfaces/interfaces';
import { usePageBuilderStore } from './usePageBuilderStore';
import { generateStylesheet } from '../actions';
import SaveButton from '@/components/buttons/SaveButton';
import { toast } from '@/lib/hooks/use-toast';

type Props = {
  page: IPage;
  previousStylesheetUrl?: IStylesheet;
};

function PageCssEditor({ page, previousStylesheetUrl }: Props) {
  const [open, setOpen] = useState(false);
  const website = usePageBuilderStore((state) => state.website);
  const setWebsite = usePageBuilderStore((state) => state.setWebsite);
  const onSaveWebsite = usePageBuilderStore((state) => state.onSaveWebsite);
  const organizationId = usePageBuilderStore((state) => state.organizationId);
  const t = useTranslations('WebsiteSection');
  const [value, setValue] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (previousStylesheetUrl && open) {
      fetch(previousStylesheetUrl.uri)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          return res.text();
        })
        .then((css) => {
          setValue(css);
        })
        .catch((error) => {
          toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive'
          });
        });
      //
    }
  }, [previousStylesheetUrl, open]);

  const handleSubmitCss = async () => {
    if (!organizationId || !website) return;
    const { pageUrl } = await generateStylesheet(
      value,
      page._id,
      organizationId
    );
    const updatedStylesheets = website.stylesheets || [];

    const previousStylesheet = updatedStylesheets.find((stylesheet) => {
      return stylesheet.name === page.name;
    });

    if (!pageUrl) return;

    if (previousStylesheet) {
      updatedStylesheets.map((stylesheet) => {
        if (stylesheet.name === page.name) {
          stylesheet.uri = pageUrl;
        }
        return stylesheet;
      });
    } else {
      updatedStylesheets.push({ name: page.name, uri: pageUrl });
    }

    const updatedWebsite = {
      ...website,
      stylesheets: updatedStylesheets
    };
    setWebsite(updatedWebsite);
    onSaveWebsite(false, t);
    setIsDirty(false);
  };

  const handleChangeStyle = async (style: string) => {
    setValue(style);
    setIsDirty(true);
  };

  const handleOpenChange = (status: boolean) => {
    if (status) {
      setOpen(status);
      return;
    }
    if (!status && isDirty) {
      if (!confirm('Are you sure you want to discard changes?')) {
        return;
      } else {
        setOpen(status);
      }
    } else {
      setOpen(status);
    }
  };

  return (
    <Drawer
      title={t('pageForm.editCss')}
      side='left'
      open={open}
      onOpenChange={handleOpenChange}
      Trigger={<Button>CSS</Button>}>
      <CssEditor height='80vh' value={value} onUpdate={handleChangeStyle} />
      <FormFooterAction>
        <SaveButton type='button' onClick={handleSubmitCss} />
      </FormFooterAction>
    </Drawer>
  );
}
export default PageCssEditor;
