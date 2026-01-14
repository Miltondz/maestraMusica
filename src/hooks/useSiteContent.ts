import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useSiteContent() {
  const siteContent = useQuery(api.siteContent.getAll);
  const updateBulk = useMutation(api.siteContent.updateBulk);

  const contentMap = siteContent?.reduce((acc, item) => {
    acc[item.key] = item.value;
    return acc;
  }, {} as Record<string, any>) ?? {};

  return {
    content: siteContent ?? [],
    contentMap,
    loading: siteContent === undefined,
    error: null,
    refreshContent: () => { },
    updateContent: async (updates: { key: string, value: any }[]) => {
      await updateBulk({ updates });
    }
  };
}
