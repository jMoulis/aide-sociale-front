import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { TabsTrigger } from '@/components/ui/tabs';

const TabsTriggerComponent = ({
  props,
  children
}: PropsWithChildrenAndContext) => {
  const { ...rest } = props || {};
  return (
    <TabsTrigger value={rest.value} {...rest}>
      {children}
    </TabsTrigger>
  );
};

export default TabsTriggerComponent;
