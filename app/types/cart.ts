export interface CartItem {
  id: string;
  designId: string;
  productId: string;
  quantity: number;
  price: number;
  properties: Record<string, string | File[]>;
}

export interface CartItemForOrder {
  productId: string;
  designId: string;
  quantity: number;
  unitPrice: number;
  variant?: string;
  size?: string;
  productColor?: string;
  name?: string;
  secondaryText?: string;
  specialRequest?: string;
  merchandiseId?: string;
}
