import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { useTranslations } from 'next-intl';
import { IDraftAlert } from '../interfaces';

type Props = {
  draftAlert: IDraftAlert | null;
  onOpenChange: (open: boolean) => void;
  onCreate: () => Promise<void>;
  onEdit: () => void;
};
function ExistingDraftAlert({
  draftAlert,
  onOpenChange,
  onCreate,
  onEdit
}: Props) {
  const t = useTranslations('TemplateSection.draftAlert');
  return (
    <AlertDialog open={!!draftAlert} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('title')}</AlertDialogTitle>
          <AlertDialogDescription>{t('description')}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel type='button'>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction type='button' onClick={onCreate}>
            {t('newVersion')}
          </AlertDialogAction>
          <AlertDialogAction type='button' onClick={onEdit}>
            {t('continue')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
export default ExistingDraftAlert;
