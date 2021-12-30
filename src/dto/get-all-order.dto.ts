export class ResponseGetAllOrderDto {
  errorCode: number;
  message: string;
  orders: Order[];
}

class Order {
  customerId: string;
  productId: string;
  productName: string;
  image: string;
  price: number;
}