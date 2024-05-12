// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { isArray } from 'class-validator';
// import { verify } from 'jsonwebtoken';
// import { Request, Response, NextFunction } from 'express';
// import { ConfigService } from '@nestjs/config'; // Import ConfigService
// import { UserService } from 'src/modules/v1/user/user.service';

// @Injectable()
// export class CurrentUserMiddleware implements NestMiddleware {
//   constructor(private readonly configService: ConfigService, private readonly userService: UserService) {} // Inject ConfigService

//   async use(req: Request, res: Response, next: NextFunction) {
//     const authHeader = req.headers.authorization || req.headers.Authorization;
//     if (!authHeader || isArray(authHeader) || !authHeader.startsWith('Bearer ')) {
//       // req.user = null;
//       next();
//     } else {
//       const token = authHeader.split(' ')[1];
//       try {
//         const { id } = verify(token, this.configService.get('JWT_SECRET')) as { id: number };
//         const user = await this.userService.findOne(id);
//         console.log(user);
//         // req.user = { id }; // Set user information on the request object
//         next();
//       } catch (error) {
//         // Handle token verification errors
//         next(error);
//       }
//     }
//   }
// }
