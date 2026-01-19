export interface CartItem {
  id: string;
  designId: string;
  productType: string;
  quantity: number;
  properties: Record<string, string>;
}
