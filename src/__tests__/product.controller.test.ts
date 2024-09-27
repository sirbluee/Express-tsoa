import { ProductController } from "../controllers/product.controller";
import {
  ProductCreateRequest,
  ProductGetAllRequest,
  ProductUpdateRequest,
} from "../controllers/types/product-request.type";
import { ProductPaginatedResponse } from "../controllers/types/product-response.types";
import { ProductTypes } from "../database/models/product.model";
import productService from "../services/product.service";

// Mock productService
jest.mock("../services/product.service");

describe("ProductController", () => {
  let controller: ProductController;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    controller = new ProductController();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console.error
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test to avoid any interference
    consoleErrorSpy.mockRestore(); // Restore console.error after tests
  });

  // Test createProduct
  describe("createProduct", () => {
    it("should create a product successfully and return the correct response", async () => {
      const mockProduct: ProductTypes = {
        name: "Test Product",
        category: "Test Category",
        price: 100,
        image: "test-image.jpg",
      };

      (productService.createProduct as jest.Mock).mockResolvedValue(
        mockProduct
      );

      const requestBody: ProductCreateRequest = {
        name: "Test Product",
        category: "Test Category",
        price: 100,
      };

      const result = await controller.createProduct(requestBody);

      expect(productService.createProduct).toHaveBeenCalledWith(requestBody);
      expect(result).toEqual({
        message: "success",
        data: mockProduct,
      });
    });

    it("should throw an error when product creation fails", async () => {
      (productService.createProduct as jest.Mock).mockRejectedValue(
        new Error("Error creating product")
      );

      const requestBody: ProductCreateRequest = {
        name: "Test Product",
        category: "Test Category",
        price: 100,
      };

      await expect(controller.createProduct(requestBody)).rejects.toThrow(
        "Error creating product"
      );
    });
  });

  // Test getAllProducts
  describe("getAllProducts", () => {
    it("should return a paginated list of products", async () => {
      const mockProducts: ProductTypes[] = [
        {
          name: "Product 1",
          category: "Category 1",
          price: 100,
          image: "image1.jpg",
        },
        {
          name: "Product 2",
          category: "Category 2",
          price: 200,
          image: "image2.jpg",
        },
      ];

      const mockResponse: ProductPaginatedResponse = {
        message: "success",
        data: {
          items: mockProducts,
          totalItems: 2,
          totalPages: 1,
          currentPage: 1,
        },
      };

      (productService.getAllProducts as jest.Mock).mockResolvedValue(
        mockResponse.data
      );

      const query: ProductGetAllRequest = {
        page: 1,
        limit: 5,
        filter: {},
        sort: {},
      };

      const result = await controller.getAllProducts(query);

      expect(productService.getAllProducts).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockResponse);
    });

    it("should log and throw an error if product retrieval fails", async () => {
      const error = new Error("Error retrieving products");
      (productService.getAllProducts as jest.Mock).mockRejectedValue(error);

      const query: ProductGetAllRequest = {
        page: 1,
        limit: 5,
        filter: {},
        sort: {},
      };

      await expect(controller.getAllProducts(query)).rejects.toThrow(error);
    });
  });

  // Test getItemById
  describe("getItemById", () => {
    it("should return the product details by id", async () => {
      const mockProduct: ProductTypes = {
        name: "Product 1",
        category: "Category 1",
        price: 100,
        image: "image1.jpg",
      };

      (productService.getProductById as jest.Mock).mockResolvedValue(
        mockProduct
      );

      const result = await controller.getItemById("1");

      expect(productService.getProductById).toHaveBeenCalledWith("1");
      expect(result).toEqual({
        message: "success",
        data: mockProduct,
      });
    });

    it("should throw an error if product retrieval fails", async () => {
      const error = new Error("Error retrieving product");
      (productService.getProductById as jest.Mock).mockRejectedValue(error);

      await expect(controller.getItemById("1")).rejects.toThrow(error);
    });
  });

  // Test deleteItemById
  describe("deleteItemById", () => {
    it("should delete a product by id successfully", async () => {
      (productService.deleteProduct as jest.Mock).mockResolvedValue(undefined);

      await controller.deleteItemById("1");

      expect(productService.deleteProduct).toHaveBeenCalledWith("1");
    });

    it("should throw an error if product deletion fails", async () => {
      const error = new Error("Error deleting product");
      (productService.deleteProduct as jest.Mock).mockRejectedValue(error);

      await expect(controller.deleteItemById("1")).rejects.toThrow(error);
    });
  });

  // Test updateItem
  describe("updateItem", () => {
    it("should update a product by id successfully", async () => {
      const mockUpdatedProduct: ProductTypes = {
        name: "Updated Product",
        category: "Updated Category",
        price: 150,
        image: "updated.jpg",
      };

      (productService.updateProduct as jest.Mock).mockResolvedValue(
        mockUpdatedProduct
      );

      const requestBody: ProductUpdateRequest = {
        name: "Updated Product",
        category: "Updated Category",
        price: 150,
      };

      const result = await controller.updateItem("1", requestBody);

      expect(productService.updateProduct).toHaveBeenCalledWith(
        "1",
        requestBody
      );
      expect(result).toEqual({
        message: "success",
        data: mockUpdatedProduct,
      });
    });

    it("should throw an error if product update fails", async () => {
      const error = new Error("Error updating product");
      (productService.updateProduct as jest.Mock).mockRejectedValue(error);

      const requestBody: ProductUpdateRequest = {
        name: "Updated Product",
        category: "Updated Category",
        price: 150,
      };

      await expect(controller.updateItem("1", requestBody)).rejects.toThrow(
        error
      );
    });
  });
});
