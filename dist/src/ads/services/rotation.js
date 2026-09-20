"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickWeighted = pickWeighted;
function pickWeighted(ads, limit, random = Math.random) {
    const pool = new Set(ads);
    const weight = (a) => {
        if (a.maxImpressions === null)
            return 1;
        const remaining = a.maxImpressions - a.impressions;
        return remaining > 0 ? remaining : 1;
    };
    const picked = [];
    while (picked.length < limit && pool.size > 0) {
        const list = [...pool];
        const total = list.reduce((sum, a) => sum + weight(a), 0);
        let draw = random() * total;
        let chosen = list[list.length - 1];
        for (const ad of list) {
            draw -= weight(ad);
            if (draw < 0) {
                chosen = ad;
                break;
            }
        }
        picked.push(chosen);
        pool.delete(chosen);
    }
    return picked;
}
//# sourceMappingURL=rotation.js.map