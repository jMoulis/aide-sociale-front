import { getServerSideCurrentUserOrganizationId } from '@/lib/utils/auth/serverUtils';

type Props = {
  params: Promise<{ id: string }>;
};
export default async function BenificiariesPage({ params }: Props) {
  const { id: _id } = await params;
  const _organizationId = await getServerSideCurrentUserOrganizationId();

  return <div>BenificiariesPage</div>;
}
