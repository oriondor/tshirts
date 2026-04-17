<script setup lang="ts">
import type { Address } from "~/types/address";

interface Props {
  address: Address;
  selected?: boolean;
  selectable?: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  select: [];
  "set-default": [];
  duplicate: [event: MouseEvent];
  delete: [event: MouseEvent];
}>();

const { t } = useI18n();
const { formatAddressLines } = useAddresses();

const addressLines = computed(() => formatAddressLines(props.address));

function handleClick() {
  if (props.selectable) {
    emit("select");
  }
}
</script>

<template>
  <div
    class="address-card"
    :class="{
      selected,
      selectable,
    }"
    @click="handleClick"
  >
    <div class="address-container">
      <div class="address-content">
        <orio-view-text
          v-for="(line, index) in addressLines"
          :key="index"
          :type="index === 0 ? 'title' : 'text'"
          size="small"
        >
          {{ line }}
        </orio-view-text>
        <orio-view-text v-if="address.phone" type="subtitle" size="small">
          {{ address.phone }}
        </orio-view-text>
      </div>

      <div class="address-header">
        <div class="badges">
          <orio-badge v-if="address.label" variant="grey">
            {{ address.label }}
          </orio-badge>
          <orio-badge v-if="address.isDefault" variant="primary">
            {{ t('address.default') }}
          </orio-badge>
        </div>
        <div v-if="selectable" class="radio-indicator">
          <span class="radio" :class="{ checked: selected }"></span>
        </div>
      </div>
    </div>

    <template v-if="!selectable">
      <orio-view-separator />
      <div class="address-actions">
        <orio-button
          variant="subdued"
          icon="map-pin"
          @click.stop="emit('set-default')"
        >
          {{ t('address.setDefault') }}
        </orio-button>
        <orio-button
          variant="subdued"
          icon="edit"
          @click.stop="emit('duplicate', $event)"
        >
          {{ t('address.duplicate') }}
        </orio-button>
        <orio-button
          variant="subdued"
          icon="delete"
          @click.stop="emit('delete', $event)"
        >
          {{ t('common.delete') }}
        </orio-button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.address-card {
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  padding: 1rem;
  background: var(--color-surface);
  transition:
    border-color 0.2s,
    background-color 0.2s;
}

.address-card.selectable {
  cursor: pointer;
}

.address-card.selectable:hover {
  border-color: var(--color-accent);
  background: var(--color-bg-1);
}

.address-card.selected {
  border-color: var(--color-accent);
  background: rgba(var(--color-accent-rgb, 99, 102, 241), 0.1);
}

.address-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.address-header {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.badges {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
}

.radio-indicator {
  flex-shrink: 0;
}

.radio {
  display: block;
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid var(--color-border);
  border-radius: 50%;
  transition:
    border-color 0.2s,
    background-color 0.2s;
}

.radio.checked {
  border-color: var(--color-accent);
  background: var(--color-accent);
  box-shadow: inset 0 0 0 3px var(--color-surface);
}

.address-content {
  display: flex;
  flex-direction: column;
}

.address-actions {
  display: flex;
  gap: 0.5rem;
  padding-top: 0.5rem;
}
</style>
