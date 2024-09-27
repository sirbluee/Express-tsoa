// src/services/product.service.ts

import {
  ProductCreateRequest,
  ProductGetAllRequest,
  ProductUpdateRequest,
} from "../controllers/types/product-request.type";
import { ProductTypes } from "../database/models/product.model";
import productRepository from "../database/repositories/product.repository";

export class ProductService {
  // create product
  public async createProduct(
    productRequest: ProductCreateRequest
  ): Promise<ProductTypes> {
    try {
      const newProduct = await productRepository.createProduct(productRequest);
      return newProduct;
    } catch (error) {
      console.log(`ProductService - createProduct() method error: ${error}`);
      throw error;
    }
  }

  // get all products
  async getAllProducts(queries: ProductGetAllRequest) {
    try {
      const { page, limit, filter, sort } = queries;

      const newQueries = {
        page,
        limit,
        filter: filter && JSON.parse(filter),
        sort: sort && JSON.parse(sort),
      };
      const result = await productRepository.getAll(newQueries);

      return result;
    } catch (error) {
      console.error(`ProductService - getAllProducts() method error: ${error}`);
      throw error;
    }
  }

  // get product by id
  public async getProductById(id: string): Promise<ProductTypes> {
    try {
      const product = await productRepository.getProductById(id);
      return product;
    } catch (error) {
      throw error;
    }
  }

  // delete product by id
  public async deleteProduct(id: string): Promise<void> {
    try {
      await productRepository.deleteProduct(id);
    } catch (error) {
      throw error;
    }
  }

  // update product
  public async updateProduct(
    id: string,
    productRequest: ProductUpdateRequest
  ): Promise<ProductTypes> {
    try {
      const updatedProduct = await productRepository.updateProduct(
        id,
        productRequest
      );
      return updatedProduct;
    } catch (error) {
      throw error;
    }
  }
}

export default new ProductService();
