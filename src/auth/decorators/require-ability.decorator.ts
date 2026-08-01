import { SetMetadata } from '@nestjs/common';

export const REQUIRE_ABILITY_KEY = 'require_ability';

/** Declares what CASL action+subject the handler requires. Repeatable on one method. */
export const RequireAbility = (action: string, subject: any) =>
  SetMetadata(REQUIRE_ABILITY_KEY, [{ action, subject }]);
