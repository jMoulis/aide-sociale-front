'use server';

import { client } from "@/lib/openAi/openAiClient";
import { isValidJSON } from "@/lib/utils/utils";
import { IAiMessage } from "./interfaces";
import { IVDOMNode } from "@/app/[locale]/admin/my-app/components/interfaces";

export async function generateAiForm(messages: IAiMessage[]) {
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
    if (isValidJSON(aiOutput)) {
      const aiTemplate = JSON.parse(aiOutput) as { title: string, vdom: IVDOMNode };

      if (!aiTemplate.title || !aiTemplate.vdom) {
        return {
          error: 'Invalid template format',
          template: null
        }
      }
      return {
        template: aiTemplate,
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
export async function generateAiHTML(messages: IAiMessage[]) {

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
    if (isValidJSON(aiOutput)) {
      const aiTemplate = JSON.parse(aiOutput) as { title: string, html: string };

      if (!aiTemplate.title || !aiTemplate.html) {
        return {
          error: 'Invalid template format',
          template: null
        }
      }
      return {
        template: aiTemplate,
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
