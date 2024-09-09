import { Controller, Route, Get } from "tsoa";

export interface IItem {
  name: string;
  category: string;
  price: number;
}

@Route("/v1/products")
export class ProductController extends Controller {
  @Get("/")
  public async getAllProducts(): Promise<IItem[]> {
    return [
      { name: "Cherrie", category: "fruit", price: 10.2 },
      { name: "Apple", category: "fruit", price: 5.5 },
    ];
  }
}
