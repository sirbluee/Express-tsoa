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
  @Middlewares(validateRequest)
  public async createProduct(
    @Body() requestBody: ProductCreateRequest
  ): Promise<ProductResponse> {
    this.setStatus(201); // Ensure 201 Created
    try {
      const newProduct = await productService.createProduct(requestBody);
      return {
        message: "success",
        data: newProduct,
      };
    } catch (error) {
      throw new Error("Error creating product");
    }
  }

  @Get()
  @Response(200)
  public async getAllProducts(
    @Queries() queries: ProductGetAllRequest
  ): Promise<ProductPaginatedResponse> {
    try {
      const response = await productService.getAllProducts(queries);
      return {
        message: "success",
        data: response, // Ensure response is properly structured
      };
    } catch (error) {
      console.error(`ProductsController - getAllProducts() error: ${error}`);
      throw error;
    }
  }

  @Get("{id}")
  @Response(200)
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

  @Delete("{id}")
  @Response(204, "Delete Success")
  public async deleteItemById(@Path() id: string): Promise<void> {
    try {
      await productService.deleteProduct(id);
    } catch (error) {
      throw error;
    }
  }

  @Put("{id}")
  @Response(200, "Updated Success")
  @Middlewares(validateRequest)
  public async updateItem(
    @Path() id: string,
    @Body() requestBody: ProductUpdateRequest
  ): Promise<ProductResponse> {
    try {
      const updatedProduct = await productService.updateProduct(id, requestBody);
      return { message: "success", data: updatedProduct };
    } catch (error) {
      throw error;
    }
  }
}
