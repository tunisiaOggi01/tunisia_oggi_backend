"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const normalize_search_1 = require("../src/common/normalize-search");
const prisma = new client_1.PrismaClient();
function slugify(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
const articles = [
    {
        category: 'Culture',
        title: 'New Cultural Hub Opens in Tunis',
        body: 'The grand opening of the Mediterranean Arts Pavilion marks a significant milestone in the city\'s ongoing urban revitalization and cultural diplomacy efforts. Situated in the heart of the historic medina district, the pavilion is a stunning fusion of contemporary glass architecture and traditional North African geometric patterns. The center will host rotating exhibitions from both local Tunisian artists and international partners, with a focus on fostering cross-Mediterranean dialogue. City officials project the hub will attract over 200,000 visitors annually and create approximately 150 permanent jobs in the arts and hospitality sectors. The inaugural exhibition features works from twenty-three Tunisian contemporary artists alongside pieces from the permanent collection of the Museum of Modern Art in Paris. Visitors can also enjoy a rooftop cafe overlooking the medina skyline, a reading room dedicated to North African literature, and an outdoor amphitheater for live performances. The project was funded through a public-private partnership that included a substantial grant from the European Union cultural exchange program.',
        tags: ['Architecture', 'Tunis', 'Arts'],
        daysAgo: 0,
        views: 1240,
    },
    {
        category: 'Politics',
        title: 'Economic reform package approved by parliament',
        body: 'In a landmark session that extended late into the night, Tunisia\'s parliament voted overwhelmingly to approve a comprehensive economic reform package aimed at stabilizing the national economy and attracting foreign investment. The package includes sweeping changes to the tax code, streamlined regulations for small and medium enterprises, and new incentives for technology startups. Opposition leaders, while critical of certain provisions, ultimately joined the majority in supporting the bill, citing the urgent need for economic revitalization in the wake of global market pressures. Implementation is expected to begin in the coming fiscal quarter. The reform package represents the most significant economic legislation passed since the 2014 constitution and is seen as a crucial test for the government\'s ability to enact structural change. International financial institutions have welcomed the move, with the IMF signaling its readiness to discuss a new lending program.',
        tags: ['Economy', 'Parliament', 'Reform'],
        daysAgo: 1,
        views: 890,
    },
    {
        category: 'Community',
        title: 'Olive harvest season brings villages together',
        body: 'Across the rolling hills of rural Tunisia, the annual olive harvest has begun, bringing together communities in a tradition that stretches back millennia. In villages near Sfax and Sousse, families and neighbors gather at dawn to beat the branches and collect the precious fruit. Local cooperatives report a promising yield this season, bolstered by favorable autumn rains. The harvest is more than an agricultural event, it is a cultural touchstone that reinforces community bonds. Many families turn the harvest into a festive occasion, with shared meals and music filling the groves. This year, several cooperatives have introduced mobile processing units that allow farmers to press their olives within hours of harvesting, producing extra virgin oil of exceptional quality. Export projections indicate a 15 percent increase over last year, with European markets showing particular interest in Tunisian organic oils.',
        tags: ['Agriculture', 'Tradition', 'Harvest'],
        daysAgo: 2,
        views: 675,
    },
    {
        category: 'National',
        title: 'Sustainable urban transit plan unveiled for the capital',
        body: 'The Ministry of Transport has unveiled an ambitious new urban transit plan for Tunis that promises to reshape how residents and visitors navigate the capital. The centerpiece of the plan is a new light-rail line connecting the northern suburbs to the city center, complemented by expanded bus rapid transit corridors and dedicated cycling lanes. The initiative also includes pedestrian-friendly redesigns of major public squares and the introduction of an integrated fare system that will allow seamless transfers across different modes of transport. Environmental impact assessments project a 30 percent reduction in carbon emissions from transportation within five years of full implementation. The first phase, which breaks ground next spring, will add 18 kilometers of light-rail track and 12 new stations. The total investment is estimated at 1.2 billion Tunisian dinars, with funding from the European Investment Bank and the national budget.',
        tags: ['Transport', 'Urban', 'Environment'],
        daysAgo: 3,
        views: 520,
    },
    {
        category: 'Culture',
        title: 'Preserving the ancient art of Bardo mosaics',
        body: 'In a sunlit workshop on the outskirts of Tunis, master artisans are racing against time to preserve one of the ancient world\'s most exquisite art forms, the polychrome mosaics of Bardo. These intricate works, some dating back to the 2nd century AD, have survived earthquakes, conquests, and the passage of centuries, but now face new threats from urban pollution and climate change. A joint initiative between the National Heritage Institute and UNESCO has trained a new generation of mosaic restorers in traditional techniques, using locally sourced stone and pigments to ensure authenticity. The program also includes digital documentation of every known mosaic in the region, creating a permanent record for future scholarship. Each mosaic fragment is photographed in high resolution, cataloged by pigment composition and origin, and stored in a database accessible to researchers worldwide.',
        tags: ['Heritage', 'Art', 'Bardo'],
        daysAgo: 4,
        views: 430,
    },
    {
        category: 'Environment',
        title: 'Coastal protection project enters second phase',
        body: 'The second phase of Tunisia\'s flagship coastal protection project has been launched along the Gulf of Hammamet, extending the network of artificial reefs and seagrass restoration sites that have already shown promising results. The first phase, completed last year, saw a measurable increase in marine biodiversity and a reduction in coastal erosion rates of up to 40 percent in targeted areas. The new phase will cover an additional 25 kilometers of coastline and introduce innovative wave attenuation structures designed in collaboration with Dutch engineering firms. Local fishing communities have been engaged as partners in the project, with training programs in sustainable fishing practices and marine ecosystem monitoring. The initiative is part of Tunisia\'s broader commitment to the United Nations Decade of Ocean Science for Sustainable Development.',
        tags: ['Environment', 'Coast', 'Biodiversity'],
        daysAgo: 5,
        views: 380,
    },
    {
        category: 'Economy',
        title: 'Tech summit in Sousse attracts global investors',
        body: 'The annual Tunisia Tech Summit opened in Sousse this week with a record attendance of over three thousand participants, including venture capital firms from Silicon Valley, London, and Singapore. The four-day event showcases more than fifty Tunisian startups spanning artificial intelligence, renewable energy, fintech, and agritech. The government announced a new 200 million dinar fund dedicated to early-stage technology companies, along with streamlined visa processes for foreign tech entrepreneurs. Several major announcements are expected before the summit concludes, including the establishment of a regional research and development center by a leading European semiconductor manufacturer. The summit underscores Tunisia\'s growing reputation as a hub for technological innovation in North Africa, with a young, educated population and competitive operating costs driving increased foreign interest.',
        tags: ['Technology', 'Investment', 'Startups'],
        daysAgo: 6,
        views: 340,
    },
    {
        category: 'Community',
        title: 'New archeological findings in Carthage ruins',
        body: 'A team of archaeologists from the University of Tunis and the German Archaeological Institute has uncovered a previously unknown residential quarter in the ancient city of Carthage, shedding new light on everyday life in the Punic and Roman periods. The excavation, which began eighteen months ago, has revealed a remarkably well-preserved neighborhood with mosaic floors, courtyard houses, and an intricate water management system. Among the most significant finds is a collection of over two hundred clay amphorae bearing inscriptions that provide new evidence about trade routes between Carthage and other Mediterranean ports. The artifacts will be cataloged and displayed at the Carthage National Museum, with a public exhibition opening next spring. The discovery has been described as one of the most important archaeological finds in the region in the past decade.',
        tags: ['History', 'Archaeology', 'Carthage'],
        daysAgo: 7,
        views: 290,
    },
    {
        category: 'Environment',
        title: 'Rare bird species spotted in Ichkeul National Park',
        body: 'Birdwatchers and conservationists are celebrating the confirmed sighting of a pair of marbled teal at Ichkeul National Park, a species previously thought to have disappeared from Tunisian wetlands. The sighting was made by park rangers during the annual migratory bird census and later verified by ornithologists from the Tunisian Association of Wildlife. Ichkeul, a UNESCO World Heritage site, is one of the most important wetlands in North Africa and a vital stopover for hundreds of thousands of migratory birds traveling between Europe and Africa. Conservation efforts in recent years, including water level management and the removal of invasive plant species, have contributed to the park\'s ecological recovery. Environmental groups are calling for expanded protected zones around the lake to ensure the long-term survival of both resident and migratory species.',
        tags: ['Wildlife', 'Conservation', 'UNESCO'],
        daysAgo: 8,
        views: 250,
    },
    {
        category: 'Economy',
        title: 'Tunisian olive oil wins top honors in international competition',
        body: 'A family-owned farm in the hills of Zaghouan has been awarded the gold medal at the International Olive Oil Competition in Rome, beating entries from Italy, Spain, and Greece. The winning oil, produced from a blend of Chemlali and Koroneiki olives, was praised by judges for its complex flavor profile with notes of artichoke, green almond, and fresh tomato. The recognition comes at a time when Tunisian olive oil exports are reaching record levels, with shipments to the United States and Japan growing particularly fast. The farm employs traditional harvesting methods combined with modern cold-press extraction technology, a approach that has attracted interest from agricultural researchers studying how to maintain quality while scaling production. The award is expected to boost demand for Tunisian premium olive oil in high-end international markets.',
        tags: ['Agriculture', 'Award', 'Export'],
        daysAgo: 9,
        views: 210,
    },
    {
        category: 'Politics',
        title: 'New cybersecurity law sparks debate on digital rights',
        body: 'A proposed cybersecurity law currently before parliament has ignited a heated debate between proponents of stronger digital defenses and advocates for civil liberties. The bill would require companies operating in Tunisia to store certain categories of user data on local servers and grant authorities expanded powers to investigate cybercrimes. Supporters argue the legislation is essential to protect critical infrastructure and combat the rising tide of ransomware attacks that have targeted Tunisian banks and government agencies in the past year. Critics, including several human rights organizations and the Tunisian Bar Association, warn that vague language in the bill could be used to suppress legitimate dissent and limit press freedom online. A parliamentary committee has begun reviewing amendments aimed at addressing these concerns, with a final vote expected before the end of the session.',
        tags: ['Legislation', 'Privacy', 'Technology'],
        daysAgo: 10,
        views: 180,
    },
    {
        category: 'National',
        title: 'High-speed rail feasibility study between Tunis and Sfax',
        body: 'The Ministry of Transport has commissioned a feasibility study for a high-speed rail line connecting Tunis to Sfax, a project that could cut travel time between the two largest cities from over three hours to just seventy minutes. The proposed line would cover approximately 270 kilometers with intermediate stops in Hammamet, Sousse, and Monastir. Preliminary estimates suggest the project could cost between four and six billion Tunisian dinars and create thousands of construction jobs during the building phase. Japanese and French rail consortiums have already expressed interest in bidding on the project, which would be the first high-speed rail line in North Africa outside of Morocco. The study, funded by a grant from the Japanese International Cooperation Agency, is expected to be completed within twelve months and will assess environmental impact, ridership projections, and financing options.',
        tags: ['Infrastructure', 'Transport', 'Investment'],
        daysAgo: 11,
        views: 150,
    },
];
async function main() {
    const passwordHash = await bcrypt.hash('ChangeMe123!', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@tunisiaoggi.com' },
        update: {},
        create: { email: 'admin@tunisiaoggi.com', username: 'admin', passwordHash, role: client_1.Role.SUPER_ADMIN },
    });
    const editor = await prisma.user.upsert({
        where: { email: 'editor@tunisiaoggi.com' },
        update: {},
        create: { email: 'editor@tunisiaoggi.com', username: 'editor', passwordHash, role: client_1.Role.EDITOR },
    });
    const categoryData = [
        { name: 'National', slug: 'national', color: '#8B1E1E' },
        { name: 'Politics', slug: 'politics', color: '#1E3A8A' },
        { name: 'Community', slug: 'community', color: '#4B5563' },
        { name: 'Culture', slug: 'culture', color: '#8B1E1E' },
        { name: 'Economy', slug: 'economy', color: '#1E3A8A' },
        { name: 'Environment', slug: 'environment', color: '#78716C' },
    ];
    const categoryMap = new Map();
    for (const cat of categoryData) {
        const created = await prisma.category.upsert({ where: { slug: cat.slug }, update: {}, create: cat });
        categoryMap.set(cat.slug, created.id);
    }
    const authors = [admin, editor];
    for (const art of articles) {
        const slug = slugify(art.title);
        const catSlug = art.category.toLowerCase();
        const categoryId = categoryMap.get(catSlug);
        if (!categoryId)
            continue;
        const publishedAt = new Date();
        publishedAt.setDate(publishedAt.getDate() - art.daysAgo);
        publishedAt.setHours(8 + (art.daysAgo % 12), 0, 0, 0);
        await prisma.publication.upsert({
            where: { slug },
            update: {},
            create: {
                title: art.title,
                slug,
                body: art.body,
                status: client_1.PublicationStatus.PUBLISHED,
                publishedAt,
                featuredImageUrl: art.daysAgo === 0
                    ? 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&q=80&w=1200'
                    : `https://picsum.photos/seed/${slug}/1200/800`,
                searchText: (0, normalize_search_1.normalizeSearchText)(`${art.title} ${art.body}`),
                views: art.views,
                tags: art.tags,
                authorId: authors[art.daysAgo % authors.length].id,
                categoryId,
            },
        });
    }
    console.log(`Seed complete — 2 users, 6 categories, ${articles.length} articles`);
}
main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
//# sourceMappingURL=seed.js.map