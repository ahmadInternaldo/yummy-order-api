export class OrderDto {
  productId: string;
  productName: string;
  image: string;
  price: number
}

export class ResponseOrderDto {
  errorCode: number;
  message: string;
}