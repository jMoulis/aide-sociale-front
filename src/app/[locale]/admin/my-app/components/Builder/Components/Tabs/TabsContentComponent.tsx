import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { cn } from '@/lib/utils/shadcnUtils';
import { TabsContent } from '@/components/ui/tabs';

const TabsContentComponent = ({
  props,
  children
}: PropsWithChildrenAndContext) => {
  const { className, ...rest } = props || {};
  return (
    <TabsContent className={cn('', className)} {...rest}>
      {children}
    </TabsContent>
  );
};

export default TabsContentComponent;
