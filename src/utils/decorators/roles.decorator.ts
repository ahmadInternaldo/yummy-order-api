import { SetMetadata } from "@nestjs/common";

export const ADMIN = "ADMIN"
export const CUSTOMER = "CUSTOMER"

export const Role = (PrivilegeList: string) => SetMetadata('role', PrivilegeList);
