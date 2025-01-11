import clientMongoServer from '@/lib/mongo/initMongoServer';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import Avatar from '@/components/Avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLock,
  faUnlock
} from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import {
  getMongoUser,
  getServerSideCurrentUserOrganizationId
} from '@/lib/utils/auth/serverUtils';
import {
  IFormTemplate,
  IMasterTemplate
} from '@/lib/TemplateBuilder/interfaces';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { ENUM_APP_ROUTES } from '@/lib/interfaces/enums';
import { sortArray } from '@/lib/utils/utils';
import { cn } from '@/lib/utils/shadcnUtils';
import MasterTemplateListItem from './components/MasterTemplateListItem';

type Props = {
  params: Promise<{ [key: string]: string }>;
};
export default async function TemplatePage({ params }: Props) {
  const { id } = await params;

  const organizationId = await getServerSideCurrentUserOrganizationId();
  const user = await getMongoUser();

  const { data: masterTemplate } = await clientMongoServer.get<IMasterTemplate>(
    ENUM_COLLECTIONS.TEMPLATES_MASTER,
    { _id: id }
  );
  const { data: templateVersions } =
    await clientMongoServer.list<IFormTemplate>(ENUM_COLLECTIONS.TEMPLATES, {
      masterId: id,
      organizationId
    });

  if (!masterTemplate) {
    notFound();
  }

  return (
    <div className='p-4'>
      <Link href={`${ENUM_APP_ROUTES.TEMPLATES}/${masterTemplate._id}/create`}>
        Create
      </Link>
      <MasterTemplateListItem
        masterTemplate={masterTemplate}
        user={user}
        organizationId={organizationId}
      />
      <div className='flex flex-wrap'>
        {sortArray(templateVersions || [], 'version', false).map(
          (templateVersion) => {
            const isEditable =
              !templateVersion.published && !templateVersion.hasBeenPublished;

            return (
              <Link
                key={templateVersion._id}
                className='h-fit'
                href={`${ENUM_APP_ROUTES.TEMPLATES}/${masterTemplate._id}/${templateVersion._id}`}>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <span>{templateVersion.title}</span>
                      <span className='text-xs ml-1 text-slate-500'>{`(v-${templateVersion.version})`}</span>
                      <FontAwesomeIcon icon={isEditable ? faUnlock : faLock} />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='flex flex-col'>
                      <span>{templateVersion.published && 'published'}</span>
                      <span>
                        {templateVersion.version ===
                          masterTemplate.latestVersion && 'latest'}
                      </span>
                      <span>
                        {templateVersion.createdAt
                          ? format(templateVersion.createdAt, 'dd/MM/yyyy')
                          : ''}
                      </span>
                    </div>
                    <div
                      className={cn(
                        'grid grid-cols-[40px,1fr] gap-2 items-center p-2 rounded-md cursor-pointer mb-1'
                      )}>
                      <Avatar
                        src={templateVersion.createdBy?.imageUrl}
                        alt={templateVersion.createdBy?.firstName || ''}
                      />
                      <span>{templateVersion.createdBy?.firstName}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          }
        )}
      </div>
    </div>
  );
}
