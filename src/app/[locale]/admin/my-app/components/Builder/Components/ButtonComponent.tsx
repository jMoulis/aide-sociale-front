import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import Button from '@/components/buttons/Button';
import { useCallbackQueryTrigger } from '../useCallbackQueryTrigger';

function ButtonComponent({
  props,
  children,
  context
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
      {children}
    </Button>
  );
}

export default ButtonComponent;
