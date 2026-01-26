export interface CartItem {
  id: string;
  designId: string;
  productType: string;
  quantity: number;
  price: number;
  properties: Record<string, string | File[]>;
}
