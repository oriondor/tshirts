export interface Address {
  id: string;
  recipientName: string;
  phone?: string;
  street: string;
  streetNumber: string;
  additionalInfo?: string;
  postalCode: string;
  city: string;
  country: string;
  label?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AddressFormData {
  recipientName: string;
  phone?: string;
  street: string;
  streetNumber: string;
  additionalInfo?: string;
  postalCode: string;
  city: string;
  country?: string;
  label?: string;
  isDefault?: boolean;
}
