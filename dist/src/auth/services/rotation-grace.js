"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONCURRENT_ROTATION_GRACE_MS = void 0;
exports.isConcurrentRotation = isConcurrentRotation;
exports.CONCURRENT_ROTATION_GRACE_MS = 60 * 1000;
function isConcurrentRotation(sibling, now = Date.now()) {
    return now - sibling.createdAt.getTime() < exports.CONCURRENT_ROTATION_GRACE_MS;
}
//# sourceMappingURL=rotation-grace.js.map