<script setup lang="ts">
import type { ModalProps } from "orio-ui/runtime";

interface Props {
  modalProps: ModalProps;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  confirm: [];
}>();

function handleConfirm() {
  emit("confirm");
}

function handleCancel() {
  props.modalProps["onUpdate:show"](false);
}
</script>

<template>
  <orio-modal
    :show="modalProps.show"
    :origin="modalProps.origin"
    @update:show="modalProps['onUpdate:show']"
  >
    <div class="modal-content">
      <orio-view-text type="title">Delete Address?</orio-view-text>
      <p class="message">Are you sure you want to delete this address?</p>
      <div class="actions">
        <orio-button variant="secondary" @click="handleCancel">
          Cancel
        </orio-button>
        <orio-button @click="handleConfirm">Delete</orio-button>
      </div>
    </div>
  </orio-modal>
</template>

<style scoped>
.modal-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  min-width: 18rem;
  text-align: center;
}

.message {
  margin: 0;
  color: var(--color-muted);
}

.actions {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

@media (max-width: 480px) {
  .modal-content {
    min-width: 100%;
    padding: 1rem;
  }
}
</style>
