import clientMongoServer from '@/lib/mongo/initMongoServer';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import TemplateMasters from './components/TemplateMasters';
import {
  getMongoUser,
  getServerSideCurrentUserOrganizationId
} from '@/lib/utils/auth/serverUtils';
import { IMasterTemplate } from '@/lib/TemplateBuilder/interfaces';
import { getUserSummary } from '@/lib/utils/utils';

export default async function TeampltePage() {
  const organizationId = await getServerSideCurrentUserOrganizationId();
  const user = await getMongoUser();

  const { data: templates } = await clientMongoServer.list<IMasterTemplate>(
    ENUM_COLLECTIONS.TEMPLATES_MASTER,
    {
      organizationId
    }
  );

  return (
    <TemplateMasters
      serverTemplates={templates || []}
      organizationId={organizationId}
      user={getUserSummary(user)}
    />
  );
}
