# Changelog

## 2026-03-12 — Design system refactor: pre-rendered mockup images

### What changed

Introduced a new **pre-rendered design system** for `known-prints-t-shirt` products. Instead of overlaying a design image on a base t-shirt photo at runtime, each design folder now contains ready-made mockup photos named by color and placement (e.g. `white_front.png`, `black_back.png`).

The existing **overlay system** for `designer-custom-t-shirt` is untouched and works as before.

### New image folder convention

```
public/designs/{productId}/{designId}/
  design.png              # standalone design artwork (reserved for future use)
  {color}_{placement}.png # pre-rendered mockup per color × placement
```

Example (`flying-cats`):

```
white_front.png, white_back.png
black_front.png, black_back.png
sand_front.png,  sand_back.png
```

### Files changed

| File                                                  | Change                                                                                                                                                                |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/assets/configs/designs.ts`                       | Added `PrerenderedDesign` / `OverlayDesign` types, `isPrerenderedDesign()` helper. `flying-cats` now uses `colors` + `placements` instead of `images` + `imageProps`. |
| `app/composables/useDesign.ts`                        | Added `prerendered`, `getPrerenderedImagePath()`, `availableColors`, `availablePlacements`, `allPrerenderedImages`. Overlay helpers still work for legacy designs.    |
| `app/assets/configs/products.ts`                      | `known-prints-t-shirt` properties now use `Color` and `Placement` components (dynamic from design config) instead of `Variant` + hardcoded `product-color`.           |
| `app/components/Properties/Color.vue`                 | **New** — reads available colors from design config, renders SwitchSelect.                                                                                            |
| `app/components/Properties/Placement.vue`             | **New** — reads available placements from design config, renders SwitchSelect.                                                                                        |
| `app/components/Designs/Design.vue`                   | Accepts full `design` object. Pre-rendered: shows first color on default, second color on hover. Overlay: keeps existing behavior.                                    |
| `app/components/Designs/index.vue`                    | Passes `:design` prop instead of `v-bind="design"`.                                                                                                                   |
| `app/pages/product/[productId]/design/[designId].vue` | Gallery shows all pre-rendered images (swipeable). Selecting color/placement switches active image. Overlay slot only renders for non-prerendered designs.            |
| `app/components/Cart/ItemDescription.vue`             | Preview image and subtitle now handle both pre-rendered and overlay designs.                                                                                          |
| `app/types/cart.ts`                                   | Added `placement` to `CartItemForOrder`.                                                                                                                              |
| `app/composables/useCheckout.ts`                      | Maps `placement` property through to order items.                                                                                                                     |
