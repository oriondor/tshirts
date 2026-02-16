<script setup lang="ts">
import type { ValidationRule } from "orio-ui/runtime";
import type { ProductId } from "~/types/products";

function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  if (import.meta.env.PROD) {
    throw new Error(
      "crypto.randomUUID is not available. Ensure the site is served over HTTPS.",
    );
  }
  // Fallback for non-secure contexts in development (HTTP on non-localhost)
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

const { design, product, getImagePath, getBaseImage, getImageProps } =
  useDesign(productId, designId);

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

const amount = ref(1);

const properties = ref<Record<string, string | File[]>>({
  name: "",
  files: [],
});

function setDefaults() {
  // Only reset text fields and files, but keep sizes, design and t-shirt color in place...
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

const currentImage = ref(getImagePath(properties.value.variant as string));

watch(
  () => properties.value.variant,
  () => {
    currentImage.value = getImagePath(properties.value.variant as string);
  },
);

onMounted(() => {
  // Add validation rules
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
</script>

<template>
  <div v-if="design">
    <div class="design">
      <orio-gallery-carousel
        v-model:active-image="currentImage"
        size="400:"
        class="item-images"
        :images="
          Object.values(design.images).map(
            (image: string) => `/designs/${productId}/${designId}/${image}`,
          )
        "
      >
        <template #image="{ image }">
          <designs-overlay-image
            :base="getBaseImage(properties.variant as string)"
            :overlay="image"
            :params="getImageProps(properties.variant as string)"
          />
        </template>
      </orio-gallery-carousel>
      <div class="item-information">
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
    <Footer>
      <cart-item-description :design :properties />
      <cart-item-amount v-model="amount" :price="design.price">
        <template #actions>
          <orio-button @click="addToCart"> Add to cart </orio-button>
        </template>
      </cart-item-amount>
    </Footer>
  </div>
</template>

<style scoped>
.design {
  display: flex;
  gap: 1.5rem;
  padding-block: 2rem;
  padding-inline: 1rem;
  padding-bottom: var(--foot-height);
  align-items: flex-start;
  max-width: 100%;
}

.item-images {
  position: sticky;
  top: calc(var(--nav-height) + 2rem);
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
