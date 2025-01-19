'use client';

import { IMasterTemplate } from '@/lib/TemplateBuilder/interfaces';
import MasterTemplateForm from './MasterTemplateForm';
import { useEffect, useState } from 'react';
import { IUserSummary } from '@/lib/interfaces/interfaces';
import MasterTemplateItem from '@/app/[locale]/my-app/components/MasterTemplateItem';

type Props = {
  serverTemplates: IMasterTemplate[];
  user: IUserSummary;
  organizationId: string;
  onSubmit: (masters: IMasterTemplate[]) => void;
  onSelectMasterTemplate: (masterTemplate: IMasterTemplate) => void;
  onCreatePageVersionSuccess: (masterTemplateId: string) => void;
};
function TemplateMasters({
  serverTemplates,
  user,
  organizationId,
  onSubmit,
  onSelectMasterTemplate,
  onCreatePageVersionSuccess
}: Props) {
  const [masterTemplates, setMasterTemplates] =
    useState<IMasterTemplate[]>(serverTemplates);

  useEffect(() => {
    setMasterTemplates(serverTemplates);
  }, [serverTemplates]);

  const handleSubmit = (masterTemplate: IMasterTemplate, create: boolean) => {
    let updatedMasterTemplates: IMasterTemplate[] = masterTemplates;
    if (create) {
      updatedMasterTemplates = [...masterTemplates, masterTemplate];
      setMasterTemplates(updatedMasterTemplates);
    } else {
      updatedMasterTemplates = masterTemplates.map((template) =>
        template._id === masterTemplate._id ? masterTemplate : template
      );
      setMasterTemplates(updatedMasterTemplates);
    }
    console.log(updatedMasterTemplates);
    onSubmit(updatedMasterTemplates);
  };
  return (
    <div>
      <MasterTemplateForm
        onSubmit={handleSubmit}
        user={user}
        organizationId={organizationId}
      />
      <ul>
        {masterTemplates.map((masterTemplate) => {
          return (
            <MasterTemplateItem
              key={masterTemplate._id}
              masterTemplate={masterTemplate}
              onSelectMasterTemplate={onSelectMasterTemplate}
              onCreatePageVersionSuccess={onCreatePageVersionSuccess}
              user={user}
              organizationId={organizationId}
            />
          );
        })}
      </ul>
    </div>
  );
}
export default TemplateMasters;
