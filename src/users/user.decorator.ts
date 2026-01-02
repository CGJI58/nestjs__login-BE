import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from 'src/@types/types';

export const User = createParamDecorator<keyof JwtPayload | undefined>(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user; // passport-jwt 에서 넣어준 값
    return data ? user?.[data] : user;
  },
);
