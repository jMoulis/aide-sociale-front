import { IPageTemplateVersion } from '@/lib/interfaces/interfaces';
import Stores from '../../Pages/Stores/Stores';

type Props = {
  page: IPageTemplateVersion;
};
function StoresTab({ page }: Props) {
  return (
    <div className='border-r p-4 flex flex-col flex-1'>
      <Stores page={page} />
    </div>
  );
}
export default StoresTab;
