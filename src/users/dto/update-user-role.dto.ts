import { IsEnum } from 'class-validator';
import { Role } from '@prisma/client';

/** Request body for PATCH /users/:id/role. */
export class UpdateUserRoleDto {
  @IsEnum(Role)
  role: Role;
}
