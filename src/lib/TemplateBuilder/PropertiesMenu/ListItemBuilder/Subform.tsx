import { useMongoUser } from '@/lib/mongo/MongoUserContext/MongoUserContext';
import { useTemplateBuilder } from '../../TemplateBuilderContext';
import { IFormTemplate } from '../../interfaces';
import { v4 } from 'uuid';
import { useEffect, useMemo, useState } from 'react';
import client from '@/lib/mongo/initMongoClient';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { getUserSummary } from '@/lib/utils/utils';

function Subform() {
  const user = useMongoUser();
  const [_subform, setSubform] = useState<IFormTemplate | null>(null);
  const organizationId = user?.organizationId || '';
  const { template, setTemplate } = useTemplateBuilder();
  const excerptUser = useMemo(
    () => (user ? getUserSummary(user) : null),
    [user]
  );

  useEffect(() => {
    if (!excerptUser) return;

    if (template.templateListItem?._id) {
      client
        .get<IFormTemplate>(ENUM_COLLECTIONS.TEMPLATES, {
          _id: template.templateListItem._id
        })
        .then(({ data }) => {
          setSubform(data);
        });
      return;
    } else {
      const newVersionTemplateId = v4();
      const subTemplate: IFormTemplate = {
        _id: newVersionTemplateId,
        version: 1,
        published: false,
        forceUpdate: false,
        hasBeenPublished: false,
        createdAt: new Date(),
        createdBy: excerptUser,
        changedBy: excerptUser,
        organizationId,
        title: '',
        blocks: [],
        masterId: template.masterId,
        parentsTemplateIds: [template._id],
        templateListItem: null
      };
      setSubform(subTemplate);
    }
  }, [
    template.masterId,
    template.templateListItem,
    template._id,
    excerptUser,
    organizationId
  ]);

  const _handleSave = async (upsertedTemplate: IFormTemplate | null) => {
    if (!upsertedTemplate) return;
    setTemplate((prev) => ({
      ...prev,
      templateListItem: {
        _id: upsertedTemplate._id,
        title: upsertedTemplate.title,
        version: upsertedTemplate.version
      }
    }));
  };

  const _availableFields = useMemo(
    () => template.blocks.flatMap((block) => block.fields),
    [template.blocks]
  );

  if (!excerptUser) return null;

  return <span>Subform</span>;
  // return (
  //   <TemplateBuilderProvider
  //     organizationId={organizationId}
  //     excerptUser={excerptUser}
  //     initialTemplate={subform}
  //     mode='light'
  //     availableFields={availableFields}>
  //     <div className='h-[80vh] w-[90vw]'>
  //       <TemplateBuilder onSave={handleSave} formId='sub-form-template' />
  //     </div>
  //   </TemplateBuilderProvider>
  // );
}
export default Subform;
