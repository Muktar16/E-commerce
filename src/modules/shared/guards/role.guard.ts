// import { CanActivate, ExecutionContext } from '@nestjs/common';
// export class RoleGuard implements CanActivate {
//     private rolePassed:string;
//     constructor(role:string){
//         this.rolePassed = role;
//     }
//   canActivate(context: ExecutionContext): boolean {
//     const ctx = context.switchToHttp();
//     const request:any = ctx.getRequest<Request>();
//     return this.rolePassed === request.user.role;
//   }
// }

import { CanActivate, ExecutionContext } from '@nestjs/common';
export class RoleGuard implements CanActivate {
  private roles: string[];

  constructor(roles: string[]) {
    this.roles = roles;
  }

  canActivate(context: ExecutionContext): boolean {
    const ctx = context.switchToHttp();
    const request:any = ctx.getRequest<Request>();
    const userRole: string = request.user.role;

    return this.roles.some((role) => role === userRole);
  }
}

