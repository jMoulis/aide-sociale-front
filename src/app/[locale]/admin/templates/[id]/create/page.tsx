import { IFormTemplate } from '@/lib/TemplateBuilder/interfaces';
import {
  getMongoUser,
  getServerSideCurrentUserOrganizationId
} from '@/lib/utils/auth/serverUtils';
import { getUserSummary } from '@/lib/utils/utils';
import { v4 } from 'uuid';

type Props = {
  params: Promise<{ [key: string]: string }>;
};
export default async function TemplatePage({ params }: Props) {
  const { id } = await params;

  const organizationId = await getServerSideCurrentUserOrganizationId();
  const mongoUser = await getMongoUser();

  const excerptUser = getUserSummary(mongoUser);

  const newVersionTemplateId = v4();
  const _template: IFormTemplate = {
    _id: newVersionTemplateId,
    version: 1,
    published: false,
    forceUpdate: false,
    hasBeenPublished: false,
    createdAt: new Date(),
    createdBy: excerptUser,
    changedBy: excerptUser,
    organizationId: organizationId,
    title: '',
    blocks: [],
    masterId: id,
    templateListItem: null
  };
  return (
    <>
      {/* <TemplateBuilderProvider
       organizationId={organizationId}
       excerptUser={excerptUser}
       initialTemplate={template}>
       <TemplateBuilder />
     </TemplateBuilderProvider> */}
    </>
  );
}
