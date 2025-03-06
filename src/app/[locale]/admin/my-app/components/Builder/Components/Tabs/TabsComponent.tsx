import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { cn } from '@/lib/utils/shadcnUtils';
import { Tabs } from '@/components/ui/tabs';

const TabsComponent = ({ props, children }: PropsWithChildrenAndContext) => {
  const { className, value, ...rest } = props || {};
  return (
    <Tabs className={cn('', className)} {...rest} defaultValue={value}>
      {children}
    </Tabs>
  );
};

export default TabsComponent;
