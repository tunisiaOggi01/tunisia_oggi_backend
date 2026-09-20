const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const doc = new PDFDocument({
  size: 'A4',
  margin: 50,
  bufferPages: true,
});

const outputPath = path.join(__dirname, '../docs/RAPPORT_PFA_TUNISIA_OGGI.pdf');
const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

// Colors
const BRAND_RED = '#8B1E1E';
const BRAND_BLUE = '#1E3A8A';
const DARK_GRAY = '#1F2937';
const LIGHT_BG = '#F3F4F6';
const BORDER_GRAY = '#CBD5E1';

function addHeaderFooter() {
  const pages = doc.bufferedPageRange();
  for (let i = 1; i < pages.count; i++) {
    doc.switchToPage(i);
    // Header
    doc.font('Helvetica-Bold').fontSize(8).fillColor(BRAND_RED)
       .text('PFA — 4ème année GL', 50, 25);
    doc.font('Helvetica').fontSize(8).fillColor('#64748B')
       .text('Tunisia Oggi — Rapport de Projet de Fin d’Année', 200, 25, { align: 'right' });
    doc.moveTo(50, 38).lineTo(545, 38).strokeColor(BRAND_RED).lineWidth(0.5).stroke();

    // Footer
    doc.moveTo(50, 790).lineTo(545, 790).strokeColor('#E2E8F0').lineWidth(0.5).stroke();
    doc.font('Helvetica').fontSize(8).fillColor('#64748B')
       .text(`Page ${i + 1} / ${pages.count}`, 50, 800, { align: 'center' });
  }
}

function addTitle(text, level = 1) {
  if (level === 1) {
    doc.addPage();
    doc.font('Helvetica-Bold').fontSize(20).fillColor(BRAND_RED).text(text, { spaceBefore: 20, spaceAfter: 15 });
    doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor(BRAND_RED).lineWidth(1.5).stroke();
    doc.moveDown(1);
  } else if (level === 2) {
    doc.moveDown(1);
    doc.font('Helvetica-Bold').fontSize(14).fillColor(BRAND_BLUE).text(text);
    doc.moveDown(0.5);
  } else if (level === 3) {
    doc.moveDown(0.8);
    doc.font('Helvetica-Bold').fontSize(11).fillColor(DARK_GRAY).text(text);
    doc.moveDown(0.3);
  }
}

function addParagraph(text) {
  doc.font('Helvetica').fontSize(10).fillColor(DARK_GRAY).text(text, { align: 'justify', lineGap: 3 });
  doc.moveDown(0.5);
}

function addMermaidBox(title, code) {
  doc.moveDown(0.5);
  doc.font('Helvetica-Bold').fontSize(9).fillColor(BRAND_RED).text(`[DIAGRAMME MERMAID] ${title}`);
  doc.moveDown(0.3);

  const startY = doc.y;
  const lines = code.trim().split('\n');
  const boxHeight = lines.length * 12 + 16;

  if (startY + boxHeight > 750) {
    doc.addPage();
  }

  const rectY = doc.y;
  doc.rect(50, rectY, 495, boxHeight).fillAndStroke('#F8FAFC', BRAND_BLUE);
  
  let textY = rectY + 8;
  lines.forEach(line => {
    doc.font('Courier').fontSize(8.5).fillColor('#1E293B').text(line, 60, textY);
    textY += 12;
  });

  doc.y = rectY + boxHeight + 10;
  doc.moveDown(0.5);
}

function addScreenshotBox(figNum, title, desc, url) {
  doc.moveDown(0.5);
  doc.font('Helvetica-Bold').fontSize(10).fillColor(BRAND_RED).text(`Figure ${figNum}: ${title}`);
  doc.font('Helvetica-Oblique').fontSize(8.5).fillColor('#64748B').text(`URL: ${url}`);
  doc.moveDown(0.3);

  const boxY = doc.y;
  doc.rect(50, boxY, 495, 100).fillAndStroke(LIGHT_BG, BORDER_GRAY);
  doc.font('Helvetica-Bold').fontSize(12).fillColor('#94A3B8').text(`[CAPTURE D'ÉCRAN -- ${title}]`, 60, boxY + 40, { align: 'center', width: 475 });
  
  doc.y = boxY + 110;
  doc.font('Helvetica-Oblique').fontSize(9).fillColor('#334155').text(desc, { align: 'justify' });
  doc.moveDown(1);
}

