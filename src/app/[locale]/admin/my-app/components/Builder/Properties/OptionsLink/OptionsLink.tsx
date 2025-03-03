import { useProperties } from '../useProperties';
import { ElementConfigProps } from '../../../interfaces';
import { usePageBuilderStore } from '../../../stores/pagebuilder-store-provider';
import OptionsLinkBuilder from './OptionsLinkBuilder';

type Props = {
  config: ElementConfigProps;
};
function OptionsLink({ config }: Props) {
  const { value } = useProperties({ config });

  const onUpdateNodeProperty = usePageBuilderStore(
    (state) => state.onUpdateNodeProperty
  );
  return (
    <OptionsLinkBuilder
      value={value}
      config={config}
      onUpdate={onUpdateNodeProperty}
    />
  );
}
export default OptionsLink;
