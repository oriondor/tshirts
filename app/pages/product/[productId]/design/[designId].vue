<script setup lang="ts">
import type { ValidationRule } from "orio-ui/runtime";
import type { ProductId } from "~/types/products";
import { isPrerenderedDesign } from "~/assets/configs/designs";

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

const { formatDecimal } = useDecimalFormatter();

const { addItem } = useCart();

const {
  design,
  product,
  prerendered,
  getImagePath,
  getBaseImage,
  getImageProps,
  getPrerenderedImagePath,
  allPrerenderedImages,
  allImagePaths,
} = useDesign(productId, designId);

const amount = ref(1);

const properties = ref<Record<string, string | File[]>>({
  name: "",
  files: [],
});

const urlSyncKeys = (product.value?.properties ?? [])
  .filter((p) => p.component && p.component !== "FilesUpload")
  .map((p) => p.name);

useUrlSync(properties, urlSyncKeys);

const name = computed(() => properties.value.name);
const files = computed(() => properties.value.files);

const availableValidations = [
  {
    model: name,
    id: "name",
    validator: isFilled,
    message: "Name cannot be empty",
  },
  {
    model: files,
    id: "files",
    validator: isFilled,
    message: "Upload at least one image",
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
    const placement = (
      (properties.value.placement as string) || ""
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
    <div v-if="design" class="design">
      <orio-gallery-carousel v-reveal
        v-model:active-image="currentImage"
        size=":500"
        class="item-images"
        :images="galleryImages"
        appearance="minimal"
      >
        <template v-if="!prerendered" #image="{ image }">
          <designs-overlay-image
            :base="getBaseImage(properties.variant as string)"
            :overlay="image"
            :params="getImageProps(properties.variant as string)"
          />
        </template>
      </orio-gallery-carousel>
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
    <Footer v-if="design">
      <cart-item-description :design :properties />
      <cart-item-amount v-model="amount" :price="design.price">
        <template #actions>
          <orio-button @click="addToCart"> Add to cart </orio-button>
        </template>
      </cart-item-amount>
    </Footer>
    <orio-empty-state v-if="!design" icon="search" title="Design not found" />
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
