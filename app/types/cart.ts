export interface CartItem {
  id: string;
  designId: string;
  productType: string;
  quantity: number;
  price: number;
  properties: Record<string, string | File[]>;
}

export interface CartItemForOrder {
  productType: string;
  designId: string;
  quantity: number;
  unitPrice: number;
  designColor?: string;
  size?: string;
  productColor?: string;
  name?: string;
  secondaryText?: string;
  specialRequest?: string;
}
