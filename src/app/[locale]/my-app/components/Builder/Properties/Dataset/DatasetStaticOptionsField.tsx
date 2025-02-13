import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import Selectbox from '@/components/form/Selectbox';
import ExternalDataOptions from './ExternalDataOptions';
import StaticDataOptions from './StaticDataOptions';
import { ElementConfigProps, IVDOMNode } from '../../../interfaces';
import { useTranslations } from 'next-intl';
import { ChangeEvent, useMemo } from 'react';

type Props = {
  config: ElementConfigProps;
  selectedNode: IVDOMNode | null;
  onInputChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  collections: Record<string, any>;
};
function DatasetStaticOptionsField({
  config,
  selectedNode,
  onInputChange,
  collections
}: Props) {
  const tTemplate = useTranslations('TemplateSection');
  const optionsSourceTypes = useMemo(
    () => [
      {
        value: 'database',
        label: tTemplate('databaseOptions')
      },
      {
        value: 'static',
        label: tTemplate('staticOptions')
      },
      {
        value: 'template',
        label: tTemplate('template')
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <>
      <FormField>
        <FormLabel>{tTemplate('sourceOptions')}</FormLabel>
        <Selectbox
          name='optionsSourceType'
          value={
            selectedNode?.context?.dataset?.connexion?.optionsSourceType ||
            'static'
          }
          options={optionsSourceTypes}
          onChange={onInputChange}
        />
      </FormField>
      {selectedNode?.context?.dataset?.connexion?.optionsSourceType ===
      'database' ? (
        <ExternalDataOptions
          config={config}
          collections={collections}
          selectedNode={selectedNode}
        />
      ) : null}
      {selectedNode?.context?.dataset?.connexion?.optionsSourceType ===
      'static' ? (
        <StaticDataOptions config={config} selectedNode={selectedNode} />
      ) : null}
    </>
  );
}
export default DatasetStaticOptionsField;
