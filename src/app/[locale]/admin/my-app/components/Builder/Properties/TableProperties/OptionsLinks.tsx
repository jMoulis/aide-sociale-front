import { useProperties } from '../useProperties';
import { ElementConfigProps } from '../../../interfaces';
import { usePageBuilderStore } from '../../../stores/pagebuilder-store-provider';
import OptionsLinkBuilder from '../OptionsLink/OptionsLinkBuilder';
import { ITableField } from '@/lib/interfaces/interfaces';

type Props = {
  config: ElementConfigProps;
  field: ITableField;
  onUpdateField: (field: ITableField) => void;
};
function OptionsLink({ config, field, onUpdateField }: Props) {
  const { value } = useProperties({ config });

  console.log(value);
  const onUpdateNodeProperty = usePageBuilderStore(
    (state) => state.onUpdateNodeProperty
  );
  const handleUpdateOptions = (
    value: Record<string, any>,
    isContext: boolean,
    rootParams?: boolean
  ) => {
    const linkAttributes = value[config.propKey];
    const updatedField = {
      ...field,
      link: linkAttributes
    };
    onUpdateField(updatedField);
  };
  return (
    <OptionsLinkBuilder
      value={field?.link || []}
      config={config}
      onUpdate={handleUpdateOptions}
    />
  );
}
export default OptionsLink;
