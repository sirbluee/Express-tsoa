import { Schema, model } from "mongoose";

// Interface to describe a single document
export interface ProductTypes {
  name: string;
  category: string;
  price: number;
  image: string;
}

// Schema definition
const ProductSchema = new Schema({
  name: { type: String, required: true }, // Corrected `require` to `required`
  category: { type: String, required: true }, // Corrected `require` to `required`
  price: { type: Number, required: true }, // Corrected `require` to `required`
  image: { type: String, required: false }, // Corrected `require` to `required`
});

// Create a model from the schema
const ProductModel = model<ProductTypes>("Product", ProductSchema);

export default ProductModel;
