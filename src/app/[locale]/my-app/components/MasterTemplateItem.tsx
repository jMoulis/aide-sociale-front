import Button from '@/components/buttons/Button';
import {
  IPageTemplateVersion,
  IUserSummary
} from '@/lib/interfaces/interfaces';
import { IMasterTemplate } from '@/lib/TemplateBuilder/interfaces';
import client from '@/lib/mongo/initMongoClient';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { generatePageVersion } from './generators';
import MasterTemplateForm from '../../admin/templates/components/MasterTemplateForm';
import { useEffect, useState } from 'react';

type Props = {
  masterTemplate: IMasterTemplate;
  onSelectMasterTemplate: (masterTemplate: IMasterTemplate) => void;
  onCreatePageVersionSuccess: (masterTemplateId: string) => void;
  user: IUserSummary;
  organizationId: string;
};
function MasterTemplateItem({
  masterTemplate: initialMasterTemplate,
  onSelectMasterTemplate,
  onCreatePageVersionSuccess,
  organizationId,
  user
}: Props) {
  const [masterTemplate, setMasterTemplate] = useState<IMasterTemplate>(
    initialMasterTemplate
  );
  useEffect(() => {
    setMasterTemplate(initialMasterTemplate);
  }, [initialMasterTemplate]);

  const handleCreateVersion = async () => {
    let newVersion = 1;
    if (masterTemplate.latestVersion !== 0) {
      const { data: lastVersion } = await client.get<IPageTemplateVersion>(
        ENUM_COLLECTIONS.PAGE_TEMPLATES,
        {
          masterTemplateId: masterTemplate._id
        },
        { sort: { version: -1 } }
      );

      if (lastVersion) {
        newVersion = lastVersion.version + 1;
      }
    }
    const version: IPageTemplateVersion = generatePageVersion(
      masterTemplate._id,
      newVersion
    );
    await client.create<IPageTemplateVersion>(
      ENUM_COLLECTIONS.PAGE_TEMPLATES,
      version
    );
    onCreatePageVersionSuccess(masterTemplate._id);
  };

  return (
    <li key={masterTemplate._id}>
      <div className='flex items-center'>
        <Button onClick={() => onSelectMasterTemplate(masterTemplate)}>
          {masterTemplate.title}
        </Button>
        <MasterTemplateForm
          initialMasterTemplate={masterTemplate}
          onSubmit={(updatedMasterTemplate) =>
            setMasterTemplate(updatedMasterTemplate)
          }
          organizationId={organizationId}
          user={user}
        />
      </div>
      <Button onClick={handleCreateVersion}>Create version</Button>
    </li>
  );
}
export default MasterTemplateItem;
