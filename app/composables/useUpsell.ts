import type { Design } from "~/assets/configs/designs";
import { designs } from "~/assets/configs/designs";

interface UseUpsellOptions {
  currentDesignId?: string;
  excludeDesignIds?: Ref<string[]>;
  tags?: Ref<string[]>;
  limit?: number;
}

export function useUpsell(options: UseUpsellOptions = {}) {
  const { currentDesignId, excludeDesignIds, tags, limit = 3 } = options;

  const allDesigns = Object.values(designs).flat();

  const relatedDesigns = computed<Design[]>(() => {
    const excludeIds = new Set<string>();
    if (currentDesignId) excludeIds.add(currentDesignId);
    if (excludeDesignIds?.value) {
      for (const id of excludeDesignIds.value) excludeIds.add(id);
    }

    const candidates = allDesigns.filter((d) => !excludeIds.has(d.id));
    if (!candidates.length) return [];

    const targetTags = tags?.value ?? [];
    if (!targetTags.length) return candidates.slice(0, limit);

    const tagSet = new Set(targetTags);
    const scored = candidates.map((design) => {
      const score = (design.tags ?? []).filter((tag) => tagSet.has(tag)).length;
      return { design, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map((s) => s.design);
  });

  const hasRelated = computed(() => relatedDesigns.value.length > 0);

  return { relatedDesigns, hasRelated };
}
