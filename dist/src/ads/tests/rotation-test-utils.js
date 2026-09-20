"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ad = void 0;
exports.mulberry32 = mulberry32;
exports.countWins = countWins;
exports.expectShare = expectShare;
const rotation_1 = require("../services/rotation");
function mulberry32(seed) {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
const ad = (id, maxImpressions, impressions = 0) => ({
    id,
    impressions,
    maxImpressions,
});
exports.ad = ad;
function countWins(ads, iterations, seed) {
    const random = mulberry32(seed);
    const counts = {};
    for (let i = 0; i < iterations; i++) {
        const winner = (0, rotation_1.pickWeighted)(ads, 1, random)[0];
        counts[winner.id] = (counts[winner.id] ?? 0) + 1;
    }
    return counts;
}
function expectShare(counts, id, share, total, tol) {
    expect(counts[id]).toBeGreaterThan(total * share * (1 - tol));
    expect(counts[id]).toBeLessThan(total * share * (1 + tol));
}
//# sourceMappingURL=rotation-test-utils.js.map