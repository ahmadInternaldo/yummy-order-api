export class ResponseGetAllProductDto{
  errorCode: number;
  message: string;
  products: Product
}

class Product {
  id: string;
  productName: string;
  image: string;
  price: number;
}