// ==========================================
// 1. PAGE DE GARDE
// ==========================================
doc.font('Helvetica-Bold').fontSize(11).fillColor(DARK_GRAY).text('RÉPUBLIQUE TUNISIENNE', { align: 'center' });
doc.font('Helvetica').fontSize(9).text('Ministère de l’Enseignement Supérieur et de la Recherche Scientifique', { align: 'center' });
doc.font('Helvetica-Bold').fontSize(12).fillColor(BRAND_BLUE).text('ÉCOLE INTERNATIONALE SUPÉRIEURE PRIVÉE POLYTECHNIQUE DE SOUSSE', { align: 'center' });
doc.font('Helvetica-Bold').fontSize(11).fillColor(BRAND_RED).text('(EPI DIGITAL SCHOOL)', { align: 'center' });
doc.moveDown(1);
doc.font('Helvetica-Oblique').fontSize(10).text('Année Universitaire : 2025 / 2026', { align: 'center' });
doc.moveDown(2);

doc.font('Helvetica-Bold').fontSize(24).fillColor(BRAND_RED).text('RAPPORT DE PROJET', { align: 'center' });
doc.font('Helvetica-Bold').fontSize(24).fillColor(BRAND_RED).text('DE FIN D’ANNÉE', { align: 'center' });
doc.moveDown(1);

doc.font('Helvetica').fontSize(11).fillColor(DARK_GRAY).text('Pour l’obtention du Diplôme National d’Ingénieur en Génie Logiciel', { align: 'center' });
doc.font('Helvetica-Bold').fontSize(10).text('Spécialité : Génie Logiciel (4ème Année GL)', { align: 'center' });
doc.moveDown(2);

doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor(BRAND_RED).lineWidth(2).stroke();
doc.moveDown(1);
doc.font('Helvetica-Bold').fontSize(14).fillColor(BRAND_RED).text('INTITULÉ :', { align: 'center' });
doc.font('Helvetica-Bold').fontSize(15).fillColor(DARK_GRAY).text('CONCEPTION ET RÉALISATION D’UNE PLATEFORME WEB ÉDITORIALE ET D’UN ANNUAIRE DES PROFESSIONNELS :', { align: 'center' });
doc.font('Helvetica-Bold').fontSize(18).fillColor(BRAND_RED).text('"TUNISIA OGGI"', { align: 'center' });
doc.moveDown(1);
doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor(BRAND_RED).lineWidth(2).stroke();
doc.moveDown(3);

doc.font('Helvetica-Bold').fontSize(10).text('Lieu de stage : EPI Digital School\t\t\t\tRéalisé par : Mohamed Iyed TOUATI');

// ==========================================
// 2. DÉDICACE & REMERCIEMENTS
// ==========================================
addTitle('Dédicace');
addParagraph('À mes parents, pour tous les innombrables sacrifices qu\'ils ont faits et pour tout le soutien qu\'ils m\'ont apporté tout au long de mes études.');
addParagraph('À mes frères, Farouk et Fakhri, qui ont toujours été là pour moi, pour leurs conseils et leur soutien inconditionnel.');
addParagraph('À mes enseignants et superviseurs, avec tout mon respect et ma plus grande gratitude.');

addTitle('Remerciements');
addParagraph('Je tiens à exprimer ma sincère gratitude à toutes les personnes qui ont contribué au succès de ce projet de fin d\'année, tout particulièrement l\'équipe pédagogique de l\'EPI Digital School ainsi que les membres du jury pour avoir accepté d\'évaluer mon travail.');

// ==========================================
// 3. INTRODUCTION GÉNÉRALE
// ==========================================
addTitle('Introduction Générale');
addParagraph('Dans le monde actuel connecté, l\'accès à une information de presse ciblée et la mise en réseau professionnelle au sein des communautés expatriées représentent un enjeu stratégique. La communauté italienne résidant ou investissant en Tunisie ne disposait pas jusqu\'ici d\'un portail unifié intégrant à la fois un journalisme d\'actualité de qualité et un annuaire professionnel vérifié.');
addParagraph('Pour répondre à ces enjeux, le projet Tunisia Oggi vise à concevoir et réaliser une plateforme web moderne bilingue (Italien / Français), reposant sur un journal d\'actualités réactif, un annuaire des professionnels à soumission modérée et un moteur de régie publicitaire à rotation pondérée.');

