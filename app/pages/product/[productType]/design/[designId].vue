<script setup lang="ts">
import type { ProductType } from "~/types/products";

const route = useRoute();
const productType = route.params.productType as ProductType;
const designId = route.params.designId as string;

const { formatDecimal } = useDecimalFormatter();

const { addItem } = useCart();

const { design, getImagePath } = useDesign(productType, designId);

const name = computed(() => properties.value.name);
const files = computed(() => properties.value.files);

const { checkValidity, errors } = useValidation([
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
]);

const amount = ref(1);

const properties = ref<Record<string, string>>({ name: "", files: [] });

function addToCart() {
  if (!checkValidity()) return;
  if (!design.value) return;
  addItem({
    id: design.value.id,
    productType,
    designId,
    quantity: amount.value,
    properties: properties.value,
  });
}

const currentImage = ref(
  getImagePath(properties.value["design-color"] as string),
);

watch(
  () => properties.value["design-color"],
  () => {
    currentImage.value = getImagePath(
      properties.value["design-color"] as string,
    );
  },
);
</script>

<template>
  <div v-if="design">
    <div class="design">
      <orio-gallery-carousel
        v-model:active-image="currentImage"
        class="item-images"
        :images="
          Object.values(design.images).map(
            (image: string) => `/designs/${productType}/${designId}/${image}`,
          )
        "
      />
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
        <Properties v-model="properties" :design :product-type :errors />
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
