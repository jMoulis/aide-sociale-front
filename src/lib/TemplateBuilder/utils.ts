import { IUserSummary } from "../interfaces/interfaces";
import { IFormBlock, IFormTemplate, TemplateDiff, BlockChange, IFormField, FieldChange, PropertyChange } from "./interfaces";

export function diffTemplates(oldVersion: IFormTemplate, newVersion: IFormTemplate): TemplateDiff {
  const changedBy = newVersion.changedBy;
  const timestamp = new Date();

  const diff: TemplateDiff = {
    templateId: newVersion._id,
    oldVersion: oldVersion.version,
    newVersion: newVersion.version,
    changedBy,
    timestamp,
    blocks: {
      added: [],
      removed: [],
      changed: []
    }
  };

  // 1. Build a quick lookup for old blocks by id
  const oldBlocksById = new Map<string, IFormBlock>();
  oldVersion.blocks.forEach(b => oldBlocksById.set(b.id, b));

  // 2. Iterate newVersion blocks to find added or changed
  for (const newBlock of newVersion.blocks) {
    const oldBlock = oldBlocksById.get(newBlock.id);
    if (!oldBlock) {
      // This block didn't exist in old version => ADDED
      diff.blocks.added.push(newBlock);
    } else {
      // Compare block properties + fields
      const blockChange = compareBlock(oldBlock, newBlock, changedBy || null, timestamp);
      if (blockChange) {
        diff.blocks.changed.push(blockChange);
      }
      // remove from map so we know we've handled it
      oldBlocksById.delete(newBlock.id);
    }
  }

  // 3. Any blocks left in oldBlocksById => REMOVED
  for (const removedBlock of oldBlocksById.values()) {
    diff.blocks.removed.push(removedBlock);
  }

  return diff;
}

// Compare block properties, then compare fields
function compareBlock(
  oldBlock: IFormBlock,
  newBlock: IFormBlock,
  changedBy: IUserSummary | null,
  timestamp: Date
): BlockChange | null {
  const blockChange: BlockChange = {
    blockId: newBlock.id,
    changedProperties: [],
    changedBy,
    changedAt: timestamp,
    fields: {
      added: [],
      removed: [],
      changed: []
    }
  };

  // Compare top-level block props
  const blockPropsToCheck = ['title', 'layout'];
  for (const prop of blockPropsToCheck) {
    const oldVal = (oldBlock as any)[prop];
    const newVal = (newBlock as any)[prop];
    if (oldVal !== newVal) {
      blockChange.changedProperties!.push({
        key: prop,
        oldValue: oldVal,
        newValue: newVal,
      });
    }
  }

  // Compare fields
  const oldFieldsById = new Map<string, IFormField>();
  oldBlock.fields.forEach(f => oldFieldsById.set(f.id, f));

  for (const newField of newBlock.fields) {
    const oldField = oldFieldsById.get(newField.id);
    if (!oldField) {
      // ADDED field
      blockChange.fields!.added.push(newField);
    } else {
      // check if field changed
      const fieldChange = compareField(oldField, newField, changedBy, timestamp);
      if (fieldChange) {
        blockChange.fields!.changed.push(fieldChange);
      }
      // remove from map
      oldFieldsById.delete(newField.id);
    }
  }

  // remaining fields in oldFieldsById => REMOVED
  for (const removedField of oldFieldsById.values()) {
    blockChange.fields!.removed.push(removedField);
  }

  // If no changes at all, return null
  const hasBlockPropChanges = blockChange.changedProperties!.length > 0;
  const hasFieldChanges = (
    blockChange.fields!.added.length > 0 ||
    blockChange.fields!.removed.length > 0 ||
    blockChange.fields!.changed.length > 0
  );
  if (!hasBlockPropChanges && !hasFieldChanges) {
    return null;
  }
  return blockChange;
}

// Compare field properties
function compareField(
  oldField: IFormField,
  newField: IFormField,
  changedBy: IUserSummary | null,
  timestamp: Date
): FieldChange | null {
  const changedProps: PropertyChange[] = [];
  const fieldPropsToCheck = ['label', 'type', 'required', 'description', 'name']; // expand as needed

  for (const prop of fieldPropsToCheck) {
    const oldVal = (oldField as any)[prop];
    const newVal = (newField as any)[prop];
    if (oldVal !== newVal) {
      changedProps.push({
        key: prop,
        oldValue: oldVal,
        newValue: newVal,
      });
    }
  }

  if (changedProps.length === 0) {
    return null; // no changes
  }

  return {
    fieldId: newField.id,
    changedProperties: changedProps,
    changedBy,
    changedAt: timestamp
  };
}
