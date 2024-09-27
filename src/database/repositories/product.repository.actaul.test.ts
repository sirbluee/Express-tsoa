import mongoose from "mongoose";
import ProductRepository from "../repositories/product.repository";
import ProductModel from "../models/product.model";
import { ProductCreateRequest } from "../../controllers/types/product-request.type";

// Use your actual MongoDB URI for testing
const mongoUri = "mongodb+srv://mongo:mongo@cluster0.nwgl6.mongodb.net/"

beforeAll(async () => {
  // Connect to the actual MongoDB instance
  await mongoose.connect(mongoUri as string);
});
// afterAll(async () => {
//   // Disconnect from the MongoDB instance after tests are done
//   await mongoose.disconnect();
// });

// afterEach(async () => {
//   // Clean up the Product collection after each test
//   await ProductModel.deleteMany({});
// });

describe("ProductRepository Integration Tests with actual MongoDB", () => {
  describe("createProduct", () => {
    // Case 1: Successfully create a product
    it("should create a new product successfully", async () => {
      const productRequest: ProductCreateRequest = {
        name: "Test Product",
        price: 100,
        category: "Electronics",
      };

      const createdProduct = await ProductRepository.createProduct(
        productRequest
      );

      expect(createdProduct).toHaveProperty("_id");
      expect(createdProduct.name).toBe("Test Product");
      expect(createdProduct.price).toBe(100);
    });

    // Case 2: Fail to create product due to missing required fields
    it("should throw an error if required fields are missing", async () => {
      const productRequest: Partial<ProductCreateRequest> = {
        price: 100,
        category: "Electronics",
      };

      await expect(
        ProductRepository.createProduct(productRequest as ProductCreateRequest)
      ).rejects.toThrowError(/name.*required/);
    });

    // Case 3: Fail due to invalid field type
    it("should throw an error if invalid field types are provided", async () => {
      const productRequest: any = {
        name: "Test Product",
        price: "invalid_price", // Invalid price type (should be number)
        category: "Electronics",
      };

      await expect(
        ProductRepository.createProduct(productRequest)
      ).rejects.toThrowError(/Cast to Number failed/);
    });

    // Case 4: Handle database failure (e.g., simulated network issue)
    it("should handle database errors gracefully", async () => {
      // Mock the `create` method to throw an error (simulate a database failure)
      jest
        .spyOn(ProductModel, "create")
        .mockRejectedValueOnce(new Error("Database connection lost"));

      const productRequest: ProductCreateRequest = {
        name: "Test Product",
        price: 100,
        category: "Electronics",
      };

      await expect(
        ProductRepository.createProduct(productRequest)
      ).rejects.toThrowError("Database connection lost");

      // Restore the mock after this test
      jest.restoreAllMocks();
    });
  });
});
