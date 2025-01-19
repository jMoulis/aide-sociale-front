import { v4 } from "uuid";
import { ENUM_COMPONENTS, ENUM_COMPONENTS_TYPE } from "./interfaces";
import { TemplateDiff } from "@/lib/TemplateBuilder/interfaces";

export const generatePageVersion = (masterTemplateId: string, version: number) => {

  return ({
    _id: v4(),
    createdAt: new Date(),
    masterTemplateId,
    vdom: {
      _id: v4(),
      type: ENUM_COMPONENTS_TYPE.BLOCK,
      component: ENUM_COMPONENTS.BLOCK,
      children: []
    },
    version,
    diff: {} as TemplateDiff,
    published: false,
    hasBeenPublished: false,
    createdBy: null
  })
}