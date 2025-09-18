import { $http } from "@/lib/http";
import { useMutation } from "@tanstack/react-query";
import React from "react";

type UploadPaperPayload = {
  title: string;
  abstract: string;
  categoryId: number;
  fieldId: number;
  keywords: string[];
  newKeywords?: string[];
  notes?: string | undefined;
  file: File;
};
const useUploadPaper = () => {
  return useMutation({
    mutationFn: async (payload: UploadPaperPayload) => {
      const formData = new FormData();
      formData.append("title", payload.title);
      formData.append("abstract", payload.abstract);
      formData.append("categoryId", payload.categoryId.toString());
      formData.append("fieldId", payload.fieldId.toString());
      payload.keywords.forEach((keyword, idx) => {
        formData.append(`keywords[${idx}]`, keyword);
      });

      if (payload.newKeywords) {
        payload.newKeywords.forEach((keyword, idx) => {
          formData.append(`newKeywords[${idx}]`, keyword);
        });
      }

      if (payload.notes) {
        formData.append("notes", payload.notes);
      }

      console.log({file:payload.file})
      formData.append("file", payload.file);
      return $http.post("/papers", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
  });
};

export default useUploadPaper;
