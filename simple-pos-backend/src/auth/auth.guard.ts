import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if this endpoint should skip auth
    const skipAuth = this.reflector.get<boolean>('skipAuth', context.getHandler());
    if (skipAuth) {
      console.log('Skip auth: True : ', skipAuth)
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    console.log('Extracting auth token from header ...\n Token : ', token);

    if (!token) {
      throw new UnauthorizedException();
    }
    console.log('Verifying auth token..')
    try {
      const payload = await this.jwtService.verifyAsync(token);
      console.log('Verified : ', payload);
      request['user'] = payload;
      
    } catch (error) {
      console.error('JWT Verification failed:', error.message);
      console.error('Token that failed:', token);
      throw new UnauthorizedException(`JWT verification failed: ${error.message}`);
    }
    
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
