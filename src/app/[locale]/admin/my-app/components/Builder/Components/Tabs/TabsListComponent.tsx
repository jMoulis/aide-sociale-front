import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { cn } from '@/lib/utils/shadcnUtils';
import { TabsList } from '@/components/ui/tabs';

const TabsListComponent = ({
  props,
  children
}: PropsWithChildrenAndContext) => {
  const { className, ...rest } = props || {};
  return (
    <TabsList className={cn('', className)} {...rest}>
      {children}
    </TabsList>
  );
};

export default TabsListComponent;
