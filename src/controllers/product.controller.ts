// src/controllers/product.controller.ts
import {
  Controller,
  Route,
  Body,
  Post,
  Response,
  Middlewares,
  Path,
  Get,
  Delete,
  Put,
  Queries,
} from "tsoa";
import { ProductResponse } from "./types/user-response.type";
import {
  ProductCreateRequest,
  ProductGetAllRequest,
  ProductUpdateRequest,
} from "./types/product-request.type";
import validateRequest from "../middlewares/validate-input";
import productService from "../services/product.service";
import { ProductPaginatedResponse } from "./types/product-response.types";

@Route("v1/products")
export class ProductController extends Controller {
  @Post()
  @Response(201, "Created Success")
  @Middlewares(validateRequest) // Add this local middleware to check the valid input
  public async createProduct(
    @Body() requestBody: ProductCreateRequest
  ): Promise<ProductResponse> {
    try {
      const newProduct = await productService.createProduct(requestBody);

      return {
        message: "success",
        data: {
          name: newProduct.name,
          category: newProduct.category,
          price: newProduct.price,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // get all products
  	// Add this: the request might look like: /v1/products?page=1&limit=5&filter={"price":{"min": 10, "max":2000}}&sort={"name": "desc"}
    @Get()
    public async getAllProducts(@Queries() queries: ProductGetAllRequest): Promise<ProductPaginatedResponse> {
      try {
        const response = await productService.getAllProducts(queries);
  
        return {
          message: "success",
          data: response
        }
  
      } catch (error) {
        console.error(`ProductsController - getAllProducts() method error: ${error}`)
        throw error;
      }
    }

  // get product by id
  @Get("{id}")
  public async getItemById(@Path() id: string): Promise<ProductResponse> {
    try {
      const product = await productService.getProductById(id);

      return {
        message: "success",
        data: product,
      };
    } catch (error) {
      throw error;
    }
  }
  // delete product by id
  @Delete("{id}")
  @Response(204, "Delete Success")
  public async deleteItemById(@Path() id: string): Promise<void> {
    try {
      await productService.deleteProduct(id);
    } catch (error) {
      throw error;
    }
  }

  // update product by id
  @Put("{id}")
  @Middlewares(validateRequest) // Add this local middleware to check the valid input
  public async updateItem(
    @Path() id: string,
    @Body() requestBody: ProductUpdateRequest
  ): Promise<ProductResponse> {
    try {
      const updatedProduct = await productService.updateProduct(
        id,
        requestBody
      );

      return { message: "success", data: updatedProduct };
    } catch (error) {
      throw error;
    }
  }
}
