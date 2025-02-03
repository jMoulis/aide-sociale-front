import { buildPageTree } from '@/lib/utils/utils';
import { usePageBuilderStore } from '../stores/pagebuilder-store-provider';
import PageListItem from './PageListItem';

function PagesMenu() {
  const pages = usePageBuilderStore((state) => state.pages);
  const tree = buildPageTree(pages);
  return (
    <ul className='mt-2'>
      {tree.map((page) => (
        <li key={page._id}>
          <PageListItem page={page} add={true} />
          <ul className='ml-4'>
            {page.children.map((subPage) => (
              <li key={subPage._id} className='flex mt-2'>
                <PageListItem page={subPage} add={false} />
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
export default PagesMenu;
