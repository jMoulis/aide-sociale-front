import { ENUM_COMPONENTS, IVDOMNode } from "./interfaces";
import { TemplateDiff } from "@/lib/TemplateBuilder/interfaces";
import { IPageTemplateVersion } from "@/lib/interfaces/interfaces";
import { nanoid } from "nanoid";

export const generatePageVersion = (masterTemplateId: string, version: number) => {
  const pageVersion: IPageTemplateVersion = {
    _id: nanoid(),
    createdAt: new Date(),
    masterTemplateId,
    title: `Version ${version}`,
    description: '',
    vdom: {
      _id: nanoid(),
      type: ENUM_COMPONENTS.BLOCK,
      children: [],
      props: {},
      context: {}
    } as IVDOMNode,
    version,
    diff: {} as TemplateDiff,
    published: false,
    hasBeenPublished: false,
    createdBy: null
  }
  return pageVersion;
}