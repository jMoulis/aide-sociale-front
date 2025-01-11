'use client';

import React, {
  createContext,
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { v4 as uuid, v4 } from 'uuid';
import {
  IFormTemplate,
  IFormBlock,
  IFormField,
  ENUM_FIELD_TYPE,
  BlockLayout,
  IMasterTemplate,
  TemplateDiff
} from './interfaces';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from '@/lib/hooks/use-toast';
import client from '@/lib/mongo/initMongoClient';
import merge from 'deepmerge';
import { diffTemplates } from './utils';
import { ENUM_COLLECTIONS } from '../mongo/interfaces';
import { ENUM_APP_ROUTES } from '../interfaces/enums';
import { slugifyFunction } from '../utils/utils';
import { ICollection, IUserSummary } from '../interfaces/interfaces';

export type Tab = 'template' | 'element' | 'history' | 'listItem';

interface FormBuilderContextValue {
  template: IFormTemplate;
  setTemplate: React.Dispatch<React.SetStateAction<IFormTemplate>>;
  onPublish: () => void;
  selectedTab: Tab;
  onSelectTab: (tab: Tab) => void;
  selectedBlockId: string | null;
  selectedFieldId: string | null;
  isEditable: boolean;
  mode?: 'light' | 'full';
  availableFields?: IFormField[];
  selectedCollection: ICollection | null;
  selectBlock: (blockId: string) => void;
  selectField: (blockId: string, fieldId: string) => void;
  clearSelection: () => void;
  onCreateNewVersion: () => Promise<void | {
    template: IFormTemplate;
    edit: () => void;
    create: () => Promise<void>;
  }>;
  onSave: (replace?: boolean) => Promise<IFormTemplate | void>;
  onFormSave: (
    event: FormEvent<HTMLFormElement>,
    replace: boolean,
    formId?: string
  ) => Promise<IFormTemplate | void>;
  addBlock: (layout: BlockLayout) => void;
  reorderBlock: (blockId: string, direction: 'up' | 'down') => void;
  deleteBlock: (blockId: string) => void;
  addFieldToBlock: (blockId: string, type: ENUM_FIELD_TYPE) => void;
  reorderField: (
    blockId: string,
    fieldId: string,
    direction: 'up' | 'down'
  ) => void;
  deleteField: (blockId: string, fieldId: string) => void;
  onSelectCollection: (collection: ICollection | null) => void;
  updateField: (
    blockId: string,
    fieldId: string,
    key: keyof IFormField,
    value: any
  ) => void;

  addOptionToField: (
    blockId: string,
    fieldId: string,
    optionValue: string
  ) => void;
  removeOptionFromField: (
    blockId: string,
    fieldId: string,
    optionIndex: number
  ) => void;
}

// Create our context
const FormBuilderContext = createContext<FormBuilderContextValue | null>(null);

// Create a custom hook for consuming our context
export function useTemplateBuilder() {
  const ctx = useContext(FormBuilderContext);
  if (!ctx) {
    throw new Error(
      'useTemplateBuilder must be used within a TemplateBuilderProvider'
    );
  }
  return ctx;
}

// Our Provider component
interface FormBuilderProviderProps {
  children: React.ReactNode;
  initialTemplate: IFormTemplate | null;
  excerptUser: IUserSummary;
  organizationId: string;
  availableFields?: IFormField[];
  mode?: 'light' | 'full';
}

export function TemplateBuilderProvider({
  children,
  initialTemplate,
  excerptUser,
  organizationId,
  availableFields,
  mode = 'full'
}: FormBuilderProviderProps) {
  const defaultTemplate: IFormTemplate = {
    title: '',
    blocks: [],
    createdBy: excerptUser,
    createdAt: new Date(),
    organizationId,
    _id: v4(),
    version: 1,
    templateListItem: null
  };
  const [template, setTemplate] = useState<IFormTemplate>(
    initialTemplate || defaultTemplate
  );

  useEffect(() => {
    if (initialTemplate) {
      setTemplate(initialTemplate);
    }
  }, [initialTemplate]);

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [selectedCollection, setSelectedCollection] =
    useState<ICollection | null>(null);
  const [selectedTab, setSelectedTab] = useState<Tab>('template');
  const router = useRouter();
  const t = useTranslations('TemplateSection');
  const selectBlock = (blockId: string) => {
    setSelectedBlockId(blockId);
    setSelectedFieldId(null); // Clear field selection
  };

  const isEditable = useMemo(
    () => !template.published && !template.hasBeenPublished,
    [template.published, template.hasBeenPublished]
  );
  const selectField = (blockId: string, fieldId: string) => {
    setSelectedBlockId(blockId);
    setSelectedFieldId(fieldId);
    setSelectedTab('element');
  };

  const clearSelection = () => {
    setSelectedBlockId(null);
    setSelectedFieldId(null);
  };

  // --- BLOCK actions ---
  const addBlock = useCallback((layout: BlockLayout) => {
    const newBlock: IFormBlock = {
      id: uuid(),
      layout,
      fields: [],
      title: ''
    };
    setTemplate((prev) => ({ ...prev, blocks: [...prev.blocks, newBlock] }));
    setTimeout(() => {
      setSelectedBlockId(newBlock.id);
    }, 0);
  }, []);

  const reorderBlock = useCallback(
    (blockId: string, direction: 'up' | 'down') => {
      setTemplate((prev) => {
        const blocks = [...prev.blocks];
        const index = blocks.findIndex((b) => b.id === blockId);
        if (index < 0) return prev;

        if (direction === 'up' && index > 0) {
          [blocks[index - 1], blocks[index]] = [
            blocks[index],
            blocks[index - 1]
          ];
        } else if (direction === 'down' && index < blocks.length - 1) {
          [blocks[index + 1], blocks[index]] = [
            blocks[index],
            blocks[index + 1]
          ];
        }
        return { ...prev, blocks };
      });
    },
    []
  );

  const deleteBlock = useCallback((blockId: string) => {
    setTemplate((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((b) => b.id !== blockId)
    }));
  }, []);

  // --- FIELD actions ---
  const addFieldToBlock = useCallback(
    (blockId: string, type: ENUM_FIELD_TYPE) => {
      const newField: IFormField = {
        id: v4(),
        name: '',
        label: '',
        type,
        required: false,
        options: [],
        description: ''
      };
      setTemplate((prev) => ({
        ...prev,
        blocks: prev.blocks.map((b) =>
          b.id === blockId ? { ...b, fields: [...b.fields, newField] } : b
        )
      }));
      setTimeout(() => {
        selectField(blockId, newField.id);
      }, 0);
    },
    []
  );

  const reorderField = useCallback(
    (blockId: string, fieldId: string, direction: 'up' | 'down') => {
      setTemplate((prev) => ({
        ...prev,
        blocks: prev.blocks.map((b) => {
          if (b.id !== blockId) return b;
          const idx = b.fields.findIndex((f) => f.id === fieldId);
          if (idx < 0) return b;

          const newFields = [...b.fields];
          if (direction === 'up' && idx > 0) {
            [newFields[idx - 1], newFields[idx]] = [
              newFields[idx],
              newFields[idx - 1]
            ];
          } else if (direction === 'down' && idx < newFields.length - 1) {
            [newFields[idx + 1], newFields[idx]] = [
              newFields[idx],
              newFields[idx + 1]
            ];
          }
          return { ...b, fields: newFields };
        })
      }));
    },
    []
  );

  const deleteField = useCallback((blockId: string, fieldId: string) => {
    setTemplate((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) => {
        if (b.id !== blockId) return b;
        return {
          ...b,
          fields: b.fields.filter((f) => f.id !== fieldId)
        };
      })
    }));
  }, []);

  const updateField = useCallback(
    (blockId: string, fieldId: string, key: keyof IFormField, value: any) => {
      setTemplate((prev) => ({
        ...prev,
        blocks: prev.blocks.map((b) => {
          if (b.id !== blockId) return b;
          return {
            ...b,
            fields: b.fields.map((field) => {
              if (field.id === fieldId) {
                if (key === 'label') {
                  const name = slugifyFunction(value);
                  return { ...field, [key]: value, name };
                }
                return { ...field, [key]: value };
              }
              return field;
            })
          };
        })
      }));
    },
    []
  );

  const addOptionToField = useCallback(
    (blockId: string, fieldId: string, optionValue: string) => {
      setTemplate((prev) => ({
        ...prev,
        blocks: prev.blocks.map((b) => {
          if (b.id !== blockId) return b;
          return {
            ...b,
            fields: b.fields.map((f) => {
              if (f.id !== fieldId) return f;
              return {
                ...f,
                options: f.options ? [...f.options, optionValue] : [optionValue]
              };
            })
          };
        })
      }));
    },
    []
  );

  const removeOptionFromField = useCallback(
    (blockId: string, fieldId: string, optionIndex: number) => {
      setTemplate((prev) => ({
        ...prev,
        blocks: prev.blocks.map((b) => {
          if (b.id !== blockId) return b;
          return {
            ...b,
            fields: b.fields.map((f) => {
              if (f.id !== fieldId || !f.options) return f;
              const newOptions = [...f.options];
              newOptions.splice(optionIndex, 1);
              return { ...f, options: newOptions };
            })
          };
        })
      }));
    },
    []
  );

  const onSave = useCallback(
    async (replace?: boolean) => {
      const templateUpdatedChangedBy = {
        ...template,
        changedBy: excerptUser
      };

      if (initialTemplate) {
        const diff = diffTemplates(initialTemplate, templateUpdatedChangedBy);
        const mergedDiff = merge.all([
          initialTemplate.diff || {},
          diff
        ]) as TemplateDiff;
        await client.update(
          ENUM_COLLECTIONS.TEMPLATES,
          {
            _id: template._id
          },
          {
            $set: {
              ...templateUpdatedChangedBy,
              diff: mergedDiff
            }
          }
        );
        const updatedTemplate = {
          ...templateUpdatedChangedBy,
          diff: mergedDiff
        };
        setTemplate(updatedTemplate);
        toast({
          title: t('save.action'),
          description: t('save.success'),
          variant: 'success'
        });
        return updatedTemplate;
      }
      const masterTemplateId = v4();

      const masterTemplate: IMasterTemplate = {
        _id: masterTemplateId,
        title: template.title,
        latestVersion: template.version,
        createdBy: template.createdBy,
        createdAt: template.createdAt,
        organizationId: template.organizationId,
        publishedVersionId: null,
        forceUpdate: template.forceUpdate
      };
      await client.create(ENUM_COLLECTIONS.TEMPLATES_MASTER, masterTemplate);
      const templateWithMasterId: IFormTemplate = {
        ...template,
        masterId: masterTemplateId
      };
      await client.create(ENUM_COLLECTIONS.TEMPLATES, templateWithMasterId);
      toast({
        title: t('save.action'),
        description: t('save.success'),
        variant: 'success'
      });
      if (replace) {
        router.replace(
          `${ENUM_APP_ROUTES.TEMPLATES}/${masterTemplateId}/${template._id}`
        );
        return;
      }
      return templateWithMasterId;
    },
    [excerptUser, initialTemplate, router, t, template]
  );
  const onFormSave = useCallback(
    async (
      event: FormEvent<HTMLFormElement>,
      replace: boolean,
      formId?: string
    ) => {
      event.preventDefault();
      const submittedForm = event.target as HTMLFormElement;
      const intendedFormId = formId || 'template-form'; // Replace with the actual ID of your form
      if (submittedForm.id !== intendedFormId) {
        return; // Ignore submission from nested forms
      }
      await onSave(replace);
    },
    [onSave]
  );
  const handleCreateTemplate = useCallback(
    async (prevTemplate: IFormTemplate | null) => {
      if (!prevTemplate) return;
      const previousVersion = prevTemplate.version;

      const newVersion = previousVersion + 1;
      const newVersionTemplateId = v4();

      const templatePayload: IFormTemplate = {
        _id: newVersionTemplateId,
        version: newVersion,
        published: false,
        forceUpdate: false,
        hasBeenPublished: false,
        createdAt: new Date(),
        createdBy: excerptUser,
        changedBy: excerptUser,
        organizationId: organizationId,
        title: prevTemplate.title,
        blocks: prevTemplate.blocks,
        masterId: prevTemplate.masterId,
        templateListItem: prevTemplate.templateListItem
      };
      await client.create(ENUM_COLLECTIONS.TEMPLATES, templatePayload);
      router.replace(
        `${ENUM_APP_ROUTES.TEMPLATES}/${template.masterId}/${newVersionTemplateId}`
      );
      return;
    },
    [excerptUser, organizationId, router, template.masterId]
  );

  const onCreateNewVersion = useCallback(async () => {
    // First check if there is a draft version of the template
    try {
      const { data: draftTemplate } = await client.get<IFormTemplate>(
        ENUM_COLLECTIONS.TEMPLATES,
        {
          masterId: template.masterId,
          published: false,
          hasBeenPublished: false
        }
      );
      if (draftTemplate) {
        const { data: publishedTemplate } = await client.get<IFormTemplate>(
          ENUM_COLLECTIONS.TEMPLATES,
          {
            masterId: template.masterId,
            published: true
          }
        );
        return {
          template: draftTemplate,
          create: () => handleCreateTemplate(publishedTemplate),
          edit: () => {
            router.replace(
              `${ENUM_APP_ROUTES.TEMPLATES}/${template.masterId}/${draftTemplate._id}`
            );
          }
        };
      } else {
        await handleCreateTemplate(template);
        return;
      }
    } catch (error: any) {
      const errorObject = JSON.parse(error);
      if (errorObject.status === 404) {
        await handleCreateTemplate(template);
        return;
      }
      return;
    }
  }, [handleCreateTemplate, template, router]);
  const onPublish = useCallback(async () => {
    await client.updateMany(
      ENUM_COLLECTIONS.TEMPLATES,
      { masterId: template.masterId, published: true },
      { $set: { published: false } }
    );

    await client.update(
      ENUM_COLLECTIONS.TEMPLATES,
      { _id: template._id },
      { $set: { published: true, hasBeenPublished: true } }
    );
    await client.update(
      ENUM_COLLECTIONS.TEMPLATES_MASTER,
      {
        _id: template.masterId
      },
      {
        $set: {
          latestVersion: template.version,
          publishedVersionId: template._id,
          forceUpdate: template.forceUpdate
        }
      }
    );
    setTemplate((prev) => ({
      ...prev,
      published: true,
      hasBeenPublished: true
    }));
    toast({
      title: t('publish.action'),
      description: t('publish.success'),
      variant: 'success'
    });
  }, [template, t]);

  const onSelectCollection = useCallback((collection: ICollection | null) => {
    setSelectedCollection(collection);
    setTemplate((prev) => ({
      ...prev,
      collection: collection?._id
    }));
  }, []);
  // Provide everything via context value
  const value: FormBuilderContextValue = {
    template,
    isEditable,
    setTemplate,
    selectedBlockId,
    selectedCollection,
    selectedFieldId,
    selectedTab,
    onSelectCollection,
    onSelectTab: setSelectedTab,
    onFormSave,
    onSave,
    onCreateNewVersion,
    selectBlock,
    selectField,
    clearSelection,
    addBlock,
    reorderBlock,
    deleteBlock,
    addFieldToBlock,
    reorderField,
    deleteField,
    updateField,
    addOptionToField,
    removeOptionFromField,
    onPublish,
    availableFields,
    mode
  };

  return (
    <FormBuilderContext.Provider value={value}>
      {children}
    </FormBuilderContext.Provider>
  );
}
