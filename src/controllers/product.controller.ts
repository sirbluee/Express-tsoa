import { Controller, Route, Get, Post, Put, Delete, Body, Path } from "tsoa";
import Product from "../models/Product";

export interface ProductTypes {
  name: string;
  category: string;
  price: number;
  stock: number;
}

@Route("/v1/products")
export class ProductController extends Controller {
  // Create a new product
  @Post("/")
  public async createProduct(@Body() body: ProductTypes): Promise<ProductTypes> {
    const product = new Product(body);
    return await product.save();
  }

  // Get all products
  @Get("/")
  public async getAllProducts(): Promise<ProductTypes[]> {
    return await Product.find();
  }

  // Get a single product by ID
  @Get("/{id}")
  public async getProductById(@Path() id: string): Promise<ProductTypes | null> {
    return await Product.findById(id);
  }

  // Update an existing product by ID
  @Put("/{id}")
  public async updateProduct(@Path() id: string, @Body() body: ProductTypes): Promise<ProductTypes | null> {
    return await Product.findByIdAndUpdate(id, body, { new: true });
  }

  // Delete a product by ID
  @Delete("/{id}")
  public async deleteProduct(@Path() id: string): Promise<{ message: string }> {
    await Product.findByIdAndDelete(id);
    return { message: "Product deleted successfully" };
  }
}
