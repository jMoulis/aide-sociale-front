import { buildPageTree } from '@/lib/utils/utils';
import { usePageBuilderStore } from '../stores/pagebuilder-store-provider';
import PageListItem from './PageListItem';

function PagesMenu() {
  const pages = usePageBuilderStore((state) => state.pages);
  const tree = buildPageTree(pages);
  const website = usePageBuilderStore((state) => state.website);
  const organizationId = usePageBuilderStore((state) => state.organizationId);

  if (!website || !organizationId) return null;

  return (
    <ul className='mt-2'>
      {tree.map((page) => (
        <li key={page._id}>
          <PageListItem
            page={page}
            add={true}
            organizationId={organizationId}
            websiteId={website._id}
          />
        </li>
      ))}
    </ul>
  );
}
export default PagesMenu;
