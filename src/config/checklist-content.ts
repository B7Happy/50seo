export interface ChecklistItem {
  id: number;
  name: string;
  category: string;
  description: string;
  why: string;
  howToFix: string[];
  impact: 'critical' | 'high' | 'medium' | 'low';
}

export const CHECKLIST_CONTENT: ChecklistItem[] = [
  // International SEO
  {
    id: 1,
    name: 'Balises hreflang',
    category: 'international',
    description: 'Les balises hreflang indiquent aux moteurs de recherche quelle version linguistique ou regionale d\'une page afficher aux utilisateurs.',
    why: 'Sans hreflang, Google peut afficher la mauvaise version de votre page aux utilisateurs internationaux, ce qui augmente le taux de rebond et reduit les conversions.',
    howToFix: [
      'Ajoutez des balises <link rel="alternate" hreflang="xx"> dans le <head> de chaque page',
      'Utilisez les codes ISO 639-1 pour les langues (fr, en, de)',
      'Incluez toujours un hreflang="x-default" pour la version par defaut',
      'Assurez-vous que les hreflang sont bidirectionnels entre toutes les versions'
    ],
    impact: 'high'
  },
  {
    id: 26,
    name: 'Attribut lang',
    category: 'international',
    description: 'L\'attribut lang sur la balise <html> indique la langue principale du contenu de la page.',
    why: 'Cet attribut aide les lecteurs d\'ecran et les moteurs de recherche a comprendre la langue du contenu pour un meilleur classement regional.',
    howToFix: [
      'Ajoutez lang="fr" sur la balise <html> pour le francais',
      'Utilisez le code langue ISO 639-1 approprie',
      'Pour les contenus multilingues, utilisez l\'attribut lang sur les elements specifiques'
    ],
    impact: 'medium'
  },
  {
    id: 27,
    name: 'Codes langue/pays',
    category: 'international',
    description: 'Verification que les codes de langue et de pays utilises sont conformes aux standards ISO.',
    why: 'Des codes incorrects empechent Google de comprendre votre ciblage geographique et linguistique.',
    howToFix: [
      'Utilisez ISO 639-1 pour les langues (fr, en, es)',
      'Utilisez ISO 3166-1 Alpha-2 pour les pays (FR, US, ES)',
      'Combinez-les correctement : fr-FR, en-US, es-ES'
    ],
    impact: 'medium'
  },
  {
    id: 28,
    name: 'Liens internationaux',
    category: 'international',
    description: 'Verification des liens entre les differentes versions linguistiques de votre site.',
    why: 'Des liens corrects entre versions permettent aux utilisateurs et aux robots de naviguer facilement entre les langues.',
    howToFix: [
      'Ajoutez un selecteur de langue visible sur toutes les pages',
      'Liez vers la page equivalente dans chaque langue, pas vers la page d\'accueil',
      'Utilisez des URLs distinctes pour chaque langue (/fr/, /en/)'
    ],
    impact: 'medium'
  },
  {
    id: 37,
    name: 'Localisation contenu',
    category: 'international',
    description: 'Verification que le contenu est adapte a chaque marche cible (devises, unites, references culturelles).',
    why: 'Un contenu non localise reduit la confiance des utilisateurs et les conversions sur les marches internationaux.',
    howToFix: [
      'Adaptez les devises et formats de prix locaux',
      'Utilisez les unites de mesure appropriees (km/miles)',
      'Adaptez les references culturelles et exemples',
      'Verifiez les traductions par des natifs'
    ],
    impact: 'medium'
  },

  // Fondation Technique
  {
    id: 4,
    name: 'HTTPS actif',
    category: 'technical',
    description: 'HTTPS chiffre les donnees entre le navigateur et le serveur, securisant les informations des utilisateurs.',
    why: 'Google utilise HTTPS comme signal de classement. Les navigateurs affichent des avertissements sur les sites non securises.',
    howToFix: [
      'Installez un certificat SSL (Let\'s Encrypt est gratuit)',
      'Configurez les redirections HTTP vers HTTPS',
      'Mettez a jour tous les liens internes vers HTTPS',
      'Activez HSTS pour forcer les connexions securisees'
    ],
    impact: 'critical'
  },
  {
    id: 18,
    name: 'Redirections trailing slash',
    category: 'technical',
    description: 'Coherence dans l\'utilisation des URLs avec ou sans slash final (example.com/page vs example.com/page/).',
    why: 'Des URLs inconsistantes creent du contenu duplique et diluent l\'autorite des liens.',
    howToFix: [
      'Choisissez une convention (avec ou sans slash)',
      'Configurez des redirections 301 vers la version choisie',
      'Mettez a jour votre sitemap et liens internes'
    ],
    impact: 'medium'
  },
  {
    id: 22,
    name: 'Redirections www/non-www',
    category: 'technical',
    description: 'Coherence entre les versions www et non-www de votre domaine.',
    why: 'www.site.com et site.com sont consideres comme deux sites differents, creant du contenu duplique.',
    howToFix: [
      'Choisissez une version canonique (www ou non-www)',
      'Configurez une redirection 301 permanente',
      'Declarez la version choisie dans Google Search Console'
    ],
    impact: 'high'
  },
  {
    id: 23,
    name: 'Structure URL SEO-friendly',
    category: 'technical',
    description: 'Des URLs lisibles, descriptives et optimisees pour le referencement.',
    why: 'Des URLs claires ameliorent l\'experience utilisateur et aident Google a comprendre le contenu.',
    howToFix: [
      'Utilisez des mots-cles descriptifs dans les URLs',
      'Evitez les parametres et IDs numeriques',
      'Gardez les URLs courtes (moins de 75 caracteres)',
      'Utilisez des tirets pour separer les mots'
    ],
    impact: 'medium'
  },
  {
    id: 42,
    name: 'Sitemap XML',
    category: 'technical',
    description: 'Un fichier sitemap.xml liste toutes les pages importantes de votre site pour les moteurs de recherche.',
    why: 'Le sitemap aide Google a decouvrir et indexer toutes vos pages, surtout les nouvelles ou profondes.',
    howToFix: [
      'Generez un sitemap XML avec toutes les URLs importantes',
      'Incluez les dates de derniere modification',
      'Soumettez le sitemap dans Google Search Console',
      'Limitez a 50 000 URLs par fichier sitemap'
    ],
    impact: 'high'
  },
  {
    id: 44,
    name: 'Liens HTTP',
    category: 'technical',
    description: 'Detection des liens internes pointant vers des URLs HTTP au lieu de HTTPS.',
    why: 'Les liens HTTP creent des redirections inutiles et des avertissements de securite mixte.',
    howToFix: [
      'Mettez a jour tous les liens internes vers HTTPS',
      'Verifiez les ressources (images, scripts, CSS)',
      'Utilisez des URLs relatives quand possible'
    ],
    impact: 'medium'
  },
  {
    id: 48,
    name: 'Balises canonical',
    category: 'technical',
    description: 'Les balises canonical indiquent la version principale d\'une page en cas de contenu similaire.',
    why: 'Sans canonical, Google peut indexer la mauvaise version ou diluer l\'autorite entre les duplicatas.',
    howToFix: [
      'Ajoutez <link rel="canonical" href="..."> sur chaque page',
      'Pointez vers l\'URL absolue preferee',
      'Assurez la coherence avec les hreflang',
      'Evitez les canonicals vers des pages en 404 ou redirigees'
    ],
    impact: 'high'
  },
  {
    id: 49,
    name: 'Robots.txt',
    category: 'technical',
    description: 'Le fichier robots.txt donne des instructions aux robots sur les pages a explorer ou ignorer.',
    why: 'Un robots.txt mal configure peut bloquer l\'indexation de pages importantes.',
    howToFix: [
      'Verifiez que vous ne bloquez pas de pages importantes',
      'Incluez le lien vers votre sitemap',
      'Testez avec l\'outil de test robots.txt de Google',
      'N\'utilisez pas robots.txt pour cacher du contenu sensible'
    ],
    impact: 'critical'
  },

  // Contenu & Structure
  {
    id: 3,
    name: 'Fil d\'Ariane (Breadcrumbs)',
    category: 'content',
    description: 'Le fil d\'Ariane montre le chemin de navigation depuis la page d\'accueil jusqu\'a la page actuelle.',
    why: 'Les breadcrumbs ameliorent la navigation, reduisent le taux de rebond et apparaissent dans les resultats Google.',
    howToFix: [
      'Implementez un fil d\'Ariane sur toutes les pages (sauf accueil)',
      'Ajoutez le balisage Schema BreadcrumbList',
      'Assurez-vous que chaque niveau est cliquable',
      'Utilisez une hierarchie logique'
    ],
    impact: 'medium'
  },
  {
    id: 8,
    name: 'Profondeur de clic',
    category: 'content',
    description: 'Le nombre de clics necessaires pour atteindre une page depuis la page d\'accueil.',
    why: 'Les pages profondes (4+ clics) sont moins souvent crawlees et recoivent moins d\'autorite.',
    howToFix: [
      'Gardez les pages importantes a 3 clics maximum de la homepage',
      'Ameliorez le maillage interne',
      'Ajoutez des liens vers les pages profondes depuis la navigation',
      'Creez des pages de categorie intermediaires'
    ],
    impact: 'high'
  },
  {
    id: 9,
    name: 'Qualite des ancres',
    category: 'content',
    description: 'Les textes d\'ancre des liens internes doivent etre descriptifs et pertinents.',
    why: 'Des ancres comme "cliquez ici" n\'aident pas Google a comprendre le contenu de la page cible.',
    howToFix: [
      'Utilisez des textes d\'ancre descriptifs avec des mots-cles',
      'Evitez les ancres generiques (cliquez ici, en savoir plus)',
      'Variez les textes d\'ancre pour la meme page',
      'Gardez les ancres concises (2-5 mots)'
    ],
    impact: 'medium'
  },
  {
    id: 12,
    name: 'Contenu suffisant',
    category: 'content',
    description: 'Les pages doivent avoir assez de contenu textuel pour apporter de la valeur.',
    why: 'Les pages avec peu de contenu (thin content) sont considerees de faible qualite par Google.',
    howToFix: [
      'Visez minimum 300 mots pour les pages informatives',
      'Ajoutez du contenu unique et valuable',
      'Combinez les pages similaires avec peu de contenu',
      'Utilisez noindex pour les pages utilitaires sans valeur SEO'
    ],
    impact: 'high'
  },
  {
    id: 32,
    name: 'Liens internes spam',
    category: 'content',
    description: 'Detection d\'un nombre excessif de liens internes sur une meme page.',
    why: 'Trop de liens diluent le PageRank et peuvent etre vus comme du spam par Google.',
    howToFix: [
      'Limitez les liens a ceux vraiment utiles pour l\'utilisateur',
      'Evitez les footers avec des centaines de liens',
      'Privilegiez la qualite a la quantite',
      'Utilisez nofollow pour les liens non essentiels au SEO'
    ],
    impact: 'medium'
  },
  {
    id: 33,
    name: 'Textes d\'ancre',
    category: 'content',
    description: 'Analyse de la diversite et pertinence des textes d\'ancre sur le site.',
    why: 'Des textes d\'ancre sur-optimises ou identiques peuvent etre penalises par Google.',
    howToFix: [
      'Variez naturellement vos textes d\'ancre',
      'Incluez le nom de marque dans certaines ancres',
      'Utilisez des ancres contextuelles',
      'Evitez la sur-optimisation avec les mots-cles exacts'
    ],
    impact: 'medium'
  },
  {
    id: 35,
    name: 'Pages orphelines',
    category: 'content',
    description: 'Les pages orphelines ne recoivent aucun lien interne depuis d\'autres pages du site.',
    why: 'Sans liens internes, Google peut ne jamais decouvrir ces pages ou leur attribuer peu d\'importance.',
    howToFix: [
      'Identifiez les pages sans liens entrants',
      'Ajoutez des liens contextuels depuis des pages pertinentes',
      'Incluez-les dans la navigation ou le sitemap',
      'Supprimez les pages orphelines non necessaires'
    ],
    impact: 'high'
  },

  // Schema & Donnees
  {
    id: 19,
    name: 'Donnees structurees avancees',
    category: 'schema',
    description: 'Implementation de Schema.org pour les rich snippets (FAQ, How-to, Product, etc.).',
    why: 'Les donnees structurees permettent d\'obtenir des resultats enrichis qui augmentent le CTR.',
    howToFix: [
      'Identifiez les types de schema pertinents pour votre contenu',
      'Implementez au minimum Organization et WebSite',
      'Ajoutez FAQ, HowTo, Product selon le type de page',
      'Testez avec l\'outil de test des resultats enrichis'
    ],
    impact: 'high'
  },
  {
    id: 21,
    name: 'Validation Schema',
    category: 'schema',
    description: 'Verification que les donnees structurees sont valides et sans erreurs.',
    why: 'Des erreurs dans le schema empechent l\'affichage des rich snippets.',
    howToFix: [
      'Testez votre markup avec schema.org/validator',
      'Utilisez l\'outil de test des resultats enrichis Google',
      'Corrigez les proprietes requises manquantes',
      'Verifiez les formats de date et URL'
    ],
    impact: 'medium'
  },
  {
    id: 24,
    name: 'Format JSON-LD',
    category: 'schema',
    description: 'Utilisation du format JSON-LD pour les donnees structurees (recommande par Google).',
    why: 'JSON-LD est le format prefere de Google car il se separe du HTML et est plus facile a maintenir.',
    howToFix: [
      'Convertissez le microdata existant en JSON-LD',
      'Placez le script dans le <head> ou en fin de <body>',
      'Utilisez un seul bloc JSON-LD avec @graph pour plusieurs entites',
      'Validez la syntaxe JSON'
    ],
    impact: 'medium'
  },
  {
    id: 25,
    name: 'Schema avance',
    category: 'schema',
    description: 'Implementation de schemas specifiques a votre secteur (LocalBusiness, Product, Article, etc.).',
    why: 'Les schemas specifiques permettent des resultats enrichis adaptes a votre activite.',
    howToFix: [
      'E-commerce : ajoutez Product, Offer, AggregateRating',
      'Blog : ajoutez Article, Author, DatePublished',
      'Local : ajoutez LocalBusiness avec NAP',
      'Evenements : ajoutez Event avec lieu et dates'
    ],
    impact: 'medium'
  },

  // Images & Medias
  {
    id: 2,
    name: 'Optimisation images',
    category: 'media',
    description: 'Les images doivent etre optimisees en taille, format et avoir des attributs alt.',
    why: 'Des images lourdes ralentissent le site. Les alt manquants nuisent a l\'accessibilite et au SEO.',
    howToFix: [
      'Compressez les images (WebP ou AVIF recommandes)',
      'Ajoutez des attributs alt descriptifs',
      'Utilisez le lazy loading pour les images sous la ligne de flottaison',
      'Specifiez width et height pour eviter les decalages'
    ],
    impact: 'high'
  },
  {
    id: 5,
    name: 'Optimisation fonts',
    category: 'media',
    description: 'Les polices web doivent etre optimisees pour ne pas bloquer le rendu.',
    why: 'Des fonts non optimisees causent du FOIT (flash of invisible text) et ralentissent l\'affichage.',
    howToFix: [
      'Utilisez font-display: swap dans @font-face',
      'Preconnectez aux serveurs de fonts (Google Fonts)',
      'Limitez le nombre de variantes de police',
      'Hebergez les fonts localement si possible'
    ],
    impact: 'medium'
  },

  // Performance
  {
    id: 6,
    name: 'Optimisation CSS',
    category: 'performance',
    description: 'Le CSS doit etre optimise pour ne pas bloquer le rendu de la page.',
    why: 'Le CSS bloquant retarde l\'affichage du contenu, nuisant aux Core Web Vitals.',
    howToFix: [
      'Inlinez le CSS critique dans le <head>',
      'Chargez le CSS non-critique de maniere asynchrone',
      'Minifiez et combinez les fichiers CSS',
      'Supprimez le CSS inutilise'
    ],
    impact: 'high'
  },
  {
    id: 15,
    name: 'Strategie de cache',
    category: 'performance',
    description: 'Configuration des en-tetes HTTP de cache pour les ressources statiques.',
    why: 'Un bon cache reduit les temps de chargement pour les visiteurs recurrents.',
    howToFix: [
      'Configurez Cache-Control pour les ressources statiques',
      'Utilisez des durees longues (1 an) pour les assets versiones',
      'Configurez correctement les ETags',
      'Utilisez un CDN pour la distribution geographique'
    ],
    impact: 'medium'
  },
  {
    id: 20,
    name: 'Chemin de rendu critique',
    category: 'performance',
    description: 'Identification des ressources qui bloquent l\'affichage initial de la page.',
    why: 'Les ressources render-blocking augmentent le LCP et degradent l\'experience utilisateur.',
    howToFix: [
      'Identifiez les CSS et JS bloquants avec Lighthouse',
      'Differez le chargement des scripts non essentiels',
      'Utilisez async ou defer pour les scripts',
      'Preloadez les ressources critiques'
    ],
    impact: 'high'
  },
  {
    id: 31,
    name: 'Performance utilisateur reel',
    category: 'performance',
    description: 'Analyse des Core Web Vitals (LCP, FID/INP, CLS) avec des donnees reelles.',
    why: 'Google utilise les donnees CrUX (utilisateurs reels) pour le classement, pas les tests de lab.',
    howToFix: [
      'Consultez le rapport Core Web Vitals dans Search Console',
      'Utilisez PageSpeed Insights pour voir les donnees terrain',
      'Ciblez : LCP < 2.5s, INP < 200ms, CLS < 0.1',
      'Priorisez les problemes affectant le plus de pages'
    ],
    impact: 'critical'
  },
  {
    id: 34,
    name: 'Performance serveur (TTFB)',
    category: 'performance',
    description: 'Le Time To First Byte mesure le temps de reponse initial du serveur.',
    why: 'Un TTFB eleve retarde tout le reste du chargement. Google recommande moins de 800ms.',
    howToFix: [
      'Optimisez les requetes base de donnees',
      'Activez le cache serveur (Redis, Memcached)',
      'Utilisez un CDN',
      'Choisissez un hebergeur performant proche de vos utilisateurs'
    ],
    impact: 'high'
  },
  {
    id: 43,
    name: 'Optimisation JavaScript',
    category: 'performance',
    description: 'Le JavaScript doit etre optimise pour ne pas bloquer le rendu et rester leger.',
    why: 'Trop de JS ralentit l\'interactivite (INP) et le temps de chargement.',
    howToFix: [
      'Minifiez et compressez les fichiers JS',
      'Utilisez le code splitting pour charger a la demande',
      'Differez les scripts non essentiels',
      'Supprimez les bibliotheques inutilisees'
    ],
    impact: 'high'
  },
  {
    id: 46,
    name: 'Analyse rendu',
    category: 'performance',
    description: 'Comparaison entre le HTML initial et le contenu rendu par JavaScript.',
    why: 'Si le contenu depend trop de JS, Google peut ne pas l\'indexer correctement.',
    howToFix: [
      'Comparez le code source avec le rendu final',
      'Privilegiez le SSR ou SSG pour le contenu important',
      'Testez avec "View rendered HTML" dans Search Console',
      'Assurez que le contenu principal est dans le HTML initial'
    ],
    impact: 'high'
  },

  // JavaScript & Rendering
  {
    id: 10,
    name: 'Liens JavaScript',
    category: 'javascript',
    description: 'Detection des liens generes par JavaScript qui pourraient ne pas etre suivis.',
    why: 'Google peut avoir du mal a suivre les liens crees dynamiquement par JavaScript.',
    howToFix: [
      'Utilisez des balises <a href="..."> standards',
      'Evitez onclick="location.href" pour la navigation',
      'Testez avec l\'inspection d\'URL de Search Console',
      'Renderez les liens cote serveur si possible'
    ],
    impact: 'high'
  },
  {
    id: 30,
    name: 'Rendu cote client',
    category: 'javascript',
    description: 'Analyse de la dependance au JavaScript pour afficher le contenu principal.',
    why: 'Le contenu genere uniquement par JS peut ne pas etre indexe ou indexe avec retard.',
    howToFix: [
      'Implementez le SSR (Server Side Rendering)',
      'Utilisez le pre-rendering pour les pages statiques',
      'Testez l\'indexation avec Search Console',
      'Fournissez un fallback HTML pour le contenu critique'
    ],
    impact: 'critical'
  },
  {
    id: 47,
    name: 'Liens JS intelligents',
    category: 'javascript',
    description: 'Verification que les liens SPA (Single Page App) utilisent l\'History API correctement.',
    why: 'Sans History API, les URLs ne changent pas et le contenu n\'est pas indexable separement.',
    howToFix: [
      'Utilisez History.pushState pour changer l\'URL',
      'Implementez le routing cote serveur en fallback',
      'Chaque page doit avoir une URL unique',
      'Testez la navigation avec JS desactive'
    ],
    impact: 'high'
  },

  // Navigation & Liens
  {
    id: 11,
    name: 'Navigation mega menu',
    category: 'navigation',
    description: 'Analyse des mega menus pour s\'assurer qu\'ils ne contiennent pas trop de liens.',
    why: 'Les mega menus avec trop de liens diluent le PageRank et peuvent sembler spammy.',
    howToFix: [
      'Limitez les liens aux categories principales',
      'Utilisez des sous-menus au survol plutot que tout afficher',
      'Priorisez les pages importantes dans la navigation',
      'Considerez la navigation a facettes pour les e-commerces'
    ],
    impact: 'medium'
  },
  {
    id: 29,
    name: 'Navigation mobile',
    category: 'navigation',
    description: 'Verification que la navigation mobile contient les memes liens que desktop.',
    why: 'Avec l\'indexation mobile-first, les liens absents sur mobile ne seront pas pris en compte.',
    howToFix: [
      'Assurez la parite des liens entre mobile et desktop',
      'Testez avec l\'outil Mobile-Friendly de Google',
      'Utilisez un menu hamburger accessible',
      'Verifiez que tous les liens sont cliquables sur mobile'
    ],
    impact: 'high'
  },
  {
    id: 36,
    name: 'Redirections internes',
    category: 'navigation',
    description: 'Detection des liens internes pointant vers des pages redirigees.',
    why: 'Les chaines de redirections gaspillent le budget de crawl et perdent du PageRank.',
    howToFix: [
      'Mettez a jour les liens vers les URLs finales',
      'Evitez les chaines de redirections (A→B→C)',
      'Corrigez les liens vers les anciennes URLs',
      'Auditez regulierement avec un crawler'
    ],
    impact: 'medium'
  },
  {
    id: 38,
    name: 'Pagination',
    category: 'navigation',
    description: 'Implementation correcte de la pagination pour les listes longues.',
    why: 'Une mauvaise pagination peut creer du contenu duplique ou empecher l\'indexation des pages profondes.',
    howToFix: [
      'Utilisez des URLs uniques pour chaque page (page=2)',
      'Ajoutez des liens vers la premiere et derniere page',
      'Evitez le "load more" infini sans URLs distinctes',
      'Considerez le "view all" pour les petites listes'
    ],
    impact: 'medium'
  },
  {
    id: 39,
    name: 'Strategie filtres',
    category: 'navigation',
    description: 'Gestion SEO des filtres et de la navigation a facettes (e-commerce).',
    why: 'Les filtres peuvent creer des milliers de pages similaires diluant l\'autorite.',
    howToFix: [
      'Utilisez canonical vers la page principale',
      'Bloquez les combinaisons de filtres inutiles dans robots.txt',
      'N\'indexez que les filtres avec volume de recherche',
      'Utilisez les parametres URL dans Search Console'
    ],
    impact: 'high'
  },
  {
    id: 41,
    name: 'Liens nofollow internes',
    category: 'navigation',
    description: 'Detection des liens internes avec l\'attribut rel="nofollow".',
    why: 'Le nofollow sur les liens internes gaspille le PageRank au lieu de le distribuer.',
    howToFix: [
      'Retirez nofollow des liens internes importants',
      'Reservez nofollow pour les liens externes non approuves',
      'Utilisez plutot l\'attribut sponsored ou ugc si necessaire',
      'Auditez tous vos liens internes'
    ],
    impact: 'medium'
  },

  // Analyse Technique
  {
    id: 7,
    name: 'Analyse Crawl Stats',
    category: 'analysis',
    description: 'Analyse des statistiques de crawl dans Google Search Console.',
    why: 'Comprendre comment Google crawle votre site aide a optimiser le budget de crawl.',
    howToFix: [
      'Consultez le rapport "Exploration" dans Search Console',
      'Identifiez les pics et baisses de crawl',
      'Verifiez le temps de reponse moyen',
      'Optimisez les pages les plus crawlees'
    ],
    impact: 'medium'
  },
  {
    id: 13,
    name: 'Parametres URL',
    category: 'analysis',
    description: 'Gestion des parametres URL pour eviter le contenu duplique.',
    why: 'Les parametres comme ?sort=price creent des versions multiples de la meme page.',
    howToFix: [
      'Utilisez canonical vers l\'URL sans parametres',
      'Configurez les parametres dans Search Console',
      'Bloquez les parametres inutiles dans robots.txt',
      'Utilisez des URLs propres quand possible'
    ],
    impact: 'medium'
  },
  {
    id: 14,
    name: 'Contenu duplique',
    category: 'analysis',
    description: 'Detection de contenu identique ou tres similaire sur plusieurs URLs.',
    why: 'Le contenu duplique dilue l\'autorite et peut entrainer des penalites.',
    howToFix: [
      'Utilisez canonical pour indiquer la version principale',
      'Fusionnez les pages avec contenu similaire',
      'Redirigez les anciennes URLs vers les nouvelles',
      'Verifiez les versions HTTP/HTTPS et www/non-www'
    ],
    impact: 'high'
  },
  {
    id: 16,
    name: 'Recherche interne',
    category: 'analysis',
    description: 'Configuration de la recherche interne pour ne pas indexer les pages de resultats.',
    why: 'Les pages de resultats de recherche creent du contenu duplique et de faible qualite.',
    howToFix: [
      'Ajoutez noindex sur les pages de resultats',
      'Bloquez /search dans robots.txt',
      'Utilisez canonical vers une page pertinente',
      'Analysez les recherches pour creer du contenu'
    ],
    impact: 'medium'
  },
  {
    id: 17,
    name: 'Rapport Coverage',
    category: 'analysis',
    description: 'Analyse du rapport de couverture dans Google Search Console.',
    why: 'Ce rapport montre les erreurs d\'indexation et les pages exclues.',
    howToFix: [
      'Corrigez les erreurs 404 et serveur',
      'Verifiez les pages bloquees par robots.txt',
      'Examinez les pages avec "Crawled - currently not indexed"',
      'Soumettez les pages importantes via l\'inspection d\'URL'
    ],
    impact: 'high'
  },
  {
    id: 45,
    name: 'Analyse logs serveur',
    category: 'analysis',
    description: 'Analyse des logs serveur pour comprendre le comportement de Googlebot.',
    why: 'Les logs revelent exactement ce que Google crawle et les erreurs rencontrees.',
    howToFix: [
      'Configurez l\'acces aux logs serveur',
      'Filtrez par user-agent Googlebot',
      'Identifiez les pages trop ou pas assez crawlees',
      'Detectez les erreurs 5xx cote serveur'
    ],
    impact: 'medium'
  },

  // Gestion d'Erreurs
  {
    id: 40,
    name: 'Page 404',
    category: 'errors',
    description: 'Verification que la page 404 est utile et renvoie bien un code 404.',
    why: 'Une page 404 personnalisee aide les utilisateurs. Un faux 200 sur les 404 cree des problemes d\'indexation.',
    howToFix: [
      'Creez une page 404 personnalisee avec navigation',
      'Verifiez que le code HTTP est bien 404',
      'Ajoutez un lien vers la homepage et la recherche',
      'Proposez des pages alternatives pertinentes'
    ],
    impact: 'medium'
  },
  {
    id: 50,
    name: 'Liens casses',
    category: 'errors',
    description: 'Detection des liens internes menant a des pages 404.',
    why: 'Les liens casses nuisent a l\'experience utilisateur et gaspillent le budget de crawl.',
    howToFix: [
      'Auditez regulierement avec un crawler',
      'Corrigez ou supprimez les liens vers les 404',
      'Mettez en place des redirections 301 si pertinent',
      'Verifiez apres chaque migration ou suppression'
    ],
    impact: 'high'
  }
];

