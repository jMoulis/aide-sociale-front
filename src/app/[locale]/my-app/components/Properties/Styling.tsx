import { ChangeEvent, useMemo } from 'react';
import { ElementConfigProps, IVDOMNode } from '../interfaces';
import { usePageBuilderStore } from '../usePageBuilderStore';
import { findNodeById } from '../utils';
import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import Button from '@/components/buttons/Button';
import { generateCss } from '../../actions';
import Textarea from '@/components/form/Textarea';

type Props = {
  config: ElementConfigProps;
  organizationId: string;
};
function Styling({ config, organizationId }: Props) {
  const selectedNodeId = usePageBuilderStore((state) => state.selectedNodeId);
  const vdom = usePageBuilderStore(
    (state) => state.pageVersion?.vdom || ({} as IVDOMNode)
  );
  const onUpdateNodeProperty = usePageBuilderStore(
    (state) => state.onUpdateNodeProperty
  );
  const pageId = usePageBuilderStore((state) => state.pageVersion?._id);

  const selectedNode = useMemo(
    () => (selectedNodeId ? findNodeById(vdom, selectedNodeId) : null),
    [vdom, selectedNodeId]
  );
  const prevValue = useMemo(
    () => selectedNode?.props?.[config.propKey] || '',
    [config.propKey, selectedNode?.props]
  );

  const handleGenerateCss = async () => {
    await generateCss(vdom, pageId as string, organizationId);
    const reloadCSS = () => {
      const link = document.querySelector(
        'link[title="dynamic-css"]'
      ) as HTMLLinkElement | null;
      if (!link) return;
      link.href = `/styles/${organizationId}/page-${pageId}.css?timestamp=${new Date().getTime()}`; // Cache-busting
    };
    reloadCSS();
  };
  const handleChangeStyle = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    const payload = {
      ...prevValue,
      [name]: value
    };
    onUpdateNodeProperty(config.propKey, payload);
  };

  return (
    <FormField>
      <FormLabel className='block'>
        <span className='text-gray-700'>Class names</span>
        <Textarea
          name='className'
          value={prevValue.className || ''}
          onChange={handleChangeStyle}
        />
      </FormLabel>
      <Button onClick={handleGenerateCss}>Generate</Button>
    </FormField>
  );
}
export default Styling;
