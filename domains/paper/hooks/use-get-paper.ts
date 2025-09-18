import { $http } from "@/lib/http";
import { useQuery } from "@tanstack/react-query";
import { Paper } from "../types";
import { paperKeys } from "@/lib/react-query/query-keys";

const useGetPaper = ({
  id,
}: {
  id: string;
}) => {
  return useQuery({
    queryKey: paperKeys.detail(id),
    queryFn: async () => {
      const res = await $http.get<Paper>(`/papers/${id}`);
      return res.data;
    },
  });
};

export default useGetPaper;
