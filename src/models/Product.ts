import mongoose, { Document, Schema } from "mongoose";


interface ProductType extends Document {
  name: string;
  price: number;
  category: string;
  stock: number;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true },
});

const Product = mongoose.model<ProductType>("Product", ProductSchema);

export default Product;