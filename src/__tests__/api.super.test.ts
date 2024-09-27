import request from "supertest";
import app from "../server"; // Import your Express app
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Make sure dotenv is configured correctly

describe("ProductController API", () => {
  let productId: string;

  beforeAll(async () => {
    console.log("MONGODB_URL (Test):", process.env.MONGODB_URL);
    await mongoose.connect(process.env.MONGODB_URL as string);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Test for creating a product
  describe("POST /v1/products", () => {
    it("should create a new product", async () => {
      const response = await request(app)
        .post("/v1/products")
        .send({
          name: "Test Product",
          category: "Test Category",
          price: 100,
          image: "test-image.jpg",
        })
        .expect(201);  // Expect 201 Created

      expect(response.body.message).toBe("success");
      expect(response.body.data.name).toBe("Test Product");
      expect(response.body.data.category).toBe("Test Category");
      productId = response.body.data._id; // Store the product ID for further tests
    });
  });

  // Test for getting all products
  describe("GET /v1/products", () => {
    it("should retrieve all products", async () => {
      const response = await request(app).get("/v1/products").expect(200);

      // Log the actual response body for debugging
      console.log("GET /v1/products response:", response.body);

      expect(response.body.message).toBe("success");

      // Adjust the following line based on the actual structure
      expect(response.body.data.products).toBeInstanceOf(Array);  // Adjust based on actual response structure
      expect(response.body.data.totalItems).toBe(6);  // Add checks for totalItems
    });
  });

  // Test for getting a product by ID
  describe("GET /v1/products/:id", () => {
    it("should retrieve a product by ID", async () => {
      const response = await request(app)
        .get(`/v1/products/${productId}`)
        .expect(200);

      expect(response.body.message).toBe("success");
      expect(response.body.data._id).toBe(productId);
    });
  });

  // Test for updating a product
  describe("PUT /v1/products/:id", () => {
    it("should update the product details", async () => {
      const response = await request(app)
        .put(`/v1/products/${productId}`)
        .send({
          name: "Updated Product",
          category: "Updated Category",
          price: 200,
          image: "updated-image.jpg",
        })
        .expect(200);  // Expect 200 OK

      expect(response.body.message).toBe("success");
      expect(response.body.data.name).toBe("Updated Product");
      expect(response.body.data.price).toBe(200);
    });
  });

  // Test for deleting a product
  describe("DELETE /v1/products/:id", () => {
    it("should delete a product by ID", async () => {
      await request(app).delete(`/v1/products/${productId}`).expect(204);
    });
  });
});
