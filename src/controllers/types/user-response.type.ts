import { ProductTypes } from "../../database/models/product.model";

export interface ProductResponse {
  message: string;
  data: ProductTypes
}