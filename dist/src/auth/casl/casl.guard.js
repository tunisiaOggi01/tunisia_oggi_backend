"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaslGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const casl_ability_factory_1 = require("./casl-ability.factory");
const require_ability_decorator_1 = require("../decorators/require-ability.decorator");
let CaslGuard = class CaslGuard {
    reflector;
    caslAbilityFactory;
    constructor(reflector, caslAbilityFactory) {
        this.reflector = reflector;
        this.caslAbilityFactory = caslAbilityFactory;
    }
    canActivate(context) {
        const required = this.reflector.getAllAndOverride(require_ability_decorator_1.REQUIRE_ABILITY_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!required || required.length === 0)
            return true;
        const { user } = context.switchToHttp().getRequest();
        if (!user)
            throw new common_1.ForbiddenException('Not authenticated');
        const ability = this.caslAbilityFactory.createForUser(user.role);
        for (const { action, subject } of required) {
            if (!ability.can(action, subject))
                throw new common_1.ForbiddenException('Insufficient permissions');
        }
        return true;
    }
};
exports.CaslGuard = CaslGuard;
exports.CaslGuard = CaslGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector, casl_ability_factory_1.CaslAbilityFactory])
], CaslGuard);
//# sourceMappingURL=casl.guard.js.map