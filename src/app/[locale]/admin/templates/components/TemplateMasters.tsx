'use client';

import { ENUM_APP_ROUTES } from '@/lib/interfaces/enums';
import { IMasterTemplate } from '@/lib/TemplateBuilder/interfaces';
import Link from 'next/link';
import MasterTemplateForm from './MasterTemplateForm';
import { useState } from 'react';
import { IUserSummary } from '@/lib/interfaces/interfaces';

type Props = {
  serverTemplates: IMasterTemplate[];
  user: IUserSummary;
  organizationId: string;
};
function FormTemplates({ serverTemplates, user, organizationId }: Props) {
  const [masterTemplates, setMasterTemplates] =
    useState<IMasterTemplate[]>(serverTemplates);

  const handleSubmit = (masterTemplate: IMasterTemplate, create: boolean) => {
    if (create) {
      setMasterTemplates([...masterTemplates, masterTemplate]);
    } else {
      setMasterTemplates(
        masterTemplates.map((template) =>
          template._id === masterTemplate._id ? masterTemplate : template
        )
      );
    }
  };
  return (
    <div>
      <ul>
        <MasterTemplateForm
          onSubmit={handleSubmit}
          user={user}
          organizationId={organizationId}
        />
        {masterTemplates.map((masterTemplate) => {
          return (
            <li key={masterTemplate._id}>
              <Link href={`${ENUM_APP_ROUTES.TEMPLATES}/${masterTemplate._id}`}>
                {masterTemplate.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
export default FormTemplates;
