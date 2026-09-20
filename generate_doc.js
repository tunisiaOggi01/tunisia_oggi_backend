const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  BorderStyle,
  WidthType,
  AlignmentType,
  ShadingType,
} = require('docx');

const BRAND_RED = '8B1E1E';
const BRAND_BLUE = '1E3A8A';
const LIGHT_BG = 'F3F4F6';
const BORDER_GRAY = 'D1D5DB';

function createHeading1(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
    run: { bold: true, color: BRAND_RED, size: 32, font: 'Georgia' },
  });
}

function createHeading2(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 150 },
    run: { bold: true, color: BRAND_BLUE, size: 26, font: 'Georgia' },
  });
}

function createHeading3(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 },
    run: { bold: true, color: '374151', size: 22, font: 'Arial' },
  });
}

function createParagraph(text, options = {}) {
  return new Paragraph({
    children: [
      new TextRun({
        text: text,
        size: 22,
        font: 'Arial',
        bold: !!options.bold,
        italic: !!options.italic,
        color: options.color || '1F2937',
      }),
    ],
    spacing: { before: 100, after: 100, line: 276 },
  });
}

function createMermaidBlock(title, mermaidCode) {
  return [
    new Paragraph({
      children: [
        new TextRun({ text: `[MERMAID DIAGRAM] ${title}`, bold: true, color: BRAND_RED, size: 20, font: 'Arial' })
      ],
      spacing: { before: 200, after: 100 }
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: mermaidCode.trim().split('\n').map(line => 
                new Paragraph({
                  children: [new TextRun({ text: line, font: 'Consolas', size: 18, color: '1E293B' })],
                  spacing: { before: 20, after: 20 }
                })
              ),
              shading: { fill: 'F8FAFC', type: ShadingType.CLEAR, color: 'auto' },
              borders: {
                top: { style: BorderStyle.SINGLE, size: 8, color: BRAND_BLUE },
                bottom: { style: BorderStyle.SINGLE, size: 8, color: BRAND_BLUE },
                left: { style: BorderStyle.SINGLE, size: 16, color: BRAND_BLUE },
                right: { style: BorderStyle.SINGLE, size: 8, color: BRAND_BLUE },
              },
            })
          ]
        })
      ]
    })
  ];
}

function createScreenshotBlock(figureNum, title, description, url) {
  return [
    new Paragraph({
      children: [
        new TextRun({ text: `Figure ${figureNum}: ${title}`, bold: true, color: BRAND_RED, size: 22, font: 'Georgia' })
      ],
      spacing: { before: 250, after: 100 }
    }),
    new Paragraph({
      children: [
        new TextRun({ text: `[IMAGE CAPTURE - ${url}]`, italic: true, color: '64748B', size: 20 })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 50, after: 100 }
    }),
    new Paragraph({
      children: [
        new TextRun({ text: description, size: 20, font: 'Arial', italic: true, color: '334155' })
      ],
      spacing: { before: 50, after: 200 }
    })
  ];
}

