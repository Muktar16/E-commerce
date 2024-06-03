// import { ExecutionContext, Injectable } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';

// @Injectable()
// export class CustomJwtAuthGuard extends AuthGuard('jwt') {
//   private readonly tokenBlacklist: Set<string>;
//   private readonly maxBlacklistSize: number;

//   constructor() {
//     super();
//     this.tokenBlacklist = new Set();
//     this.maxBlacklistSize = 1000;
//   }

//   public isTokenBlacklisted(token: string): boolean {
//     console.log('From isTokenBlacklisted', token);
//     return this.tokenBlacklist.has(token);
//   }

//   private trimBlacklistIfNeeded(): void {
//     if (this.tokenBlacklist.size > this.maxBlacklistSize) {
//       const tokensToRemove = this.tokenBlacklist.size - this.maxBlacklistSize;
//       console.log('Removing', tokensToRemove, 'oldest tokens from blacklist');
//       const oldestTokens = Array.from(this.tokenBlacklist.values()).slice(
//         0,
//         tokensToRemove,
//       );
//       oldestTokens.forEach((token) => this.tokenBlacklist.delete(token));
//     }
//   }
//   canActivate(context: ExecutionContext) {
//     const request = context.switchToHttp().getRequest();
//     const token = request.headers.authorization?.split(' ')[1];
//     console.log();
//     // console.log("all",this.authGeneralService)
//     console.log();
//     try {
//       // const isTokenBlacklisted = this.authGeneralService.isTokenBlacklisted(token);
//       // if (token && isTokenBlacklisted) {
//       //   console.log('Token is blacklisted');
//       //   return false;
//       // }
//       console.log('Token is not blacklisted');
//       return super.canActivate(context);
//     } catch (error) {
//       console.log('Error: ', error);
//     }
//   }
// }
