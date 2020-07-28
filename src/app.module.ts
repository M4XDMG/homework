import { CacheInterceptor, CacheModule, HttpModule, HttpService, Module } from '@nestjs/common';
import { HeroController } from './controllers/hero.controller';
import { UserController } from './controllers/user.controller';
import { HeroService } from './services/hero.service';
import { UserService } from './services/user.service';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './services/auth.service';
import { HeroRepository, UserRepository } from './repositories';
import { CacheService } from './services/cache.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { JwrStrategy } from './strategy/jwr.strategy';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [
    HttpModule,
    CacheModule.register({ttl: 5}),
    PassportModule.register({
      defaultStrategy: "jwt"
    }),
    JwtModule.register({
      secret: "topSecret51",
      signOptions:  {
        expiresIn: 3600
      }
    })
  ],
  controllers: [
    HeroController,
    UserController,
    AuthController,
  ],
  providers: [
    HeroService,
    UserService,
    HeroRepository,
    UserRepository,
    AuthService,
    JwrStrategy,
    CacheService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    }
  ],
  exports: [
    JwrStrategy,
    PassportModule,
  ]
})
export class AppModule {}
