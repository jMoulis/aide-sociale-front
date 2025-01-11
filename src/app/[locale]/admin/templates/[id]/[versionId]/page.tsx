import clientMongoServer from '@/lib/mongo/initMongoServer';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { notFound } from 'next/navigation';
import { IFormTemplate } from '@/lib/TemplateBuilder/interfaces';
import TemplateBuilder from '@/lib/TemplateBuilder/TemplateBuilder';
import { TemplateBuilderProvider } from '@/lib/TemplateBuilder/TemplateBuilderContext';
import {
  getMongoUser,
  getServerSideCurrentUserOrganizationId
} from '@/lib/utils/auth/serverUtils';
import { getUserSummary } from '@/lib/utils/utils';

type Props = {
  params: Promise<{ [key: string]: string }>;
};

export default async function TemplateForm({ params }: Props) {
  const { versionId } = await params;

  const organizationId = await getServerSideCurrentUserOrganizationId();
  const mongoUser = await getMongoUser();

  const { data: template } = await clientMongoServer.get<IFormTemplate>(
    ENUM_COLLECTIONS.TEMPLATES,
    { _id: versionId }
  );

  if (!template) {
    notFound();
  }

  return (
    <>
      <TemplateBuilderProvider
        initialTemplate={template}
        excerptUser={getUserSummary(mongoUser)}
        organizationId={organizationId}>
        <TemplateBuilder />
      </TemplateBuilderProvider>
    </>
  );
}
