import { ForbiddenException } from '@nestjs/common';
import { CsrfGuard } from '../guards/csrf.guard';

function mockContext(
  header: string | undefined,
  csrfClaim: string | undefined,
) {
  return {
    switchToHttp: () => ({
      getRequest: () => ({
        headers: { 'x-csrf-token': header },
        csrfClaim,
      }),
    }),
  } as any;
}

describe('CsrfGuard', () => {
  let guard: CsrfGuard;

  beforeEach(() => {
    guard = new CsrfGuard();
  });

  it('passes when header matches claim', () => {
    expect(guard.canActivate(mockContext('abc123', 'abc123'))).toBe(true);
  });

  it('throws when header is missing', () => {
    expect(() => guard.canActivate(mockContext(undefined, 'abc123'))).toThrow(
      ForbiddenException,
    );
  });

  it('throws when header does not match claim', () => {
    expect(() => guard.canActivate(mockContext('wrong', 'abc123'))).toThrow(
      ForbiddenException,
    );
  });

  it('throws when both header and claim are undefined', () => {
    expect(() => guard.canActivate(mockContext(undefined, undefined))).toThrow(
      ForbiddenException,
    );
  });
});
