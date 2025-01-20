import client from "@/lib/mongo/initMongoClient";

import { useCallback } from "react";
import { IMasterTemplate } from "./interfaces";
import { ENUM_COLLECTIONS } from "../mongo/interfaces";

export const usePublishedTemplate = (masterTemplateId?: string) => {
  const fetchMasterPublishedTemplate = useCallback(async () => {
    if (masterTemplateId) {
      const { data } = await client.get<IMasterTemplate>(ENUM_COLLECTIONS.TEMPLATES_MASTER, {
        _id: masterTemplateId
      });
      if (data?.publishedVersion) {
        return data?.publishedVersion;
      }
    }
    return null;
  }, [masterTemplateId]);

  return {
    getPublishedTemplate: fetchMasterPublishedTemplate
  }
};