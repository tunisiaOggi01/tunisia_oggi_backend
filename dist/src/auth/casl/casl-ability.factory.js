"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaslAbilityFactory = void 0;
const ability_1 = require("@casl/ability");
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let CaslAbilityFactory = class CaslAbilityFactory {
    createForUser(role) {
        const { can, build } = new ability_1.AbilityBuilder(ability_1.Ability);
        if (role === client_1.Role.SUPER_ADMIN) {
            can('manage', 'all');
        }
        else if (role === client_1.Role.EDITOR) {
            can('create', 'Publication');
            can('read', 'Publication');
            can('update', 'Publication');
            can('delete', 'Publication');
            can('read', 'Category');
            can('read', 'User');
            can('update', 'User');
        }
        else {
            can('read', 'Publication');
            can('read', 'Category');
        }
        return build();
    }
};
exports.CaslAbilityFactory = CaslAbilityFactory;
exports.CaslAbilityFactory = CaslAbilityFactory = __decorate([
    (0, common_1.Injectable)()
], CaslAbilityFactory);
//# sourceMappingURL=casl-ability.factory.js.map