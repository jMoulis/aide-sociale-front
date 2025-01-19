import { IVDOMNode } from './interfaces';
import { RenderElement } from './RenderElement';
import { usePageBuilderStore } from './usePageBuilderStore';

function Preview() {
  const pageVersion = usePageBuilderStore((state) => state.pageVersion);

  return (
    <div className='flex-1 p-4 overflow-auto'>
      <h2 className='text-xl font-bold mb-2'>Preview</h2>
      <RenderElement node={pageVersion?.vdom || ({} as IVDOMNode)} />
    </div>
  );
}
export default Preview;
