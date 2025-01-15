'use client';

import { IMasterTemplate } from '@/lib/TemplateBuilder/interfaces';
import { useState } from 'react';
import MasterTemplateForm from '../../components/MasterTemplateForm';
import { IUserSummary } from '@/lib/interfaces/interfaces';

type Props = {
  masterTemplate: IMasterTemplate;
  user: IUserSummary;
  organizationId: string;
  onSelect: (masterTemplate: IMasterTemplate) => void;
};
function MasterTemplateListItem({
  masterTemplate,
  user,
  organizationId,
  onSelect
}: Props) {
  const [template, setTemplate] = useState<IMasterTemplate>(masterTemplate);
  return (
    <div className='flex mb-2'>
      <span onClick={() => onSelect(template)}>{template.title}</span>
      <MasterTemplateForm
        initialMasterTemplate={template}
        onSubmit={(template) => setTemplate(template)}
        user={user}
        organizationId={organizationId}
      />
    </div>
  );
}
export default MasterTemplateListItem;
