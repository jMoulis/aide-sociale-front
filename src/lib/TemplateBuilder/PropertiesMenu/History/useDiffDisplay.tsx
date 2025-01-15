import { useCallback, useState } from 'react';
import {
  CustomDiffResult,
  ITrackChangeItem,
  TemplateDiff
} from '../../interfaces';
import { useTemplateBuilder } from '../../TemplateBuilderContext';
import { useTranslations } from 'next-intl';
import { diffTemplates } from '../../utils';
import { usePublishedTemplate } from '../../usePublishedTemplate';

export const useDiffDisplay = () => {
  const { template } = useTemplateBuilder();
  const { getPublishedTemplate } = usePublishedTemplate(template.masterId);
  const [diff, setDiff] = useState<{
    [key: string]: CustomDiffResult[];
  } | null>(null);
  const t = useTranslations('TemplateSection');
  const [trackChangeItems, setTrackChangeItems] = useState<
    ITrackChangeItem[] | null
  >(null);

  const buildDiff = useCallback(async () => {
    const publishedTemplate = await getPublishedTemplate();
    if (!publishedTemplate) return;

    const diffTemplate = diffTemplates(template, publishedTemplate);
    if (
      diffTemplate.blocks.added.length ||
      diffTemplate.blocks.removed.length ||
      diffTemplate.blocks.changed.length
    ) {
      const fieldChanges = getDiff(diffTemplate);
      setDiff(fieldChanges);
    } else {
      setDiff(null);
    }
  }, [getPublishedTemplate, template]);

  const getDiff = (diffTemplate: TemplateDiff) => {
    const fieldsChanges: {
      [key: string]: {
        label: string;
        name: string;
        description?: string;
      }[];
    } = {
      added: [],
      removed: [],
      changed: []
    };
    Object.entries(diffTemplate.blocks).forEach(([key, value]) => {
      value.forEach((block) => {
        const { fields } = block;
        if (!fields) return;
        if (Array.isArray(fields)) {
          fieldsChanges[key].push(
            ...(fields || []).map((field) => ({
              label: field.label,
              name: field.name,
              description: field.description
            }))
          );
        } else {
          Object.entries(fields).forEach(([key, value]) => {
            fieldsChanges[key].push(
              ...(value || []).reduce((acc: CustomDiffResult[], field) => {
                if ('label' in field) {
                  return [
                    ...acc,
                    {
                      label: field.label,
                      name: field.name,
                      description: field.description
                    }
                  ];
                }
                return acc;
              }, [])
            );
          });
        }
      });
    });
    return fieldsChanges;
  };
  const getTrackItems = useCallback(() => {
    if (!template.diff) return;
    return diffToListItems(template.diff);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template.diff]);

  function diffToListItems(diff: TemplateDiff): ITrackChangeItem[] {
    const list: ITrackChangeItem[] = [];
    // We can default to top-level changedBy/timestamp if lower-level doesn't specify.
    const globalChangedBy = diff.changedBy;
    const globalChangedAt = diff.timestamp;

    // 1) Handle newly ADDED blocks
    for (const addedBlock of diff.blocks.added) {
      list.push({
        message: `Block ${t('added')} ${addedBlock.title}`,
        changedBy: globalChangedBy,
        changedAt: globalChangedAt
      });
    }

    // 2) Handle REMOVED blocks
    for (const removedBlock of diff.blocks.removed) {
      list.push({
        message: `Block ${t('removed')} ${removedBlock.title}`,
        changedBy: globalChangedBy,
        changedAt: globalChangedAt
      });
    }

    // 3) Handle CHANGED blocks
    for (const changedBlock of diff.blocks.changed) {
      // We'll read changedBy/changedAt from the block-level if set, else fallback
      const blockChangedBy = changedBlock.changedBy || globalChangedBy;
      const blockChangedAt = changedBlock.changedAt || globalChangedAt;

      // 3a) changed block properties
      if (
        changedBlock.changedProperties &&
        changedBlock.changedProperties.length > 0
      ) {
        for (const propChange of changedBlock.changedProperties) {
          list.push({
            message: `${t('has')} ${t('changed')} "${propChange.key}" from "${
              propChange.oldValue
            }" to "${propChange.newValue}"`,
            changedBy: changedBlock.changedBy,
            changedAt: blockChangedAt
          });
        }
      }

      // 3b) added fields in this block
      for (const addedField of changedBlock.fields?.added || []) {
        list.push({
          message: `${t('has')} ${t('added')} ${addedField.name}`,
          changedBy: blockChangedBy,
          changedAt: blockChangedAt
        });
      }

      // 3c) removed fields in this block
      for (const removedField of changedBlock.fields?.removed || []) {
        list.push({
          message: `${t('historyItemField', {
            action: t('removed'),
            field: removedField.name,
            firstName: blockChangedBy?.firstName
          })}`,
          changedBy: blockChangedBy,
          changedAt: blockChangedAt
        });
      }

      // 3d) changed fields in this block
      for (const cField of changedBlock.fields?.changed || []) {
        // each changed field might have changedBy, changedAt at field-level if you pass them along
        const fieldChangedBy = cField.changedBy || blockChangedBy;
        const fieldChangedAt = cField.changedAt || blockChangedAt;

        // if the field has changedProperties, let's list them
        if (cField.changedProperties && cField.changedProperties.length > 0) {
          for (const propChange of cField.changedProperties) {
            list.push({
              message: `${t('historyItemField', {
                action: t('changed'),
                field: `"${propChange.key}" ${t('from')}  "${
                  propChange.oldValue
                }" ${t('to')} "${propChange.newValue}"`,
                fullName: blockChangedBy?.firstName
              })}`,
              changedBy: fieldChangedBy,
              changedAt: fieldChangedAt
            });
          }
        }
      }
    }
    const sorted = list.sort((a, b) => {
      // If one or both are missing `changedAt`, we treat them as equal or push them to bottom
      if (!a.changedAt && !b.changedAt) return 0;
      if (!a.changedAt) return 1; // missing date => sort after
      if (!b.changedAt) return -1; // missing date => sort before

      // Both exist => compare descending
      return new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime();
    });
    setTrackChangeItems(sorted);
    return sorted;
  }
  return {
    diff,
    buildDiff,
    trackChangeItems,
    getTrackItems,
    diffToListItems
  };
};
