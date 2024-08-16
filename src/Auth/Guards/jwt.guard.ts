import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { CONSTANT } from 'utils/constants';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();

    for (let i = 0; i < CONSTANT.BY_PASS_URL.length; i++) {
      if (req.url == CONSTANT.BY_PASS_URL[i]) {
        return true;
      }
    }
    return super.canActivate(context);
  }
}
