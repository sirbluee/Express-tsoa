import { ProductCreateRequest } from "../controllers/types/product-request.type";
import ProductModel, { ProductTypes } from "../database/models/product.model";
import productRepository from "../database/repositories/product.repository";

// Mock the ProductModel to avoid actual database calls
jest.mock("../database/models/product.model");

describe("ProductRepository", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear all mocks after each test to avoid interference
  });

  describe("createProduct", () => {
    it("should create a product successfully when input is valid", async () => {
      const mockProduct: ProductTypes = {
        name: "Test Product",
        category: "Category 1",
        price: 100,
        image: "test-image.jpg",
      };

      const productRequest: ProductCreateRequest = {
        name: "Test Product",
        category: "Category 1",
        price: 100,
        image: "test-image.jpg",
      };

      // Mock the create method to return the mock product
      (ProductModel.create as jest.Mock).mockResolvedValue(mockProduct);

      const result = await productRepository.createProduct(productRequest);

      expect(ProductModel.create).toHaveBeenCalledWith(productRequest);
      expect(result).toEqual(mockProduct);
    });

    it("should throw an error when product creation fails", async () => {
      const productRequest: ProductCreateRequest = {
        name: "Test Product",
        category: "Category 1",
        price: 100,
        image: "test-image.jpg",
      };

      // Mock the create method to throw an error
      (ProductModel.create as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await expect(
        productRepository.createProduct(productRequest)
      ).rejects.toThrow("Database error");
      expect(ProductModel.create).toHaveBeenCalledWith(productRequest);
    });
  });
});
