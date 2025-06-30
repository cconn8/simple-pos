export class SelectedItemDto {
  _id: string;
  name: string;
  category: string;
  type: string;
  description?: string;
  isBillable: string;
  price: number | string;
  qty: number;
  displayTitle: string;
  itemTotal: number | string;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}