// ==========================================
// 4. CHAPITRE 1 : PRÉSENTATION GÉNÉRALE
// ==========================================
addTitle('Chapitre 1 : Présentation générale du projet');
addTitle('1.1 Contexte et problématique', 2);
addParagraph('L\'analyse du marché et les retours d\'expérience de la communauté italienne en Tunisie ont mis en évidence plusieurs insuffisances majeures : manque de centralisation de l\'information, absence de modération sur les annuaires existants, et manque de visibilité pour les professionnels locaux.');

addTitle('1.2 Objectifs spécifiques du projet', 2);
addParagraph('1. Portail Éditorial Réactif avec calcul automatique du score de pertinence rankScore.\n2. Annuaire des Professionnels (Business Directory) à modération contrôlée.\n3. Régie publicitaire pondérée avec comptage d\'impressions via IntersectionObserver.\n4. Architecture Clean sous NestJS 11 et React 19.');

// ==========================================
// 5. CHAPITRE 2 : ANALYSE DES BESOINS & DIAGRAMMES CAS D'UTILISATION
// ==========================================
addTitle('Chapitre 2 : Analyse et modélisation des besoins');
addTitle('2.1 Exigences fonctionnelles et non fonctionnelles', 2);
addParagraph('Le système gère l\'authentification JWT avec rotation de Refresh Token, la double protection CSRF, la sanitization des contenus HTML, et le contrôle d\'accès granulaire basé sur les rôles via CASL.');

addTitle('2.2 Diagrammes des Cas d\'Utilisation UML (Mermaid)', 2);
addMermaidBox('1. Diagramme de Cas d\'Utilisation Global', `
graph TD
    subgraph Système Tunisia Oggi
        UC1[Consulter les actualités]
        UC2[Rechercher dans l'annuaire]
        UC3[Créer/Éditer un article]
        UC4[Réagir et commenter]
        UC5[Soumettre une fiche d'entreprise]
        UC6[Modérer l'annuaire]
        UC7[Gérer les bannières publicitaires]
        UC8[Gérer les catégories & utilisateurs]
    end

    Lecteur((Lecteur / Membre)) --> UC1
    Lecteur --> UC2
    Lecteur --> UC4
    Lecteur --> UC5

    Admin((Super Administrateur)) --> UC3
    Admin --> UC6
    Admin --> UC7
    Admin --> UC8
`);

addMermaidBox('2. Diagramme de Cas d\'Utilisation Détaillé -- Module Éditorial', `
graph TD
    subgraph Module Publications
        UC_Create[Créer un article]
        UC_Draft[Sauvegarder brouillon]
        UC_Slug[Générer slug UTF-8]
        UC_Sanitize[Assainir contenu HTML]
        UC_Publish[Publier l'article]
    end

    Editeur((Éditeur / Admin)) --> UC_Create
    UC_Create .->|include| UC_Draft
    UC_Create .->|include| UC_Slug
    UC_Create .->|include| UC_Sanitize
    UC_Publish .->|extends| UC_Create
`);

addMermaidBox('3. Diagramme de Cas d\'Utilisation Détaillé -- Annuaire & Modération', `
graph TD
    subgraph Module Annuaire & Modération
        UC_Submit[Soumettre une fiche d'entreprise]
        UC_Review[Réviser la candidature]
        UC_Approve[Approuver la fiche]
        UC_Reject[Rejeter la fiche]
        UC_Track[Comptabiliser les clics]
    end

    User((Utilisateur / Membre)) --> UC_Submit
    Admin((Super Admin)) --> UC_Review
    UC_Review --> UC_Approve
    UC_Review --> UC_Reject
    Lecteur((Visiteur)) --> UC_Track
`);

// ==========================================
// 6. CHAPITRE 3 : CONCEPTION & DIAGRAMMES DE FLUX, SÉQUENCE ET CLASSES
// ==========================================
addTitle('Chapitre 3 : Conception et modélisation du système');
addTitle('3.1 Diagrammes de Flux (Flow Diagrams)', 2);

addMermaidBox('4. Diagramme de Flux 1 -- Architecture & Pipeline de Données', `
flowchart LR
    Client["Client React 19 SPA"] -->|HTTPS + Cookie JWT| Axios["Axios Interceptor Queue"]
    Axios -->|X-CSRF-Token| NestJS["NestJS 11 Backend API"]
    NestJS -->|Guards & CASL| Services["Repository Services"]
    Services -->|Prisma ORM 5.22| PostgreSQL[("PostgreSQL DB")]
    Services -->|Buffer Upload| Cloudinary[("Cloudinary Media CDN")]
`);

