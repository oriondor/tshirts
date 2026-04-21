<script setup lang="ts">
import type { AddressFormData } from "~/types/address";
import type { ModalProps } from "orio-ui";
import AddressForm from "./Form.vue";

interface Props {
  modalProps: ModalProps;
  initialData?: AddressFormData;
  isDuplicate?: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  submit: [data: AddressFormData];
}>();

const { t } = useI18n();
const addressForm = useTemplateRef("addressForm");

const defaultData: AddressFormData = {
  recipientName: "",
  phone: "",
  street: "",
  streetNumber: "",
  additionalInfo: "",
  postalCode: "",
  city: "",
  country: "",
  label: "",
  isDefault: false,
};

const formData = ref<AddressFormData>({ ...defaultData });

function handleSubmit() {
  if (!addressForm.value?.checkValidity()) return;
  emit("submit", formData.value);
}

function handleCancel() {
  props.modalProps["onUpdate:show"](false);
}

// Reset form data when modal opens
watch(
  () => props.modalProps.show,
  (show) => {
    if (show) {
      formData.value = { ...(props.initialData ?? defaultData) };
    }
  },
);
</script>

<template>
  <orio-modal
    :show="modalProps.show"
    :origin="modalProps.origin"
    :title="isDuplicate ? t('address.duplicateAddress') : t('address.addAddress')"
    @update:show="modalProps['onUpdate:show']"
  >
    <div class="form-container">
      <AddressForm ref="addressForm" v-model="formData" />
    </div>

    <template #footer>
      <div class="footer-content">
        <orio-button variant="secondary" type="button" @click="handleCancel">
          {{ t('common.cancel') }}
        </orio-button>
        <orio-button @click="handleSubmit">
          {{ isDuplicate ? t('address.saveAsNew') : t('address.addAddress') }}
        </orio-button>
      </div>
    </template>
  </orio-modal>
</template>

<style scoped>
.form-container {
  width: 24rem;
  max-width: 100%;
}

.footer-content {
  display: flex;
  justify-content: space-between;
}
</style>
