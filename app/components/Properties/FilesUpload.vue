<script setup lang="ts">
interface Props {
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
});

const maxFiles = 6;

const modelValue = defineModel<File[]>({ default: () => [] });

const previewUrls = computed(() =>
  modelValue.value.map((file) => URL.createObjectURL(file)),
);

function removeFile(index: number) {
  if (props.disabled) return;
  modelValue.value.splice(index, 1);
}

onUnmounted(() => {
  previewUrls.value.forEach((url) => URL.revokeObjectURL(url));
});
</script>

<template>
  <orio-control-element v-bind="$attrs">
    <orio-upload
      v-model="modelValue"
      v-slot="{ isOverDropZone, openDialog }"
      :allowed-types="['image/png', 'image/jpeg']"
      :max-files
      :disabled
    >
      <div
        class="upload-container"
        :class="{ disabled }"
        @click="!disabled && openDialog()"
      >
        <div class="file" v-for="(file, index) in modelValue" :key="file.name">
          <orio-button
            v-if="!disabled"
            class="remove"
            icon="close"
            @click.prevent.stop="removeFile(index)"
          />
          <img :src="previewUrls[index]" :alt="file.name" />
        </div>
        <div v-if="!modelValue.length" class="empty">
          <template v-if="!disabled">
            <div>
              {{ isOverDropZone ? "Drop" : "Upload" }} up to {{ maxFiles }} images
              here
            </div>
            <orio-button>Add images</orio-button>
          </template>
          <div v-else>No images</div>
        </div>
      </div>
    </orio-upload>
  </orio-control-element>
</template>

<style scoped>
.upload-container {
  max-width: 100%;
  width: 30rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  border: 1px dashed var(--color-border);
  border-radius: var(--border-radius-md);
  padding: 0.75rem;
  color: var(--color-muted);
  cursor: pointer;
}

.upload-container.disabled {
  cursor: default;
  border-style: solid;
}

.file {
  position: relative;
  width: 5rem;
  height: 5rem;
}

.file img {
  object-fit: contain;
  width: 100%;
  height: 100%;
}

.file .remove {
  position: absolute;
  top: 0;
  left: 0;
  margin: 0;
}

.file :deep(button.remove) {
  background-color: rgb(225, 54, 54);
}
</style>
