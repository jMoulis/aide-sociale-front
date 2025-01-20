import Button from '@/components/buttons/Button';
import {
  IPageTemplateVersion,
  IUserSummary
} from '@/lib/interfaces/interfaces';
import { IMasterTemplate } from '@/lib/TemplateBuilder/interfaces';
import client from '@/lib/mongo/initMongoClient';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { generatePageVersion } from './generators';
import MasterTemplateForm from './MasterTemplateForm';
import { useEffect, useState } from 'react';
import { usePageBuilderStore } from './usePageBuilderStore';

type Props = {
  masterTemplate: IMasterTemplate;
  user: IUserSummary;
};
function MasterTemplateItem({
  masterTemplate: initialMasterTemplate,
  user
}: Props) {
  const [masterTemplate, setMasterTemplate] = useState<IMasterTemplate>(
    initialMasterTemplate
  );
  const setSelectMasterTemplate = usePageBuilderStore(
    (state) => state.setSelectMasterTemplate
  );
  const selectedMasterTemplate = usePageBuilderStore(
    (state) => state.selectedMasterTemplate
  );

  const addTemplateVersion = usePageBuilderStore(
    (state) => state.addTemplateVersion
  );
  // const handleCreatePageVersion = async (masterTemplateId: string) => {
  //   const { data } = await client.list<IPageTemplateVersion>(
  //     ENUM_COLLECTIONS.PAGE_TEMPLATES,
  //     {
  //       masterTemplateId
  //     }
  //   );
  //   setTemplateVersions(data || []);
  // };

  useEffect(() => {
    setMasterTemplate(initialMasterTemplate);
  }, [initialMasterTemplate]);

  const handleCreateVersion = async () => {
    let newVersion = 1;
    try {
      const { data: lastPageTemplateVersion } =
        await client.get<IPageTemplateVersion>(
          ENUM_COLLECTIONS.PAGE_TEMPLATES,
          {
            masterTemplateId: masterTemplate._id
          },
          { sort: { version: -1 } }
        );
      newVersion = (lastPageTemplateVersion?.version || newVersion) + 1;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('error', error);
    }

    const pageTemplateVersion: IPageTemplateVersion = generatePageVersion(
      masterTemplate._id,
      newVersion
    );
    await client.create<IPageTemplateVersion>(
      ENUM_COLLECTIONS.PAGE_TEMPLATES,
      pageTemplateVersion
    );
    addTemplateVersion(pageTemplateVersion);
  };

  return (
    <li>
      <div className='flex items-center'>
        <Button
          className={`w-full ${
            selectedMasterTemplate?._id === masterTemplate._id
              ? 'bg-black text-white'
              : ''
          }`}
          onClick={() => setSelectMasterTemplate(masterTemplate)}>
          {masterTemplate.title}
        </Button>
        <MasterTemplateForm
          initialMasterTemplate={masterTemplate}
          user={user}
        />
      </div>
      <Button onClick={handleCreateVersion}>Create version</Button>
    </li>
  );
}
export default MasterTemplateItem;
