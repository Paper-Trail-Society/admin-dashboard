import { $http } from "@/lib/http";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { PaginatedPapersResponse, PaperStatus } from "../types";
import { paperKeys } from "@/lib/react-query/query-keys";

const useGetPapers = ({
  search,
  userId,
  page,
  isEnabled = true,
  status = 'pending'
}: {
  search?: string;
  userId?: string;
  page?: number;
  isEnabled?: boolean;
  status?: PaperStatus
}) => {
  return useQuery({
    queryKey: paperKeys.list(search ?? "", userId ?? "", page?.toString() ?? '1'),
    queryFn: async () => {
      const res = await $http.get<PaginatedPapersResponse>("/papers", {
        params: { search, userId, page, status },
      });
      return res.data;
    },
    enabled: isEnabled,
  });
};

export default useGetPapers;
