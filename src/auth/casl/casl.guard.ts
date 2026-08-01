import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory, AppAbility } from './casl-ability.factory';
import { REQUIRE_ABILITY_KEY } from '../decorators/require-ability.decorator';

interface RequiredAbility {
  action: string;
  subject: any;
}

/** Checks request.user's CASL abilities against the handler's @RequireAbility() metadata. */
@Injectable()
export class CaslGuard implements CanActivate {
  constructor(private reflector: Reflector, private caslAbilityFactory: CaslAbilityFactory) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<RequiredAbility[]>(REQUIRE_ABILITY_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required || required.length === 0) return true;

    const { user } = context.switchToHttp().getRequest();
    if (!user) throw new ForbiddenException('Not authenticated');
    const ability: AppAbility = this.caslAbilityFactory.createForUser(user.role);

    for (const { action, subject } of required) {
      if (!ability.can(action as any, subject)) throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
