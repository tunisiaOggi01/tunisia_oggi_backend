import { HttpException } from '@nestjs/common';
import { RefreshThrottleGuard } from '../guards/refresh-throttle.guard';

function mockContext(ip: string) {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ ip, connection: { remoteAddress: ip } }),
    }),
  } as any;
}

describe('RefreshThrottleGuard', () => {
  let guard: RefreshThrottleGuard;

  beforeEach(() => { guard = new RefreshThrottleGuard(); });

  it('allows the first request from an IP', () => {
    expect(guard.canActivate(mockContext('1.2.3.4'))).toBe(true);
  });

  it('allows up to 5 requests from the same IP', () => {
    for (let i = 0; i < 5; i++) expect(guard.canActivate(mockContext('5.6.7.8'))).toBe(true);
  });

  it('blocks the 6th request from the same IP', () => {
    for (let i = 0; i < 5; i++) guard.canActivate(mockContext('9.9.9.9'));
    expect(() => guard.canActivate(mockContext('9.9.9.9'))).toThrow(HttpException);
  });

  it('treats different IPs independently', () => {
    for (let i = 0; i < 5; i++) guard.canActivate(mockContext('10.0.0.1'));
    expect(() => guard.canActivate(mockContext('10.0.0.1'))).toThrow(HttpException);
    expect(guard.canActivate(mockContext('10.0.0.2'))).toBe(true);
  });
});
