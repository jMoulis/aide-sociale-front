import { getServerSideCurrentUserOrganizationId } from '@/lib/utils/auth/serverUtils';

type Props = {
  params: Promise<{ employeeId: string }>;
};
export default async function EmployeesPage({ params }: Props) {
  const { employeeId } = await params;
  const _organizationId = await getServerSideCurrentUserOrganizationId();

  return <div>{employeeId}</div>;
}
