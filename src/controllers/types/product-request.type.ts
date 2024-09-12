// create a new project
export interface ProductCreateRequest {
  name: string;
  category: string;
  price: number;
}

// update product
export interface ProductUpdateRequest {
  name?: string;
  category?: string;
  price?: number;
}

// get all products
export interface ProductGetAllRequest {
  page?: number;
  limit?: number;
  filter?: string;
  sort?: string;
}