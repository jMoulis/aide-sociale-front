import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

type Props = {
  trigger: React.ReactNode;
  children: React.ReactNode;
};
function TooltipInformation({ trigger, children }: Props) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{trigger}</TooltipTrigger>
        <TooltipContent>
          <div>{children}</div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default TooltipInformation;