const doc = new Document({
  sections: [
    {
      properties: {},
      children: [
        // Page de garde
        new Paragraph({
          text: 'RÉPUBLIQUE TUNISIENNE',
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: 'RÉPUBLIQUE TUNISIENNE\nMinistère de l’Enseignement Supérieur et de la Recherche Scientifique\n\n', bold: true, size: 22, font: 'Arial' })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: 'ÉCOLE INTERNATIONALE SUPÉRIEURE PRIVÉE POLYTECHNIQUE DE SOUSSE\n(EPI DIGITAL SCHOOL)\n\n', bold: true, color: BRAND_BLUE, size: 26, font: 'Georgia' })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: 'Année Universitaire : 2025 / 2026\n\n', italic: true, size: 20, font: 'Arial' })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: 'RAPPORT DE PROJET DE FIN D’ANNÉE\n', bold: true, color: BRAND_RED, size: 36, font: 'Georgia' })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: 'Pour l’obtention du Diplôme National d’Ingénieur en Génie Logiciel\nSpécialité : Génie Logiciel (4ème Année GL)\n\n\n', size: 22, font: 'Arial' })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: 'INTITULÉ :\nCONCEPTION ET RÉALISATION D’UNE PLATEFORME WEB ÉDITORIALE ET D’UN ANNUAIRE DES PROFESSIONNELS :\n"TUNISIA OGGI"\n\n\n', bold: true, color: BRAND_RED, size: 28, font: 'Georgia' })]
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'Lieu de stage : EPI Digital School\t\t\tRéalisé par : Mohamed Iyed TOUATI\n\n', bold: true, size: 22, font: 'Arial' })
          ]
        }),

        // Dédicace & Remerciements
        createHeading1('Dédicace'),
        createParagraph('À mes parents, pour tous les innombrables sacrifices qu\'ils ont faits et pour tout le soutien qu\'ils m\'ont apporté tout au long de mes études.', { italic: true }),
        createParagraph('À mes frères, Farouk et Fakhri, qui ont toujours été là pour moi, pour leurs conseils et leur soutien inconditionnel.', { italic: true }),
        createParagraph('À mes enseignants et superviseurs, avec tout mon respect et ma plus grande gratitude pour la qualité de l\'enseignement qu\'ils m\'ont apporté.', { italic: true }),

        createHeading1('Remerciements'),
        createParagraph('Je tiens à exprimer ma sincère gratitude à toutes les personnes qui ont contribué au succès de ce projet de fin d\'année, tout particulièrement l\'équipe pédagogique de l\'EPI Digital School ainsi que les membres du jury pour avoir accepté d\'évaluer mon travail.'),

        // Introduction Générale
        createHeading1('Introduction Générale'),
        createParagraph('Dans le monde actuel, de plus en plus connecté et organisé, l\'accès à une information de presse ciblée et la mise en réseau professionnelle au sein des communautés expatriées représentent un enjeu stratégique. La communauté italienne résidant ou investissant en Tunisie ne disposait pas jusqu\'ici d\'un portail unifié intégrant à la fois un journalisme d\'actualité de qualité et un annuaire professionnel vérifié.'),
        createParagraph('Pour répondre à ces enjeux, le projet Tunisia Oggi vise à concevoir et réaliser une plateforme web moderne, bilingue (Italien / Français), reposant sur un journal d\'actualités réactif, un annuaire des professionnels à soumission modérée et un moteur de régie publicitaire à rotation pondérée.'),

        // Chapitre 1
        createHeading1('Chapitre 1 : Présentation générale du projet'),
        createHeading2('1.1 Contexte et problématique'),
        createParagraph('L\'analyse du marché et les retours d\'expérience de la communauté italienne en Tunisie ont mis en évidence plusieurs insuffisances majeures : manque de centralisation de l\'information, absence de modération sur les annuaires existants, et manque de visibilité pour les professionnels locaux.'),
        createHeading2('1.2 Objectifs spécifiques du projet'),
        createParagraph('1. Portail Éditorial Réactif avec calcul automatique du score de pertinence rankScore.\n2. Annuaire des Professionnels (Business Directory) à modération contrôlée.\n3. Régie publicitaire pondérée avec comptage d\'impressions via IntersectionObserver.\n4. Architecture Clean sous NestJS 11 et React 19.'),
        
        // Chapitre 2
        createHeading1('Chapitre 2 : Analyse et modélisation des besoins'),
        createHeading2('2.1 Exigences fonctionnelles et non fonctionnelles'),
        createParagraph('Le système gère l\'authentification JWT avec rotation de Refresh Token, la double protection CSRF, la sanitization des contenus HTML, et le contrôle d\'accès granulaire basé sur les rôles via CASL.'),
        
        createHeading2('2.2 Diagrammes des Cas d\'Utilisation UML'),
        ...createMermaidBlock('Diagramme 1 : Cas d\'Utilisation Global du Système', `
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
`),

        ...createMermaidBlock('Diagramme 2 : Cas d\'Utilisation Détaillé -- Module Éditorial', `
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
`),

        ...createMermaidBlock('Diagramme 3 : Cas d\'Utilisation Détaillé -- Annuaire & Modération', `
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
`),

        // Chapitre 3
        createHeading1('Chapitre 3 : Conception et modélisation du système'),
        createHeading2('3.1 Architecture et Diagrammes de Flux'),
        ...createMermaidBlock('Diagramme 4 : Diagramme de Flux -- Architecture & Pipeline de Données', `
flowchart LR
    Client["Client React 19 SPA"] -->|HTTPS + Cookie JWT| Axios["Axios Interceptor Queue"]
    Axios -->|X-CSRF-Token| NestJS["NestJS 11 Backend API"]
    NestJS -->|Guards & CASL| Services["Repository Services"]
    Services -->|Prisma ORM 5.22| PostgreSQL[("PostgreSQL DB")]
    Services -->|Buffer Upload| Cloudinary[("Cloudinary Media CDN")]
`),

        ...createMermaidBlock('Diagramme 5 : Diagramme de Flux -- Parcours de Création & Auto-Sauvegarde d\'Article', `
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
`),

        createHeading2('3.2 Diagrammes de Séquence Détaillés'),
        ...createMermaidBlock('Diagramme 6 : Diagramme de Séquence -- Authentification & Rotation de Refresh Token', `
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
`),

        ...createMermaidBlock('Diagramme 7 : Diagramme de Séquence -- Soumission & Validation d\'une Fiche Annuaire', `
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
`),

        createHeading2('3.3 Diagramme de Classes UML'),
        ...createMermaidBlock('Diagramme 8 : Diagramme de Classes UML du Système', `
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
`),

        // Chapitre 4
        createHeading1('Chapitre 4 : Réalisation et Mise en Œuvre'),
        createHeading2('4.1 Cadre technologique et environnement'),
        createParagraph('Matériel : PC Portable MSI Modern 15, Processeur Intel Core i5 (10th Gen), 16 Go RAM, 256 Go SSD.\nLogiciel : NestJS 11, Prisma 5.22, PostgreSQL (Neon Serverless), React 19, Vite 8.1, Tailwind CSS 3, Docker, Vitest, Jest.'),

        createHeading2('4.2 Captures d\'écran des interfaces et descriptions'),
        ...createScreenshotBlock(
          1,
          'Page d\'accueil Éditoriale et Journal de Presse',
          'La page d\'accueil présente l\'article à la une, la grille des actualités récentes filtrables par catégories éditoriales (National, Politique, Économie, Culture), les bannières publicitaires en rotation et le widget des articles les plus lus.',
          'http://localhost:4001/'
        ),
        ...createScreenshotBlock(
          2,
          'Page de Détail d\'un Article',
          'Affiche le titre de l\'article en typographie Serif, l\'image de couverture Cloudinary, le fil d\'Ariane, le contenu nettoyé par le sanitizer HTML, les boutons de réaction (J\'aime) et le fil de commentaires hiérarchiques.',
          'http://localhost:4001/article/:slug'
        ),
        ...createScreenshotBlock(
          3,
          'Interface de Connexion et d\'Authentification Admin',
          'Permet aux éditeurs et administrateurs de se connecter de manière sécurisée via identifiants email/password ou via l\'authentification fédérée Google OAuth 2.0.',
          'http://localhost:4001/admin/login'
        ),
        ...createScreenshotBlock(
          4,
          'Console d\'Administration -- Gestion des Articles',
          'Tableau de bord listant tous les articles rédigés avec leurs statuts (Brouillon, Programmé, Publié), le nombre de vues, la date de publication et les actions d\'édition/suppression.',
          'http://localhost:4001/admin/articles'
        ),
        ...createScreenshotBlock(
          5,
          'Modale de Création et d\'Édition d\'Article',
          'Formulaire interactif avec téléversement d\'image en direct, sélection de catégorie, saisie markdown et auto-sauvegarde automatique du brouillon en arrière-plan toutes les 2 secondes.',
          'http://localhost:4001/admin/articles (Modal)'
        ),
        ...createScreenshotBlock(
          6,
          'Annuaire des Professionnels (Business Directory)',
          'Interface publique de recherche et filtrage des entreprises par secteur d\'activité (Restauration, Droit, Immobilier, Santé, Services) avec boutons d\'appel et contact direct.',
          'http://localhost:4001/directory'
        ),
        ...createScreenshotBlock(
          7,
          'Formulaire de Soumission d\'une Fiche Entreprise',
          'Formulaire de candidature permettant aux professionnels de soumettre leur entreprise avec validation des données avant modération administrative.',
          'http://localhost:4001/directory/submit'
        ),
        ...createScreenshotBlock(
          8,
          'Console d\'Administration -- Modération de l\'Annuaire',
          'Interface réservée au Super Administrateur pour examiner, approuver (APPROVED) ou rejeter (REJECTED) les fiches d\'entreprises soumises et consulter les compteurs de clics.',
          'http://localhost:4001/admin/listings'
        ),
        ...createScreenshotBlock(
          9,
          'Console d\'Administration -- Régie Publicitaire',
          'Gestion des bannières d\'annonces avec statut calculé dynamiquement (ATTIVA, PROGRAMMATA, SCADUTA), suivi des impressions réelles et journal d\'audit des modifications (AdLog).',
          'http://localhost:4001/admin/ads'
        ),

        // Conclusion & Références
        createHeading1('Conclusion Générale et Perspectives'),
        createParagraph('Le projet Tunisia Oggi a permis de concevoir et de réaliser avec succès une plateforme web éditoriale et un annuaire des professionnels complets pour la communauté italienne en Tunisie. L\'application repose sur des fondations solides (Clean Architecture, NestJS 11, React 19) garantissant sécurité, maintenabilité et hautes performances.'),

        createHeading1('Références Bibliographiques'),
        createParagraph('1. NestJS Documentation Officielle -- https://docs.nestjs.com\n2. React 19 & Vite Documentation -- https://react.dev & https://vite.dev\n3. Prisma ORM Documentation -- https://www.prisma.io/docs\n4. Clean Architecture (Robert C. Martin / Uncle Bob)'),
      ]
    }
  ]
});

Packer.toBuffer(doc).then((buffer) => {
  const outputPath = path.join(__dirname, '../docs/RAPPORT_PFA_TUNISIA_OGGI.docx');
  fs.writeFileSync(outputPath, buffer);
  console.log('Successfully generated DOCX report at: ' + outputPath);
}).catch((err) => {
  console.error('Error generating DOCX:', err);
});
