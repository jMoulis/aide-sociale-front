import { ChangeEvent, useCallback, useMemo } from 'react';
import { ElementConfigProps, IVDOMNode } from '../../../interfaces';

import { findNodeById } from '../../../utils';
import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import TextareaStyleInput from './TextareaStyleInput';
import { useTranslations } from 'next-intl';
import IDE from '../IDE';
import { Drawer } from '@/components/drawer/Drawer';
import Button from '@/components/buttons/Button';
import { usePageBuilderStore } from '../../../stores/pagebuilder-store-provider';
import { useCssLive } from '../../../stores/useCssLive';
import { generateTailwind } from '@/app/[locale]/admin/my-app/actions';

const defaultCssSelectorScope = (css: string) => `
/* Add your CSS here */
/* Don't remove the .default class */
.default {\n${css}\n}`;

function unparseStyle(style: Record<string, string>): string {
  const css = Object.entries(style)
    .map(([key, value]) => {
      const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `${kebabKey}: ${value};`;
    })
    .join('\n');
  return defaultCssSelectorScope(css);
}

function parseCSSWithDummy(css: string): Record<string, string> {
  // Wrap CSS in a dummy class to make it valid for parsing
  const wrappedCSS = `.dummy { ${css} }`;

  const match = wrappedCSS.match(/\.default\s*\{([^}]*)\}/);
  if (!match) return {};

  const rules = match[1]
    .split(';')
    .map((rule) => rule.trim())
    .filter((rule) => rule)
    .map((rule) => {
      // remove double quotes
      rule = rule.replace(/"/g, '');
      const [property, value] = rule.split(':').map((str) => str.trim());
      if (!property || !value) return null;
      const camelCasedProperty = property.replace(/-([a-z])/g, (_, letter) =>
        letter.toUpperCase()
      );

      return [camelCasedProperty, value];
    })
    .filter(Boolean) as [string, string][];

  return Object.fromEntries(rules);
}

type Props = {
  config: ElementConfigProps;
};

function Styling({ config }: Props) {
  const t = useTranslations('TemplateSection');

  const selectedNodeId = usePageBuilderStore(
    (state) => state.selectedNode?._id
  );
  const setTailwindStyles = useCssLive((state) => state.setTailwindStyles);
  const classSelectors = useCssLive((state) => state.classSelectors);
  const onSavePageTemplate = usePageBuilderStore(
    (state) => state.onSavePageTemplate
  );
  const website = usePageBuilderStore((state) => state.website);

  const vdom = usePageBuilderStore(
    (state) => state.pageVersion?.vdom || ({} as IVDOMNode)
  );
  const onUpdateNodeProperty = usePageBuilderStore(
    (state) => state.onUpdateNodeProperty
  );

  const selectedNode = useMemo(
    () => (selectedNodeId ? findNodeById(vdom, selectedNodeId) : null),
    [vdom, selectedNodeId]
  );

  const prevValue = useMemo(
    () =>
      selectedNode?.context ||
      ({
        styling: {
          style: {},
          className: ''
        }
      } as any),
    [selectedNode?.context]
  );

  const unparseValue = useMemo(
    () => unparseStyle(prevValue?.styling?.style || {}),
    [prevValue?.styling?.style]
  );
  const handleChangeStyle = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    onUpdateNodeProperty(
      {
        styling: {
          ...prevValue.styling,
          className: value
        }
      },
      config.context
    );
    if (website) {
      const elementClasses = (prevValue.className || '').split(' ') as string[];
      const isMissingClass = elementClasses.some(
        (cls) => !classSelectors.includes(cls)
      );
      if (isMissingClass) {
        setTailwindStyles(website, value);
      }
    }
  };

  const handleOnSpaceHit = async () => {
    if (website) {
      const elementClasses = (prevValue.className || '').split(' ') as string[];
      const isMissingClass = elementClasses.some(
        (cls) => !classSelectors.includes(cls)
      );
      await onSavePageTemplate();
      if (isMissingClass) {
        generateTailwind(
          website.tailwindConfig || '',
          website.organizationId,
          website
        );
      }
    }
  };

  const handleInlineStyleChange = useCallback((value?: string) => {
    onUpdateNodeProperty(
      {
        styling: {
          ...prevValue.styling,
          style: value ? parseCSSWithDummy(value) : {}
        }
      },
      config.context
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <FormField>
        <FormLabel className='block'>
          <span className='text-gray-700'>{t('classNames')}</span>
          <TextareaStyleInput
            onSpaceHit={handleOnSpaceHit}
            value={prevValue.styling?.className || ''}
            onChange={handleChangeStyle}
          />
        </FormLabel>
      </FormField>
      <FormField>
        <FormLabel>
          <span className='text-gray-700'> {t('inlineStyle')}</span>
        </FormLabel>
        <Drawer
          side='left'
          Trigger={<Button>{t('editor')}</Button>}
          title='Inline Style'>
          <div className='w-[400px]'>
            <IDE
              value={unparseValue || defaultCssSelectorScope('')}
              onChange={handleInlineStyleChange}
            />
          </div>
        </Drawer>
      </FormField>
    </>
  );
}
export default Styling;