export const FAQ_ITEMS = [
  {
    question: 'Qu\'est-ce qu\'un audit SEO technique ?',
    answer: 'Un audit SEO technique analyse les aspects techniques de votre site web qui impactent son referencement naturel : performance, accessibilite, indexation, structure des URLs, donnees structurees, etc. Il identifie les problemes et propose des solutions.'
  },
  {
    question: 'Pourquoi les 50 points sont-ils importants ?',
    answer: 'Ces 50 points couvrent tous les aspects techniques du SEO moderne : de la securite HTTPS aux Core Web Vitals, en passant par le maillage interne et les donnees structurees. Chaque point peut impacter votre classement dans Google.'
  },
  {
    question: 'Combien de temps prend un audit complet ?',
    answer: 'Notre outil analyse votre site en moins de 2 minutes. Cependant, la correction des problemes identifies peut prendre de quelques heures a plusieurs semaines selon leur complexite.'
  },
  {
    question: 'Quelle est la difference entre SEO technique et SEO contenu ?',
    answer: 'Le SEO technique concerne l\'infrastructure de votre site (vitesse, securite, crawlabilite). Le SEO contenu concerne la qualite et la pertinence de vos textes. Les deux sont essentiels pour un bon referencement.'
  },
  {
    question: 'A quelle frequence dois-je faire un audit ?',
    answer: 'Nous recommandons un audit technique complet tous les 3-6 mois, ou apres chaque modification majeure du site (refonte, migration, nouvelles fonctionnalites).'
  },
  {
    question: 'Les resultats sont-ils fiables ?',
    answer: 'Nos analyses sont basees sur les recommandations officielles de Google et les meilleures pratiques du secteur. Chaque verification est automatisee et reproductible.'
  }
];
