import {
  isPrerenderedDesign,
  type Design,
  type PrerenderedDesign,
} from "~/assets/configs/designs";

export interface ScatterVariant {
  design: Design;
  color?: string;
  placement?: string;
  key: string;
}

export interface ScatterChaosConfig {
  /** 0-1 — chance of adding a flipped (front↔back) duplicate when both placements exist */
  flipChance: number;
  /** Min colors a design must have before color duplicates can appear */
  colorVariantsMinColors: number;
  /** 0-1 — chance each extra color is included */
  colorVariantChance: number;
  /** Cap on extra color duplicates per design */
  maxColorVariants: number;
}

export const defaultChaosConfig: ScatterChaosConfig = {
  flipChance: 0.6,
  colorVariantsMinColors: 4,
  colorVariantChance: 0.45,
  maxColorVariants: 2,
};

function isFlippable(design: PrerenderedDesign) {
  return (
    design.placements.includes("front") &&
    design.placements.includes("back") &&
    !design.excludeProperties?.includes("placement")
  );
}

function variantKey(designId: string, color?: string, placement?: string) {
  return [designId, color, placement].filter(Boolean).join("_");
}

export function expandDesignVariants(
  design: Design,
  random: () => number,
  config: ScatterChaosConfig,
): ScatterVariant[] {
  if (!isPrerenderedDesign(design)) {
    return [{ design, key: design.id }];
  }

  const baseColor = design.colors[0];
  const basePlacement = design.defaultPlacement ?? design.placements[0];

  const variants: ScatterVariant[] = [
    {
      design,
      color: baseColor,
      placement: basePlacement,
      key: variantKey(design.id, baseColor, basePlacement),
    },
  ];

  if (isFlippable(design) && random() < config.flipChance) {
    const flipped = basePlacement === "front" ? "back" : "front";
    variants.push({
      design,
      color: baseColor,
      placement: flipped,
      key: variantKey(design.id, baseColor, flipped),
    });
  }

  if (design.colors.length > config.colorVariantsMinColors) {
    let added = 0;
    for (let i = 1; i < design.colors.length; i++) {
      if (added >= config.maxColorVariants) break;
      if (random() >= config.colorVariantChance) continue;
      const color = design.colors[i];
      variants.push({
        design,
        color,
        placement: basePlacement,
        key: variantKey(design.id, color, basePlacement),
      });
      added++;
    }
  }

  return variants;
}
