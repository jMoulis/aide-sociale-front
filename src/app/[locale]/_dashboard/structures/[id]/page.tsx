import { getServerSideCurrentUserOrganizationId } from '@/lib/utils/auth/serverUtils';
import clientMongoServer from '@/lib/mongo/initMongoServer';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { IStructure } from '@/lib/interfaces/interfaces';
import StructureDetailPage from './components/StructureDetailPage';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ id: string }>;
};
export default async function DetailStructurePage({ params }: Props) {
  const { id } = await params;
  const organizationId = await getServerSideCurrentUserOrganizationId();
  const { data: previousStructure } = await clientMongoServer.get<IStructure>(
    ENUM_COLLECTIONS.STRUCTURES,
    { _id: id }
  );
  if (!previousStructure) {
    notFound();
  }
  return (
    <StructureDetailPage
      initialStructure={previousStructure}
      organizationId={organizationId}
    />
  );
}
