import client from '@/lib/mongo/initMongoServer';
import { notFound } from 'next/navigation';
import ErrorDefault from '@/app/[locale]/components/ErrorDefault';
import DetailRole from './components/DetailRole';
import { IRessource, IRole } from '@/lib/interfaces/interfaces';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';

type Props = {
  params: Promise<{ id: string }>;
};
async function ReoleDetailPage({ params }: Props) {
  const { id } = await params;

  const { data: role, error } = await client.get<IRole>(
    ENUM_COLLECTIONS.ROLES,
    {
      _id: id
    }
  );

  if (error) {
    return <ErrorDefault message={error} />;
  }

  if (!role) return notFound();

  const { data, error: ressourceError } = await client.list<IRessource>(
    ENUM_COLLECTIONS.RESSOURCES,
    {
      organizationId: role.organizationId
    }
  );

  return (
    <>
      <header className='p-3 bg-slate-200 mb-2'>
        <h1>{role.name}</h1>
      </header>
      <DetailRole
        role={role}
        ressources={data || []}
        error={ressourceError}
        roleId={role._id}
      />
    </>
  );
}

export default ReoleDetailPage;
