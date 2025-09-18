export const paperKeys = {
  all: ["papers"] as const,
  lists: () => [...paperKeys.all, "list"] as const,
  list: (...filters: string[]) =>
    [...paperKeys.all, "list", { ...filters }] as const,
  details: () => [...paperKeys.all, "detail"] as const,
  detail: (id: string) => [...paperKeys.details(), id] as const,
};
