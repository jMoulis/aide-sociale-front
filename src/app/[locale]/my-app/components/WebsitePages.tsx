import { IPage, ITreePage } from '@/lib/interfaces/interfaces';
import client from '@/lib/mongo/initMongoClient';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { useEffect, useState } from 'react';
import PageListItem from './PageListItem';

type Props = {
  websiteId: string;
};
const WebsitePages = ({ websiteId }: Props) => {
  const [websitePages, setWebsitePages] = useState<ITreePage[]>([]);

  useEffect(() => {
    client.onSnapshotList<IPage>(
      ENUM_COLLECTIONS.PAGES,
      { websiteId },
      (incomingPages) => {
        function buildPageTree(pages: IPage[]): ITreePage[] {
          const pageMap = new Map<string, ITreePage>();
          pages.forEach((page) => {
            pageMap.set(page._id, { ...page, children: [] });
          });
          const tree: ITreePage[] = [];
          pages.forEach((page) => {
            if (page.parentId) {
              const parent = pageMap.get(page.parentId);
              if (parent) {
                parent.children.push(pageMap.get(page._id)!);
              }
            } else {
              tree.push(pageMap.get(page._id)!);
            }
          });

          return tree;
        }
        const tree = buildPageTree(incomingPages || []);
        setWebsitePages(tree);
      }
    );
  }, [websiteId]);

  return (
    <ul>
      {websitePages.map((page) => (
        <PageListItem page={page} key={page._id} />
      ))}
    </ul>
  );
};
export default WebsitePages;
