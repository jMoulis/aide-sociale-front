import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import Button from '@/components/buttons/Button';
import ChildrenDndWrapper from './ChildrenDndWrapper';
import { useCallbackQueryTrigger } from '../useCallbackQueryTrigger';

function ButtonComponent({
  props,
  children,
  context,
  dndChildrenContainerRef
}: PropsWithChildrenAndContext) {
  const { executeQuery } = useCallbackQueryTrigger();
  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (context.isBuilderMode && typeof props.onClick === 'function') {
      props.onClick(event);
      return;
    }
    const buttonType = props.type;
    if (buttonType !== 'submit') {
      event.preventDefault();
      executeQuery(context);
    }
  };
  return (
    <Button {...props} onClick={handleClick}>
      <ChildrenDndWrapper ref={dndChildrenContainerRef}>
        {children}
      </ChildrenDndWrapper>
    </Button>
  );
}

export default ButtonComponent;
