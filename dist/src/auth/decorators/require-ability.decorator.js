"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireAbility = exports.REQUIRE_ABILITY_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.REQUIRE_ABILITY_KEY = 'require_ability';
const RequireAbility = (action, subject) => (0, common_1.SetMetadata)(exports.REQUIRE_ABILITY_KEY, [{ action, subject }]);
exports.RequireAbility = RequireAbility;
//# sourceMappingURL=require-ability.decorator.js.map