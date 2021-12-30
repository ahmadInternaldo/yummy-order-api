import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { OrderDto, ResponseOrderDto } from './dto/create-order.dto';
import {  ResponseDeleteOrderDto } from './dto/delete-order.dot';
import { ResponseGetAllProductDto } from './dto/get-all-product.dto';
import { ConnenctionDto } from './dto/status-check.dto';
import { JwtAuthGuard } from './utils/auth/jwt-auth.guard';
import { RoleGuard } from './utils/auth/role.guard';
import { Public } from './utils/decorators/public.decorator';
import { CUSTOMER, Role } from './utils/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  async statusCheck(): Promise<ConnenctionDto> {
    return this.appService.statusCheck();
  }

  @Role(CUSTOMER)
  @Get('products')
  async getAllProduct(@Req() req): Promise<ResponseGetAllProductDto> {
    return this.appService.getAllProduct(req.headers.authorization);
  }

  @Role(CUSTOMER)
  @Post('order')
  async createOrder(
    @Req() req,
    @Body() orderDto: OrderDto,
  ): Promise<ResponseOrderDto> {
    return this.appService.createOrder(req.user.id, orderDto);
  }

  @Role(CUSTOMER)
  @Delete('order/:orderId')
  async deleteOrder(@Param() order: any): Promise<ResponseDeleteOrderDto> {
    return this.appService.deleteOrder(order.orderId)
  }

  @Role(CUSTOMER)
  @Get('orders')
  async getOwnOrder(@Req() req): Promise<any> {
    return this.appService.getOwnOrder(req.user.id)
  }
}
