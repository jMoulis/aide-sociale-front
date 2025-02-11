'use server';

import { client } from "@/lib/openAi/openAiClient";
import { isValidJSON } from "@/lib/utils/utils";
import { nanoid } from "nanoid";
import { ENUM_FIELD_TYPE, IFormBlock } from "../interfaces";
import { IAiMessage } from "./interfaces";

function validateTemplate(parsedTemplate: any): { reason: string, status: boolean } {
  if (typeof parsedTemplate.title !== 'string') return { status: false, reason: 'title is not a string' };
  if (!Array.isArray(parsedTemplate.blocks)) return { status: false, reason: 'blocks is not an array' };

  for (const block of parsedTemplate.blocks) {
    if (typeof block.id !== 'string') return { status: false, reason: 'block id is not a string' };
    if (!['single-column', 'two-column', 'three-column'].includes(block.layout)) return { status: false, reason: 'block layout is not valid' };
    if (!Array.isArray(block.fields)) return { status: false, reason: 'fields is not an array' };

    for (const field of block.fields) {
      if (typeof field.id !== 'string') return { status: false, reason: 'field id is not a string' };
      if (typeof field.name !== 'string') return { status: false, reason: 'field name is not a string' };
      if (typeof field.label !== 'string') return { status: false, reason: 'field label is not a string' };
      if (!Object.values(ENUM_FIELD_TYPE).includes(field.type)) return { status: false, reason: 'field type is not valid' };
      // Additional optional validations can be added here
    }
  }

  return { status: true, reason: '' };
}
function ensureUniqueIDs(template: { title: string; blocks: IFormBlock[] }): { title: string; blocks: IFormBlock[] } {
  const blockIdSet = new Set<string>();
  const fieldIdSet = new Set<string>();

  const updatedBlocks = template.blocks.map(block => {
    // Ensure block ID uniqueness
    let originalBlockId = block.id;
    while (blockIdSet.has(originalBlockId)) {
      originalBlockId = nanoid();
    }
    blockIdSet.add(originalBlockId);

    const updatedFields = block.fields.map(field => {
      // Ensure field ID uniqueness
      let originalFieldId = field.id;
      while (fieldIdSet.has(originalFieldId)) {
        originalFieldId = nanoid();
      }
      fieldIdSet.add(originalFieldId);

      return { ...field, id: originalFieldId };
    });

    return { ...block, id: originalBlockId, fields: updatedFields };
  });

  return { ...template, blocks: updatedBlocks };
}
export async function generateTemplate(messages: IAiMessage[]) {
  try {

    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: messages,
    });
    const aiOutput = response.choices[0]?.message?.content;
    if (!aiOutput) {
      return {
        error: 'No response from AI',
        template: null
      }
    }
    // const validatedOutput = validateAIOutput(responses, aiOutput);
    if (isValidJSON(aiOutput)) {
      const aiTemplate = JSON.parse(aiOutput) as { title: string, blocks: IFormBlock[] };

      const validationResult = validateTemplate(aiTemplate);
      if (!validationResult.status) {
        return {
          error: `Invalid template format: ${validationResult.reason}`,
          template: null,
          rawResponse: aiOutput
        }
      }
      return {
        template: ensureUniqueIDs(aiTemplate),
        error: null,
      }
    }
    return {
      error: 'Invalid response format',
      template: null,
      rawResponse: aiOutput
    };
  } catch (error: any) {
    return {
      error: error.message,
      template: null
    }
  }
}
