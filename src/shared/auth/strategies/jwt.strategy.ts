import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionEntity } from '../entities/sessions.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const token = payload.token;
    const session = await this.sessionRepository.findOne({
      where: { token },
      relations: { user: true },
    });
    if (!session) {
      throw new HttpException('Invalid token', 401);
    }
    console.log('Extracted User: ', payload);
    return payload;
  }
}

// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { PassportStrategy } from '@nestjs/passport';
// import { InjectRepository } from '@nestjs/typeorm';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { SessionEntity } from '../entities/sessions.entity';
// import { Repository } from 'typeorm';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(
//     private readonly configService: ConfigService,
//     @InjectRepository(SessionEntity)
//     private readonly sessionRepository: Repository<SessionEntity>,
//   ) {
//     super({
//       jwtFromRequest: async(req: any) => {
//         const token = req.headers.authorization?.split(' ')[1];
//         const newToken = await this.sessionRepository.findOne({where:{token}});
//         console.log('New Token: ', newToken.token);
//         return newToken.token;
//       },
//       ignoreExpiration: false,
//       secretOrKey: configService.get('JWT_SECRET'),
//     });
//   }

//   // async isTokenExist(token: string): Promise<boolean> {
//   //   console.log('Token: ', this.sessionRepository)
//   //   const session = await this.sessionRepository.findOne({
//   //     where: { token: token },
//   //   });
//   //   console.log('Session: ', session);
//   //   return session ? true : false;
//   // }

//   async validate(payload: any) {
//     console.log('Extracted User: ', payload);
//     return payload;
//   }
// }
