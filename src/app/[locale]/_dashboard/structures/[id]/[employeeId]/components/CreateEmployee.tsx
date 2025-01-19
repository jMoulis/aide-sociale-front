import Dialog from '@/components/dialog/Dialog';
import { IEmployee } from '@/lib/interfaces/interfaces';
import EmployeeForm from './EmployeeForm';
import { useTranslations } from 'next-intl';
import Button from '@/components/buttons/Button';

type Props = {
  initialEmployee: IEmployee;
};
function CreateEmployee({ initialEmployee }: Props) {
  const t = useTranslations('UserSection');

  return (
    <Dialog
      title={t('create.action')}
      Trigger={<Button>{t('create.action')}</Button>}>
      <EmployeeForm initialEmployee={initialEmployee} />
    </Dialog>
  );
}
export default CreateEmployee;
