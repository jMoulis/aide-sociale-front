import client from '@/lib/mongo/initMongoClient';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { FormEvent, memo, useCallback } from 'react';
import { toast } from '@/lib/hooks/use-toast';
import { useTranslations } from 'next-intl';
import DeleteButtonWithConfirmation from '@/components/buttons/DeleteButtonWithConfirmation';
import { IRessource } from '@/lib/interfaces/interfaces';
import { toastError } from '@/lib/toast/toastError';

type Props = {
  ressource: IRessource;
};

const DeleteRessource = memo(({ ressource }: Props) => {
  const t = useTranslations('RoleSection.ressource');

  const handleDelete = useCallback(
    async (
      event:
        | React.MouseEvent<HTMLSpanElement, MouseEvent>
        | FormEvent<HTMLFormElement>
    ) => {
      event.stopPropagation();
      if (ressource._id) {
        try {
          await client.delete(ENUM_COLLECTIONS.RESSOURCES, ressource._id);
          toast({
            title: t('delete.action'),
            description: t('delete.success'),
            variant: 'success'
          });
        } catch (error: any) {
          toast(toastError(t, 'delete.action', 'delete.error', error));
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ressource._id]
  );

  return (
    <DeleteButtonWithConfirmation
      title={t('delete.title')}
      deleteDescription={t('delete.description')}
      deleteActionText={t('delete.action')}
      buttonActionText={t('delete.action')}
      onDelete={handleDelete}
    />
  );
});
DeleteRessource.displayName = 'DeleteRessource';
export default DeleteRessource;
