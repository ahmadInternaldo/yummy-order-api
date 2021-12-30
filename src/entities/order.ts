import { Column, DataType, Length, Table } from 'sequelize-typescript';
import BaseModel from './baseModel';

@Table({ tableName: 'orders' })
export class Order extends BaseModel {

  @Column
  customerId: string

  @Column
  productId: string

  @Length({ max: 50, min: 6 })
  @Column(DataType.STRING)
  productName: string;

  @Column
  image: string;

  @Column
  price: number;

}