addMermaidBox('5. Diagramme de Flux 2 -- Parcours de Création & Auto-Sauvegarde d\'Article', `
flowchart TD
    Start([Saisie de l'Éditeur]) --> TitleCheck{Titre & Catégorie renseignés ?}
    TitleCheck -- Non --> Wait[Attente de la saisie complète]
    TitleCheck -- Oui --> IdleTimer[Minuteur auto-save 2s]
    IdleTimer --> SaveDraft[POST /admin/publications status=DRAFT]
    SaveDraft --> UpdateDraftId[Mise à jour draftId]
    UpdateDraftId --> ClickPublish{Clic sur Publier ?}
    ClickPublish -- Oui --> SanitizeSlug[Sanitization HTML + Slug NFD]
    SanitizeSlug --> PublishDB[(Mise à jour DB status=PUBLISHED)]
    PublishDB --> InvalidateCache[Invalidation du cache TanStack Query]
    InvalidateCache --> End([Article publié sur le site])
`);

addTitle('3.2 Diagrammes de Séquence Détaillés (Sequence Diagrams)', 2);

addMermaidBox('6. Diagramme de Séquence 1 -- Authentification & Rotation de Refresh Token', `
sequenceDiagram
    autonumber
    actor User as Utilisateur / Navigateur
    participant SPA as Frontend React 19
    participant AuthGuard as JwtAuthGuard / CsrfGuard
    participant AuthSvc as AuthService / RefreshTokenService
    participant DB as Base de Données PostgreSQL

    User->>SPA: Clique sur une action protégée
    SPA->>AuthGuard: GET /admin/publications (Cookie access_token)
    AuthGuard-->>SPA: 401 Unauthorized (Token expiré)
    SPA->>AuthSvc: POST /auth/refresh (Cookie refresh_token)
    AuthSvc->>DB: Recherche hash du refresh_token (Vérification famille & révocation)
    DB-->>AuthSvc: Valide & Grace Window OK (60s tolerance)
    AuthSvc->>DB: Révoque ancien jeton & crée nouveau jeton dans la famille
    AuthSvc-->>SPA: 200 OK (Nouveau access_token + Cookie refresh + X-CSRF-Token)
    SPA->>AuthGuard: Rejoue la requête initiale avec le nouveau X-CSRF-Token
    AuthGuard-->>SPA: 200 OK (Données sécurisées retournées)
`);

addMermaidBox('7. Diagramme de Séquence 2 -- Soumission & Validation d\'une Fiche Annuaire', `
sequenceDiagram
    autonumber
    actor Pro as Professionnel / Membre
    participant SPA as Interface Annuaire
    participant API as ListingsAdminController
    participant Svc as ListingsAdminService
    participant DB as PostgreSQL
    actor Admin as Super Administrateur

    Pro->>SPA: Rempli le formulaire d'entreprise
    SPA->>API: POST /listings (Données entreprise)
    API->>Svc: create(dto, createdById)
    Svc->>DB: Enregistre la fiche avec status = PENDING
    DB-->>SPA: 201 Created (Fiche en attente de modération)
    Admin->>SPA: Ouvre la console de modération
    SPA->>API: PATCH /admin/listings/:id/status (status = APPROVED)
    API->>Svc: updateStatus(id, APPROVED)
    Svc->>DB: Met à jour status = APPROVED et reviewedAt = Now()
    DB-->>SPA: Fiche publiée dans l'annuaire public
`);

addTitle('3.3 Diagramme de Classes UML (Class Diagram)', 2);

addMermaidBox('8. Diagramme de Classes UML du Système', `
classDiagram
    class User {
        +String id
        +String email
        +String username
        +Role role
        +Boolean profileCompleted
    }

    class Publication {
        +String id
        +String title
        +String slug
        +String body
        +PublicationStatus status
        +Float rankScore
        +Int views
    }

    class Category {
        +String id
        +String name
        +String slug
        +String color
    }

    class BusinessListing {
        +String id
        +String businessName
        +BusinessCategory category
        +ListingStatus status
        +Int phoneClicks
    }

    class Advertisement {
        +String id
        +String title
        +AdPlacement placement
        +Int impressions
        +Int maxImpressions
    }

    User "1" -- "*" Publication : écrit
    Category "1" -- "*" Publication : catégorise
    User "1" -- "*" BusinessListing : soumet
`);

