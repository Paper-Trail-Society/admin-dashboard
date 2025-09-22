import { $http } from "@/lib/http";
import { useMutation } from "@tanstack/react-query";

type UpdatePaperType = {
  status: string;
  rejectionReason?: string;
  file?: File;
};

const useUpdatePaper = ({ paperId }: { paperId: number }) => {
  return useMutation({
    mutationFn: (payload: UpdatePaperType) => {
      const formData = new FormData();
      formData.append("status", payload.status);
      if (payload.rejectionReason) {
        formData.append("rejectionReason", payload.rejectionReason);
      }
      if (payload.file) {
        formData.append("file", payload.file);
      }

      return $http.put(`/papers/${paperId}`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
  });
};

export default useUpdatePaper;
