import { ProductTypes } from "../../database/models/product.model";

export interface ProductResponse {
  message: string;
  data: ProductTypes
}

// Add this
export interface ProductPaginatedResponse {
  message: string;
  data: {
    [key: string]: ProductTypes[] | number;
    totalItems: number;
    totalPages: number;
    currentPage: number;
  }
}