// ==========================================
// 7. CHAPITRE 4 : RÉALISATION & CAPTURES D'ÉCRAN
// ==========================================
addTitle('Chapitre 4 : Réalisation et Mise en Œuvre');
addTitle('4.1 Cadre technologique et environnement', 2);
addParagraph('Matériel : PC Portable MSI Modern 15, Processeur Intel Core i5 (10th Gen), 16 Go RAM, 256 Go SSD.\nLogiciel : NestJS 11, Prisma 5.22, PostgreSQL (Neon Serverless), React 19, Vite 8.1, Tailwind CSS 3, Docker, Vitest, Jest.');

addTitle('4.2 Captures d\'écran des interfaces et descriptions', 2);
addScreenshotBox(
  1,
  'Page d\'accueil Éditoriale et Journal de Presse',
  'La page d\'accueil présente l\'article à la une, la grille des actualités récentes filtrables par catégories éditoriales (National, Politique, Économie, Culture), les bannières publicitaires en rotation et le widget des articles les plus lus.',
  'http://localhost:4001/'
);
addScreenshotBox(
  2,
  'Page de Détail d\'un Article',
  'Affiche le titre de l\'article en typographie Serif, l\'image de couverture Cloudinary, le fil d\'Ariane, le contenu nettoyé contre les injections HTML, les boutons de réaction (J\'aime) et le fil de commentaires hiérarchiques.',
  'http://localhost:4001/article/:slug'
);
addScreenshotBox(
  3,
  'Interface de Connexion et d\'Authentification Admin',
  'Permet aux éditeurs et administrateurs de se connecter de manière sécurisée via identifiants email/password ou via l\'authentification fédérée Google OAuth 2.0.',
  'http://localhost:4001/admin/login'
);
addScreenshotBox(
  4,
  'Console d\'Administration -- Gestion des Articles',
  'Tableau de bord listant tous les articles rédigés avec leurs statuts (Brouillon, Programmé, Publié), le nombre de vues, la date de publication et les actions d\'édition/suppression.',
  'http://localhost:4001/admin/articles'
);
addScreenshotBox(
  5,
  'Modale de Création et d\'Édition d\'Article',
  'Formulaire interactif avec téléversement d\'image en direct, sélection de catégorie, saisie markdown et auto-sauvegarde automatique du brouillon en arrière-plan toutes les 2 secondes.',
  'http://localhost:4001/admin/articles (Modal)'
);
addScreenshotBox(
  6,
  'Annuaire des Professionnels (Business Directory)',
  'Interface publique de recherche et filtrage des entreprises par secteur d\'activité (Restauration, Droit, Immobilier, Santé, Services) avec boutons d\'appel et contact direct.',
  'http://localhost:4001/directory'
);
addScreenshotBox(
  7,
  'Formulaire de Soumission d\'une Fiche Entreprise',
  'Formulaire de candidature permettant aux professionnels de soumettre leur entreprise avec validation des données avant modération administrative.',
  'http://localhost:4001/directory/submit'
);
addScreenshotBox(
  8,
  'Console d\'Administration -- Modération de l\'Annuaire',
  'Interface réservée au Super Administrateur pour examiner, approuver (APPROVED) ou rejeter (REJECTED) les fiches d\'entreprises soumises et consulter les compteurs de clics.',
  'http://localhost:4001/admin/listings'
);
addScreenshotBox(
  9,
  'Console d\'Administration -- Régie Publicitaire',
  'Gestion des bannières d\'annonces avec statut calculé dynamiquement (ATTIVA, PROGRAMMATA, SCADUTA), suivi des impressions réelles et journal d\'audit des modifications (AdLog).',
  'http://localhost:4001/admin/ads'
);

// ==========================================
// 8. CONCLUSION & RÉFÉRENCES
// ==========================================
addTitle('Conclusion Générale et Perspectives');
addParagraph('Le projet Tunisia Oggi a permis de concevoir et de réaliser avec succès une plateforme web éditoriale et un annuaire des professionnels complets pour la communauté italienne en Tunisie. L\'application repose sur des fondations solides (Clean Architecture, NestJS 11, React 19) garantissant sécurité, maintenabilité et hautes performances.');

addTitle('Références Bibliographiques');
addParagraph('1. NestJS Framework Documentation -- https://docs.nestjs.com\n2. React 19 & Vite Documentation -- https://react.dev & https://vite.dev\n3. Prisma ORM Documentation -- https://www.prisma.io/docs\n4. Clean Architecture (Robert C. Martin / Uncle Bob)');

addHeaderFooter();

doc.end();

stream.on('finish', () => {
  console.log('Successfully generated PDF report at: ' + outputPath);
});
