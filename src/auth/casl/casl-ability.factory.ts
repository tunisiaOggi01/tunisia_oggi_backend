import { Ability, AbilityBuilder } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';

type Actions = 'create' | 'read' | 'update' | 'delete' | 'manage';
type Subjects =
  | 'Publication'
  | 'Category'
  | 'User'
  | 'Listing'
  | 'Advertisement'
  | 'Newsletter'
  | 'all';
export type AppAbility = Ability<[Actions, Subjects]>;

/** Builds a CASL Ability instance per user role — no raw role string comparisons anywhere. */
@Injectable()
export class CaslAbilityFactory {
  createForUser(role: Role): AppAbility {
    const { can, build } = new AbilityBuilder<AppAbility>(Ability);

    if (role === Role.SUPER_ADMIN) {
      can('manage', 'all');
    } else if (role === Role.EDITOR) {
      can('create', 'Publication');
      can('read', 'Publication');
      can('update', 'Publication');
      can('delete', 'Publication');
      can('read', 'Category');
      can('read', 'User');
      can('update', 'User');
    } else {
      can('read', 'Publication');
      can('read', 'Category');
    }

    return build();
  }
}
