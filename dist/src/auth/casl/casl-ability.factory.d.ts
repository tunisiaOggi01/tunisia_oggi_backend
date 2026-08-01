import { Ability } from '@casl/ability';
import { Role } from '@prisma/client';
type Actions = 'create' | 'read' | 'update' | 'delete' | 'manage';
type Subjects = 'Publication' | 'Category' | 'User' | 'all';
export type AppAbility = Ability<[Actions, Subjects]>;
export declare class CaslAbilityFactory {
    createForUser(role: Role): AppAbility;
}
export {};
