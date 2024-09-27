// create a new project
export interface ProductCreateRequest {
  name: string;
  category: string;
  price: number;
  image?: string | null;
}

// update product
export interface ProductUpdateRequest {
  name?: string;
  category?: string;
  price?: number;
  image?: string;
}

// get all products
export interface ProductGetAllRequest {
  page?: number;
  limit?: number;
  filter?: string | any;
  sort?: string | any;
}