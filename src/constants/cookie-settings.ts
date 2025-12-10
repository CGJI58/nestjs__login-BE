import { ConfigService } from '@nestjs/config';

export interface ICookieSettings {
  maxAge?: number;
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax' | 'none';
  path?: string;
  domain?: string;
}

export const getCookieSettings = (config: ConfigService) => {
  const FE_DOMAIN = config.get<string>('FE_DOMAIN');
  const IS_LOCAL = FE_DOMAIN === 'localhost';

  return {
    httpOnly: !IS_LOCAL,
    secure: true,
    sameSite: 'none' as const,
    path: '/',
    domain: config.get<string>('BE_DOMAIN'),
  };
};
