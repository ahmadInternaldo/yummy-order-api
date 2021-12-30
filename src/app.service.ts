import { Injectable } from '@nestjs/common';
import { OrderDto, ResponseOrderDto } from './dto/create-order.dto';
import { ResponseDeleteOrderDto } from './dto/delete-order.dot';
import { ResponseGetAllOrderDto } from './dto/get-all-order.dto';
import { ResponseGetAllProductDto } from './dto/get-all-product.dto';
import { ConnenctionDto } from './dto/status-check.dto';
import { successConstant } from './utils/constants/error.constants';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { FilterException } from './utils/exceptions/filter-exception';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from './entities/order';

@Injectable()
export class AppService {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(Order)
    private readonly orderRepo: typeof Order
    ) {}

  async statusCheck(): Promise<ConnenctionDto> {
    return {
      ...successConstant,
      environment: process.env.ENVIRONMENT,
      statusServer: 'ACTIVE',
    };
  }

  async getAllProduct(jwt: string): Promise<ResponseGetAllProductDto> {
    try {
      let products = await this.getAllProductChild(jwt);
      return {
        ...successConstant,
        products: products.products,
      };
    } catch (error) {
      throw new FilterException(error);
    }
  }

  async createOrder(
    customerId: string,
    orderDto: OrderDto,
  ): Promise<ResponseOrderDto> {
    try {
      let newOrder= {
        customerId,
        productId: orderDto.productId,
        productName: orderDto.productName,
        image: orderDto.image,
        price: orderDto.price

      }
      await this.orderRepo.create(newOrder)

      return successConstant
    } catch (error) {
      throw new FilterException(error)
    }
  }


  async deleteOrder(
    orderId: string,
  ): Promise<ResponseDeleteOrderDto> {
    try {
      await this.orderRepo.destroy({
        where: {
          id: orderId
        }
      })
      return successConstant
    } catch (error) {
      throw new FilterException(error)
    }
  }

  async getOwnOrder(
    customerId: string
  ): Promise<ResponseGetAllOrderDto>{
    try {
      let orders = await this.orderRepo.findAll({
        where: {
          customerId
        },
        attributes: ['id', 'customerId', 'productId', 'productName', 'image', 'price']
      })
      return {
        ...successConstant,
        orders
      }
    } catch (error) {
      throw new FilterException(error)
    }
  }

  private async getAllProductChild(jwt: string) {
    try {
      const response = this.httpService
        .get<any>(`${process.env.PRODUCT_URL}`, {
          headers: {
            authorization: jwt,
            datatype: 'JSON',
          },
        })
        .pipe(
          map((axiosResponse: AxiosResponse<any>) => {
            return axiosResponse.data;
          }),
        );
      return firstValueFrom(response);
    } catch (error) {
      return false;
    }
  }
}
