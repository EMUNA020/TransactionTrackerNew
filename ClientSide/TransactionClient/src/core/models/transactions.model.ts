import { category } from "./category.model";

export interface Transactions {
  id?: number;
  date?: Date;
  description?: string;
  amount?: number;
  categoryId?: number;
  category?: category;
}
