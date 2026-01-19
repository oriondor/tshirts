<script setup lang="ts">
import { designs } from "~/assets/configs/designs";
import type { ProductType } from "~/types/products";

const { formatDecimal } = useDecimalFormatter();

const route = useRoute();
const productType = route.params.productType as ProductType;
const designId = route.params.designId as string;

const amount = ref(1);

const properties = ref<Record<string, string>>({});

const design = computed(() =>
  designs[productType].find(({ id }) => id === designId),
);

function getImageByColor(color: string) {
  const images = design.value?.images as Record<string, string> | undefined;
  return `/designs/${productType}/${designId}/${images?.[color]}`;
}

const currentImage = ref(
  getImageByColor(properties.value["design-color"] as string),
);

const subtotal = computed(() => amount.value * (design.value?.price ?? 0));

watch(
  () => properties.value["design-color"],
  () => {
    currentImage.value = getImageByColor(
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
        <Properties v-model="properties" :design :product-type />
      </div>
    </div>
    <Footer>
      <div class="item-preview">
        <img :src="currentImage" />
        <div class="item-props">
          <orio-view-text type="title" size="small">
            {{ design.name }}
          </orio-view-text>
          <orio-view-text type="subtitle" size="small">
            {{ properties["design-color"] }} / {{ properties.size }} /
            {{ properties["t-shirt-color"] }}
          </orio-view-text>
        </div>
      </div>
      <div class="item-amount">
        <orio-number-input-horizontal
          v-model="amount"
          :min="1"
          :max="100"
          class="amount-field"
        />
        <client-only>
          <orio-view-text type="italics" size="large" class="total-price">
            €{{ formatDecimal(subtotal) }}
          </orio-view-text>
        </client-only>
        <orio-button> Add to cart </orio-button>
      </div>
    </Footer>
  </div>
</template>

<style scoped lang="scss">
.design {
  display: flex;
  gap: 1.5rem;
  padding-block: 2rem;
  padding-inline: 1rem;
  padding-bottom: var(--foot-height);
  align-items: flex-start;
}

.item-images {
  position: sticky;
  top: calc(var(--nav-height) + 2rem);
}

.item-information {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.text-information {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.item-preview {
  height: calc(var(--foot-height) - 0.5rem);
  display: flex;
  align-items: center;

  img {
    height: 100%;
  }

  .item-props {
    display: flex;
    flex-direction: column;
  }
}

.item-amount {
  display: flex;

  .amount-field {
    max-width: 6rem;
  }

  .total-price {
    min-width: 8rem;
  }
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
