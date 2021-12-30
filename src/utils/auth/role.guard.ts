import { HttpService } from '@nestjs/axios';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { errorAccess, kickOutAccount } from '../constants/error.constants';
import { FilterException } from '../exceptions/filter-exception';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly httpService: HttpService,
  ) {}
  async canActivate(context: ExecutionContext) {
    try {
      const role = this.reflector.get<string[]>('role', context.getHandler());

      if (!role) {
        return true;
      }
      const headers = context.switchToHttp().getRequest().headers;
      const privilege: any = await this.getPrivilege(headers.authorization);
      if (!privilege) {
        throw new ForbiddenException(kickOutAccount)
      } else if (privilege.userType === role) {
        return true;
      } else {
        throw new ForbiddenException(errorAccess);
      }
    } catch (error) {
      throw new FilterException(error);
    }
  }

  private async getPrivilege(jwt: string) {
    try {
      const response = this.httpService
        .get<any>(`${process.env.PRIVILEGE_URL}`, {
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
      const responseCheck = await firstValueFrom(response);
      return responseCheck;
      
    } catch (error) {
      return false
    }
  }
}
