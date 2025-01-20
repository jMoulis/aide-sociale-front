import { IUserSummary } from '@/lib/interfaces/interfaces';
import MasterTemplateItem from './MasterTemplateItem';
import { usePageBuilderStore } from './usePageBuilderStore';

type Props = {
  user: IUserSummary;
};
function MasterTemplatesList({ user }: Props) {
  const masterTemplates = usePageBuilderStore((state) => state.masterTemplates);
  return (
    <ul>
      {masterTemplates.map((masterTemplate) => {
        return (
          <MasterTemplateItem
            key={masterTemplate._id}
            masterTemplate={masterTemplate}
            user={user}
          />
        );
      })}
    </ul>
  );
}
export default MasterTemplatesList;
