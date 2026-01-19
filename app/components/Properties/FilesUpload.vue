<script setup lang="ts">
const maxFiles = 6;

const files = ref<File[]>([]);

const previewUrls = computed(() =>
  files.value.map((file) => URL.createObjectURL(file))
);

function removeFile(index: number) {
  files.value.splice(index, 1);
}

onUnmounted(() => {
  previewUrls.value.forEach((url) => URL.revokeObjectURL(url));
});
</script>

<template>
  <orio-control-element v-bind="$attrs">
    <orio-upload
      v-model="files"
      v-slot="{ isOverDropZone, openDialog }"
      :allowed-types="['image/png', 'image/jpeg']"
      :max-files
    >
      <div class="container" @click="openDialog">
        <div class="file" v-for="(file, index) in files" :key="file.name">
          <orio-button
            class="remove"
            icon="close"
            @click.prevent.stop="removeFile(index)"
          />
          <img :src="previewUrls[index]" :alt="file.name" />
        </div>
        <div v-if="!files.length" class="empty">
          {{ isOverDropZone ? "Drop" : "Upload" }} up to {{ maxFiles }} images
          here
          <orio-button>Add images</orio-button>
        </div>
      </div>
    </orio-upload>
  </orio-control-element>
</template>

<style scoped>
.container {
  max-width: 100%;
  width: 30rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  border: 1px dashed var(--color-border);
  border-radius: var(--border-radius-md);
  padding: 0.75rem;
  margin-block: 0.5rem;
  color: var(--color-muted);
  cursor: pointer;
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
