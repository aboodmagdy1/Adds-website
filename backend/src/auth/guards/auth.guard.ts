import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromCookies(request);
    // extract date form token
    if (!token) {
      throw new UnauthorizedException(
        'You need to be authenticated to access this resource',
      );
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
      });

      request['user'] = payload.sub;
      return true;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  // JWT in Headers
  // private extractTokenFromHeader(request: Request): string | undefined {
  //   const [type, token] = request.headers.authorization?.split(' ') ?? [];
  //   return type === 'Bearer' ? token : undefined;
  // }

  // JWT in Cookies
  private extractTokenFromCookies(request: Request): string | undefined {
    return request.cookies?.auth_token;
  }
}
