import { $http } from "@/lib/http";
import { useMutation } from "@tanstack/react-query";

const useUpdatePaperStatus = ({ paperId }: { paperId: number }) => {
  return useMutation({
    mutationFn: (payload: { status: string, rejectionReason?: string}) => {
      return $http.put(`/papers/${paperId}/update-status`, payload);
    }
  });
};

export default useUpdatePaperStatus;
