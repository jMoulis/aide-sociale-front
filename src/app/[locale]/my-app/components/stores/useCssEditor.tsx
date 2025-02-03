import { useCallback, useMemo, useState } from 'react';
import { usePageBuilderStore } from './pagebuilder-store-provider';
import { generateStylesheet, generateTailwind } from '../../actions';
import { useTranslations } from 'next-intl';

type Props = {
  pathStorage: string | null;
  stylesheetName: string | null;
};
export const useCssEditor = ({ pathStorage, stylesheetName }: Props) => {
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [css, setCss] = useState('');
  const setWebsite = usePageBuilderStore((state) => state.setWebsite);
  const t = useTranslations('WebsiteSection');
  const [isDirty, setIsDirty] = useState(false);
  const website = usePageBuilderStore((state) => state.website);

  const organizationId = usePageBuilderStore((state) => state.organizationId);
  const onChangeStyle = useCallback(
    async (style: string, callback: (style: string) => void) => {
      callback(style);
      setCss(style);
      setIsDirty(true);
    },
    []
  );

  const onOpenChange = useCallback(
    (status: boolean) => {
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
    },
    [isDirty]
  );

  const handleSubmit = useCallback(async () => {
    if (!website || !organizationId) return;
    if (!pathStorage || !stylesheetName) return;

    try {
      setIsSaving(true);
      const pathRoot = `websites/${organizationId}/${website._id}`;
      const pathStoragePath = `${pathRoot}/${pathStorage}`;
      const { pageUrl } = await generateStylesheet(css, pathStoragePath);

      const previousStylesheets = website.stylesheets || [];
      const updatedStylesheets = previousStylesheets;
      const stylesheetIndex = previousStylesheets.findIndex(
        (stylesheet) => stylesheet.name === stylesheetName
      );
      if (stylesheetIndex !== -1) {
        updatedStylesheets[stylesheetIndex] = {
          ...previousStylesheets[stylesheetIndex],
          uri: pageUrl!
        };
      } else {
        updatedStylesheets.push({ name: stylesheetName, uri: pageUrl! });
      }

      const updatedWebsite = { ...website, stylesheets: updatedStylesheets };
      setWebsite(updatedWebsite);
      setIsSaving(false);
      setIsDirty(false);
      generateTailwind(
        website.tailwindConfig || '',
        organizationId,
        updatedWebsite
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setIsSaving(false);
    }
  }, [website, organizationId, pathStorage, css, setWebsite, stylesheetName]);
  return {
    onSubmit: handleSubmit,
    onChangeStyle,
    onOpenChange,
    open,
    isSaving,
    isDirty,
    title: t('pageForm.editCss'),
    websiteId: useMemo(() => website?._id, [website])
  };
};
