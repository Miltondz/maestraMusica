import { pb } from '../services/pocketbase';
import type { SiteContent } from '../types';

export const contentApi = {
  async getAll(): Promise<SiteContent[]> {
    const records = await pb.collection('site_content').getFullList();
    return records.map(r => ({
      key: r.key,
      value: r.value
    }));
  },

  async update(content: Partial<SiteContent>[]): Promise<SiteContent[]> {
    // PB doesn't support bulk upsert. We iterate.
    const promises = content.map(async (item) => {
      if (!item.key) return null;
      try {
        // Try to find existing by key
        const existing = await pb.collection('site_content').getFirstListItem(`key="${item.key}"`);
        // Update
        const updated = await pb.collection('site_content').update(existing.id, item);
        return { key: updated.key, value: updated.value };
      } catch (e: any) {
        if (e.status === 404) {
          // Create
          const created = await pb.collection('site_content').create(item);
          return { key: created.key, value: created.value };
        }
        throw e;
      }
    });

    const results = await Promise.all(promises);
    return results.filter(Boolean) as SiteContent[];
  },
};