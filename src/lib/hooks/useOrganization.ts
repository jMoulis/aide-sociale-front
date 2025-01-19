import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export const useOrganization = () => {
  const { user } = useUser();
  const [organizationId, setOrganizationId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setOrganizationId(user.publicMetadata.organizationId || null);
  }, [user]);
  return organizationId;
};