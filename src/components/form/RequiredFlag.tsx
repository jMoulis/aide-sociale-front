import { useTranslations } from 'next-intl';

type Props = {
  label?: string;
};
function RequiredFlag({ label }: Props) {
  const t = useTranslations('GlobalSection');
  return (
    <span className='bg-blue-400 flex items-center h-4 ml-2 text-[9px] px-0.5 rounded'>
      {label ?? t('required')}
    </span>
  );
}
export default RequiredFlag;
