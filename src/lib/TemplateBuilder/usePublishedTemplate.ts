import client from "@/lib/mongo/initMongoClient";

import { useCallback, useEffect, useState } from "react";
import { IFormTemplate, IMasterTemplate } from "./interfaces";
import { ENUM_COLLECTIONS } from "../mongo/interfaces";

export const usePublishedTemplate = (masterTemplateId?: string) => {
  const [publishedTemplate, setPublishedTemplate] = useState<IFormTemplate | null>(null);
  const fetchMasterPublishedTemplate = useCallback(async () => {
    if (masterTemplateId) {
      const { data } = await client.get<IMasterTemplate>(ENUM_COLLECTIONS.TEMPLATES_MASTER, {
        _id: masterTemplateId
      });
      if (data?.publishedVersionId) {
        const { data: template } = await client.get<IFormTemplate>(ENUM_COLLECTIONS.TEMPLATES, {
          _id: data.publishedVersionId
        });
        setPublishedTemplate(template);
      }
    }
    return null;
  }, [masterTemplateId]);

  useEffect(() => {
    fetchMasterPublishedTemplate()
  }, [fetchMasterPublishedTemplate]);

  return {
    publishedTemplate
  }
};