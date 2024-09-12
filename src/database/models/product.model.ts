import { Schema, model } from 'mongoose';

// Interface to describe a single document
export interface ProductTypes {
  name: string;
  category: string;
  price: number;
}

// Schema definition
const ProductSchema = new Schema({
  name: { type: String, require: true },
  category: { type: String, require: true },
  price: { type: Number, require: true }
})

// Create a model from the schema
const ProductModel = model<ProductTypes>('Product', ProductSchema);

export default ProductModel;