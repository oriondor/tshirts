<script setup lang="ts">
import type { AddressFormData } from "~/types/address";

const modelValue = defineModel<AddressFormData>({ required: true });

const { checkValidity, errors, changeRules } = useValidation();

watch(
  modelValue,
  () => {
    changeRules([
      {
        model: toRef(modelValue.value, "recipientName"),
        id: "recipientName",
        validator: isFilled,
        message: "Recipient name is required",
      },
      {
        model: toRef(modelValue.value, "street"),
        id: "street",
        validator: isFilled,
        message: "Street is required",
      },
      {
        model: toRef(modelValue.value, "streetNumber"),
        id: "streetNumber",
        validator: isFilled,
        message: "Street number is required",
      },
      {
        model: toRef(modelValue.value, "postalCode"),
        id: "postalCode",
        validator: isFilled,
        message: "Postal code is required",
      },
      {
        model: toRef(modelValue.value, "city"),
        id: "city",
        validator: isFilled,
        message: "City is required",
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
      label="Recipient Name"
      placeholder="Full name"
      :error="errors.recipientName"
    />

    <orio-input layout="inner"
      v-model="modelValue.phone"
      label="Phone (optional)"
      placeholder="+49 123 456789"
      type="tel"
    />

    <div class="form-row">
      <orio-input layout="inner"
        v-model="modelValue.street"
        label="Street"
        placeholder="Street name"
        :error="errors.street"
        class="street-input"
      />
      <orio-input layout="inner"
        v-model="modelValue.streetNumber"
        label="Nr."
        placeholder="123"
        :error="errors.streetNumber"
        class="number-input"
      />
    </div>

    <orio-input layout="inner"
      v-model="modelValue.additionalInfo"
      label="Additional Info (optional)"
      placeholder="Apartment, floor, etc."
    />

    <div class="form-row">
      <orio-input layout="inner"
        v-model="modelValue.postalCode"
        label="Postal Code"
        placeholder="12345"
        :error="errors.postalCode"
        class="postal-input"
      />
      <orio-input layout="inner"
        v-model="modelValue.city"
        label="City"
        placeholder="City"
        :error="errors.city"
        class="city-input"
      />
    </div>

    <orio-input layout="inner"
      v-model="modelValue.country"
      label="Country"
      placeholder="Country"
    />

    <orio-input layout="inner"
      v-model="modelValue.label"
      label="Label (optional)"
      placeholder="e.g., Home, Work"
    />

    <orio-check-box v-model="modelValue.isDefault">
      Set as default address
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
