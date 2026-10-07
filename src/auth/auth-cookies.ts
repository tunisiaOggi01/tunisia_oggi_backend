import { Response } from 'express';

/**
 * The refresh cookie is scoped to the refresh endpoint. The frontend reaches the API
 * either directly (/auth/refresh) or through its Vercel proxy (/api/auth/refresh),
 * so the cookie is issued for both paths.
 */
const REFRESH_COOKIE_PATHS = ['/auth/refresh', '/api/auth/refresh'];

/** Sets the access + refresh auth cookies on the response. */
export function setAuthCookies(
  res: Response,
  token: string,
  refreshToken: string,
) {
  const secure = process.env.NODE_ENV === 'production';
  const sameSite = secure ? 'none' : 'lax';
  res.cookie('access_token', token, {
    httpOnly: true,
    secure,
    sameSite,
    maxAge: 15 * 60 * 1000,
  });
  for (const path of REFRESH_COOKIE_PATHS) {
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure,
      sameSite,
      path,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}

/** Clears the auth cookies set by setAuthCookies. */
export function clearAuthCookies(res: Response) {
  res.clearCookie('access_token');
  for (const path of REFRESH_COOKIE_PATHS) {
    res.clearCookie('refresh_token', { path });
  }
}
