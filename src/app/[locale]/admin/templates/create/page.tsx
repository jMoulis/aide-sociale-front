import TemplateBuilder from '@/lib/TemplateBuilder/TemplateBuilder';
import { TemplateBuilderProvider } from '@/lib/TemplateBuilder/TemplateBuilderContext';
import {
  getMongoUser,
  getServerSideCurrentUserOrganizationId
} from '@/lib/utils/auth/serverUtils';
import { getUserSummary } from '@/lib/utils/utils';

export default async function TemplatePage() {
  const organizationId = await getServerSideCurrentUserOrganizationId();
  const mongoUser = await getMongoUser();

  return (
    <TemplateBuilderProvider
      organizationId={organizationId}
      excerptUser={getUserSummary(mongoUser)}
      initialTemplate={null}>
      <TemplateBuilder />
    </TemplateBuilderProvider>
  );
}
