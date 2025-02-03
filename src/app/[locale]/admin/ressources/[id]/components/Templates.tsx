import { IPage, IUserSummary } from '@/lib/interfaces/interfaces';
import client from '@/lib/mongo/initMongoClient';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import {
  IFormTemplate,
  IMasterTemplate
} from '@/lib/TemplateBuilder/interfaces';
import { useCallback, useEffect, useState } from 'react';
import MasterTemplateListItem from '../../../templates/[id]/components/MasterTemplateListItem';
import TemplateListItem from './TemplateListItem';
import { removeObjectFields, sortArray } from '@/lib/utils/utils';
import { v4 } from 'uuid';
import Button from '@/components/buttons/Button';
import { TemplateBuilderProvider } from '@/lib/TemplateBuilder/TemplateBuilderContext';
import TemplateBuilder from '@/lib/TemplateBuilder/TemplateBuilder';
import { toastPromise } from '@/lib/toast/toastPromise';
import { useTranslations } from 'next-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';

type Props = {
  page: IPage;
  user: IUserSummary;
  organizationId: string;
  onUpdatePage: (page: IPage) => void;
};
function Templates({ page, user, organizationId }: Props) {
  const [master, setMaster] = useState<IMasterTemplate | null>(null);
  const [formTemplates, setFormTemplates] = useState<IFormTemplate[]>([]);
  const [_selectedMasterTemplate, setSelectedMasterTemplate] =
    useState<IMasterTemplate | null>(null);
  const [selectedTemplate, setSelectedTemplate] =
    useState<IFormTemplate | null>(null);
  const [create, setCreate] = useState<boolean>(false);
  const tTemplate = useTranslations('TemplateSection');

  useEffect(() => {
    if (page.masterTemplateId) {
      client
        .get<IMasterTemplate>(ENUM_COLLECTIONS.TEMPLATES_MASTER, {
          _id: page.masterTemplateId
        })
        .then(({ data }) => {
          if (!data) return;
          setMaster(data);
        });
    }
  }, [page.masterTemplateId]);

  const handleCreate = (masterTemplate: IMasterTemplate) => {
    setCreate(true);
    const template: IFormTemplate = {
      _id: v4(),
      version: 1,
      published: false,
      forceUpdate: false,
      hasBeenPublished: false,
      createdAt: new Date(),
      createdBy: user,
      changedBy: user,
      organizationId,
      title: '',
      blocks: [],
      masterId: masterTemplate._id,
      templateListItem: null
    };
    setSelectedMasterTemplate(masterTemplate);
    setSelectedTemplate(template);
  };

  const handleSaveTemplate = useCallback(
    async (template: IFormTemplate | null) => {
      if (!template) return;

      if (create) {
        await toastPromise(
          client.create<IFormTemplate>(ENUM_COLLECTIONS.TEMPLATES, template),
          tTemplate,
          'create'
        );
        setCreate(false);
      } else {
        await toastPromise(
          client.update<IFormTemplate>(
            ENUM_COLLECTIONS.TEMPLATES,
            { _id: template._id },
            { $set: removeObjectFields(template, ['_id']) }
          ),
          tTemplate,
          'edit'
        );
      }
    },
    [create, tTemplate]
  );

  const handleSelectMasterTemplate = (mTemplate: IMasterTemplate) => {
    setSelectedMasterTemplate(mTemplate);
    client
      .list<IFormTemplate>(ENUM_COLLECTIONS.TEMPLATES, {
        masterId: mTemplate._id
      })
      .then(({ data }) => {
        setFormTemplates(data || []);
      });
  };

  return (
    <div>
      <div className='flex items-center'>
        {selectedTemplate ? (
          <button onClick={() => setSelectedTemplate(null)}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
        ) : null}
        <div className='flex'>
          <h1>Templates</h1>
        </div>
      </div>

      {!selectedTemplate && master && (
        <div>
          <MasterTemplateListItem
            onSelect={handleSelectMasterTemplate}
            masterTemplate={master}
            user={user}
            organizationId={organizationId}
          />
          <Button onClick={() => handleCreate(master)}>Create version</Button>
          <div className='flex flex-wrap'>
            {sortArray(formTemplates || [], 'version', false).map(
              (templateVersion) => {
                const isEditable =
                  !templateVersion.published &&
                  !templateVersion.hasBeenPublished;
                return (
                  <TemplateListItem
                    key={templateVersion._id}
                    template={templateVersion}
                    isEditable={isEditable}
                    masterTemplate={master}
                    onSelectTemplate={setSelectedTemplate}
                  />
                );
              }
            )}
          </div>
        </div>
      )}

      {selectedTemplate ? (
        <>
          <TemplateBuilderProvider
            user={user}
            initialTemplate={selectedTemplate}
            onSave={handleSaveTemplate}>
            <TemplateBuilder />
          </TemplateBuilderProvider>
        </>
      ) : null}
    </div>
  );
}
export default Templates;
