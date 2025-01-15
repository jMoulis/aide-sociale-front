'use client';

import { IMenu, IRessource } from '@/lib/interfaces/interfaces';
import { isValidJSON } from '@/lib/utils/utils';
import { useCallback, useState } from 'react';
import RessourceForm from '../../components/RessourceForm';
import MenusBuilder from '../../components/MenusBuilder/MenusBuilder';
import { v4 } from 'uuid';
import client from '@/lib/mongo/initMongoClient';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { toast } from '@/lib/hooks/use-toast';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { ENUM_APP_ROUTES } from '@/lib/interfaces/enums';

type Props = {
  initialRessource: IRessource | null;
  organizationId: string;
};
function PageStudio({ initialRessource, organizationId }: Props) {
  const defaultRessource: IRessource = {
    _id: v4(),
    name: '',
    description: '',
    mandatoryPermissions: [],
    menus: [],
    route: '',
    createdAt: new Date()
  };
  const t = useTranslations('RoleSection');
  const [ressource, setRessource] = useState<IRessource>(
    initialRessource || defaultRessource
  );
  const router = useRouter();

  const handleSave = useCallback(
    async (updatedRessource: IRessource) => {
      try {
        if (initialRessource?._id) {
          await client.update<IRessource>(
            ENUM_COLLECTIONS.RESSOURCES,
            { _id: updatedRessource._id },
            { $set: updatedRessource }
          );
        } else {
          await client.create<IRessource>(ENUM_COLLECTIONS.RESSOURCES, {
            ...updatedRessource,
            organizationId
          });
          router.replace(
            `${ENUM_APP_ROUTES.RESSOURCES}/${updatedRessource._id}`
          );
        }
        toast({
          title: t('ressource.create.action'),
          description: t('ressource.create.success'),
          variant: 'success'
        });
      } catch (err: any) {
        let message = err.message;
        if (isValidJSON(err)) {
          const error = JSON.parse(err);
          message = error.error;
        }
        toast({
          title: t('ressource.create.action'),
          description: t.rich('ressource.create.error', {
            error: message,
            code: (chunks) => <code>{chunks}</code>
          }),
          variant: 'destructive'
        });
      }
    },
    [organizationId, initialRessource?._id, t, router]
  );

  const handleUpdateMenus = useCallback(
    (updatedMenus: IMenu[]) => {
      const updatedRessource = { ...ressource, menus: updatedMenus };
      setRessource(updatedRessource);
      handleSave(updatedRessource);
    },
    [handleSave, ressource]
  );

  return (
    <div className='flex'>
      <RessourceForm
        ressource={ressource}
        onUpdateRessource={setRessource}
        onSave={handleSave}
      />
      <MenusBuilder menus={ressource.menus} onUpdateMenus={handleUpdateMenus} />
    </div>
  );
}
export default PageStudio;
