<script setup lang="ts">
import type { AddressFormData } from "~/types/address";

const modelValue = defineModel<AddressFormData>({ required: true });

const { t } = useI18n();
const { checkValidity, errors, changeRules } = useValidation();

watch(
  modelValue,
  () => {
    changeRules([
      {
        model: toRef(modelValue.value, "recipientName"),
        id: "recipientName",
        validator: isFilled,
        message: t('address.recipientRequired'),
      },
      {
        model: toRef(modelValue.value, "street"),
        id: "street",
        validator: isFilled,
        message: t('address.streetRequired'),
      },
      {
        model: toRef(modelValue.value, "streetNumber"),
        id: "streetNumber",
        validator: isFilled,
        message: t('address.streetNumberRequired'),
      },
      {
        model: toRef(modelValue.value, "postalCode"),
        id: "postalCode",
        validator: isFilled,
        message: t('address.postalCodeRequired'),
      },
      {
        model: toRef(modelValue.value, "city"),
        id: "city",
        validator: isFilled,
        message: t('address.cityRequired'),
      },
    ]);
  },
  { immediate: true },
);

defineExpose({ checkValidity });
</script>

<template>
  <div class="address-form">
    <orio-input layout="inner"
      v-model="modelValue.recipientName"
      :label="t('address.recipientName')"
      :placeholder="t('address.fullName')"
      :error="errors.recipientName"
    />

    <orio-input layout="inner"
      v-model="modelValue.phone"
      :label="t('address.phoneOptional')"
      :placeholder="t('address.phonePlaceholder')"
      type="tel"
    />

    <div class="form-row">
      <orio-input layout="inner"
        v-model="modelValue.street"
        :label="t('address.street')"
        :placeholder="t('address.streetPlaceholder')"
        :error="errors.street"
        class="street-input"
      />
      <orio-input layout="inner"
        v-model="modelValue.streetNumber"
        :label="t('address.streetNumber')"
        :placeholder="t('address.streetNumberPlaceholder')"
        :error="errors.streetNumber"
        class="number-input"
      />
    </div>

    <orio-input layout="inner"
      v-model="modelValue.additionalInfo"
      :label="t('address.additionalInfo')"
      :placeholder="t('address.additionalInfoPlaceholder')"
    />

    <div class="form-row">
      <orio-input layout="inner"
        v-model="modelValue.postalCode"
        :label="t('address.postalCode')"
        :placeholder="t('address.postalCodePlaceholder')"
        :error="errors.postalCode"
        class="postal-input"
      />
      <orio-input layout="inner"
        v-model="modelValue.city"
        :label="t('address.city')"
        :placeholder="t('address.city')"
        :error="errors.city"
        class="city-input"
      />
    </div>

    <orio-input layout="inner"
      v-model="modelValue.country"
      :label="t('address.country')"
      :placeholder="t('address.country')"
    />

    <orio-input layout="inner"
      v-model="modelValue.label"
      :label="t('address.labelOptional')"
      :placeholder="t('address.labelPlaceholder')"
    />

    <orio-check-box v-model="modelValue.isDefault">
      {{ t('address.setAsDefault') }}
    </orio-check-box>
  </div>
</template>

<style scoped>
.address-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.form-row {
  display: flex;
  gap: 0.75rem;
}

.street-input {
  flex: 3;
}

.number-input {
  flex: 1;
  min-width: 5rem;
}

.postal-input {
  flex: 1;
  min-width: 7rem;
}

.city-input {
  flex: 2;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
}

.checkbox-label input {
  width: 1.125rem;
  height: 1.125rem;
  accent-color: var(--color-accent);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

@media (max-width: 480px) {
  .form-row {
    flex-direction: column;
    gap: 1rem;
  }

  .street-input,
  .number-input,
  .postal-input,
  .city-input {
    flex: 1;
    min-width: 100%;
  }
}
</style>
