<script setup lang="ts">
interface Props {
  options: string[];
  label: string;
}
const props = defineProps<Props>();

const { options } = toRefs(props);

const modelValue = defineModel();

onMounted(() => {
  modelValue.value = options.value[0];
});
</script>

<template>
  <orio-control-element :label>
    <div class="property-container">
      <orio-switch-button
        v-for="option in options"
        :model-value="modelValue === option"
        @update:model-value="modelValue = option"
      >
        {{ option }}
      </orio-switch-button>
    </div>
  </orio-control-element>
</template>

<style scoped>
.property-container {
  display: flex;
}
</style>
