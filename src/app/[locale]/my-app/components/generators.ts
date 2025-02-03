import { v4 } from "uuid";
import { ENUM_COMPONENTS, IVDOMNode } from "./interfaces";
import { TemplateDiff } from "@/lib/TemplateBuilder/interfaces";

export const generatePageVersion = (masterTemplateId: string, version: number) => {

  return ({
    _id: v4(),
    createdAt: new Date(),
    masterTemplateId,
    vdom: {
      _id: v4(),
      type: ENUM_COMPONENTS.BLOCK,
      props: {
        children: []
      },
      context: {}
    } as IVDOMNode,
    version,
    diff: {} as TemplateDiff,
    published: false,
    hasBeenPublished: false,
    createdBy: null
  })
}