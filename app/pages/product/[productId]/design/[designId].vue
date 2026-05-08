<script setup lang="ts">
import type { ValidationRule } from "orio-ui";
import type { ProductId } from "~/types/products";
import {
  isPrerenderedDesign,
  isSchematicDesign,
} from "~/assets/configs/designs";

function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  if (import.meta.env.PROD) {
    throw new Error(
      "crypto.randomUUID is not available. Ensure the site is served over HTTPS.",
    );
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const route = useRoute();
const productId = route.params.productId as ProductId;
const designId = route.params.designId as string;

const { t } = useI18n();
const { formatDecimal } = useDecimalFormatter();

const { addItem } = useCart();

const {
  design,
  product,
  prerendered,
  schematicMode,
  getImagePath,
  getPrerenderedImagePath,
  allPrerenderedImages,
  allImagePaths,
} = useDesign(productId, designId);

const { relatedDesigns, hasRelated } = useUpsell({
  currentDesignId: designId,
  tags: computed(() => design.value?.tags ?? []),
  limit: 3,
});

const toastDesign = ref<import("~/assets/configs/designs").Design | null>(null);

const amount = ref(1);

const properties = ref<Record<string, string | File[]>>({
  name: "",
  files: [],
});

const excluded = design.value?.excludeProperties ?? [];
const urlSyncKeys = (product.value?.properties ?? [])
  .filter(
    (p) =>
      p.component &&
      p.component !== "FilesUpload" &&
      !excluded.includes(p.name),
  )
  .map((p) => p.name);

useUrlSync(properties, urlSyncKeys);

const name = computed(() => properties.value.name);
const files = computed(() => properties.value.files);

const availableValidations = [
  {
    model: name,
    id: "name",
    validator: isFilled,
    message: t("design.nameRequired"),
  },
  {
    model: files,
    id: "files",
    validator: isFilled,
    message: t("design.uploadRequired"),
  },
];

const { checkValidity, errors, changeRules } = useValidation();

function setDefaults() {
  properties.value = {
    ...properties.value,
    name: "",
    secondary: "",
    files: [],
    request: "",
  };
  amount.value = 1;
}

function addToCart() {
  if (!checkValidity()) return;
  if (!design.value) return;
  addItem({
    id: generateId(),
    productId,
    designId,
    quantity: amount.value,
    price: design.value.price,
    properties: properties.value,
  });
  if (relatedDesigns.value.length > 0) {
    toastDesign.value = relatedDesigns.value[0];
  }
  setDefaults();
}

// --- Image management ---

// For pre-rendered: switch active image when color/placement changes
const currentImage = ref("");

function updateCurrentImage() {
  if (!design.value) return;
  if (prerendered.value) {
    const color = (
      (properties.value["product-color"] as string) || ""
    ).toLowerCase();
    const defaultPlacement = isPrerenderedDesign(design.value)
      ? design.value.defaultPlacement
      : undefined;
    const placement = (
      (properties.value.placement as string) ||
      defaultPlacement ||
      ""
    ).toLowerCase();
    if (color && placement) {
      currentImage.value = getPrerenderedImagePath(color, placement);
    }
  } else {
    currentImage.value = getImagePath(properties.value.variant as string);
  }
}

watch(
  () => [
    properties.value["product-color"],
    properties.value.placement,
    properties.value.variant,
  ],
  updateCurrentImage,
);

// Set initial image once properties are hydrated from URL
onMounted(() => {
  nextTick(updateCurrentImage);

  const addRules: ValidationRule[] = [];
  const productRulesIds =
    product.value?.properties
      .map((property) => property.id ?? null)
      .filter((id) => !!id) ?? [];
  availableValidations.forEach((rule) => {
    if (productRulesIds.includes(rule.id)) addRules.push(rule);
  });
  changeRules(addRules);
});

// Gallery images
const galleryImages = computed(() => {
  if (!design.value) return [];
  if (prerendered.value) return allPrerenderedImages.value;
  return allImagePaths.value;
});
</script>

<template>
  <div>
    <orio-button
      variant="subdued"
      icon="arrow-left"
      @click="navigateTo(`/product/${productId}`)"
    >
      {{ t("common.back") }}
    </orio-button>
    <div v-if="design" class="design">
      <designs-tshirt-schematic
        v-if="schematicMode && isSchematicDesign(design) && design.canvas"
        v-reveal
        :svg-path="
          design.schematic.svgPath.replace(
            '{side}',
            ((properties.side as string) ?? 'front').toLowerCase(),
          )
        "
        :color="(properties['product-color'] as string) ?? '#ffffff'"
        :canvas-config="design.canvas"
        :active-side="properties.side as string"
        class="item-images"
      />
      <designs-gallery
        v-else
        v-reveal
        v-model:active-image="currentImage"
        :images="galleryImages"
        class="item-images"
      />

      <div v-reveal="{ delay: 100 }" class="item-information">
        <div class="text-information">
          <orio-view-text type="title" size="large">
            {{ design.name }}
          </orio-view-text>
          <client-only>
            <orio-view-text type="italics" size="large">
              €{{ formatDecimal(design.price) }}
            </orio-view-text>
          </client-only>
          <orio-view-text type="subtitle">
            {{ design.description }}
          </orio-view-text>
        </div>
        <Properties v-model="properties" :design :product-id :errors />
      </div>
    </div>
    <upsell-section
      v-if="hasRelated"
      :title="t('upsell.youMightAlsoLike')"
      :subtitle="t('upsell.completeCollection')"
      variant="grid"
    >
      <template #default="{ play }">
        <designs-design
          v-for="(d, i) in relatedDesigns"
          :key="d.id"
          :design="d"
          v-reveal="{ delay: i * 80 }"
          @mouseenter="play"
        />
      </template>
    </upsell-section>
    <Footer v-if="design">
      <cart-item-description :design :properties />
      <cart-item-amount v-model="amount" :price="design.price">
        <template #actions>
          <orio-button @click="addToCart">
            {{ t("cart.addToCart") }}
          </orio-button>
        </template>
      </cart-item-amount>
    </Footer>
    <orio-empty-state
      v-if="!design"
      icon="search"
      :title="t('product.designNotFound')"
    />
    <client-only>
      <upsell-toast
        v-if="toastDesign"
        :design="toastDesign"
        @dismiss="toastDesign = null"
      />
    </client-only>
  </div>
</template>

<style scoped>
.design {
  display: flex;
  gap: 1.5rem;
  padding-inline: 1rem;
  padding-bottom: var(--foot-height);
  align-items: flex-start;
  max-width: 100%;
}

.item-images {
  position: sticky;
  top: calc(var(--nav-height) + 2rem);
  overflow: hidden;
}

.item-information {
  padding-block-start: 2rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  max-width: 100%;
}

.text-information {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.item-preview {
  height: calc(var(--foot-height) - 0.5rem);
}

@media (max-width: 768px) {
  .design {
    flex-wrap: wrap;
  }

  .item-images {
    position: static;
    margin: auto;
  }
}
</style>
