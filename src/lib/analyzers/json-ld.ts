import type { CheckResult } from '@/types/audit';
import type { AuditContext } from './types';
import { pass, warning, fail } from './types';

interface SchemaObject {
  '@type'?: string;
  '@context'?: string;
  '@graph'?: SchemaObject[];
  [key: string]: unknown;
}

function extractSchemas(context: AuditContext): { schemas: SchemaObject[]; errors: string[] } {
  const { $ } = context;
  const schemas: SchemaObject[] = [];
  const errors: string[] = [];

  // Extract JSON-LD
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const content = $(el).html() || '';
      const json = JSON.parse(content);

      if (Array.isArray(json)) {
        schemas.push(...json);
      } else if (json['@graph']) {
        schemas.push(...json['@graph']);
      } else {
        schemas.push(json);
      }
    } catch (e) {
      errors.push(`JSON-LD invalide: ${e instanceof Error ? e.message : 'parse error'}`);
    }
  });

  // Extract Microdata
  $('[itemscope]').each((_, el) => {
    const itemtype = $(el).attr('itemtype');
    if (itemtype) {
      const type = itemtype.split('/').pop() || '';
      schemas.push({ '@type': type, _source: 'microdata' } as SchemaObject);
    }
  });

  return { schemas, errors };
}

// Check #19: Données structurées avancées
export function analyzeAdvancedSchema(context: AuditContext): CheckResult {
  const CHECK_ID = 19;
  const CHECK_NAME = 'Données structurées avancées';
  const CATEGORY = 'schema';

  const { schemas, errors } = extractSchemas(context);

  if (errors.length > 0) {
    return fail(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      `${errors.length} erreur(s) de parsing JSON-LD`,
      errors.join('. ') + '. Corrigez la syntaxe JSON.',
      'Erreurs de syntaxe JSON détectées'
    );
  }

  if (schemas.length === 0) {
    return fail(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Aucune donnée structurée détectée',
      'Ajoutez des données structurées Schema.org pour améliorer l\'affichage dans les résultats de recherche.'
    );
  }

  const types = schemas.map(s => s['@type']).filter(Boolean);
  const uniqueTypes = [...new Set(types)];

  // Check for rich result eligible types
  const richTypes = ['Product', 'Article', 'NewsArticle', 'BlogPosting', 'Recipe', 'Event', 'LocalBusiness', 'Organization', 'Person', 'FAQPage', 'HowTo', 'Review', 'AggregateRating', 'JobPosting', 'Course', 'VideoObject'];

  const richTypesFound = uniqueTypes.filter(t => richTypes.includes(t as string));

  const details = `${schemas.length} schema(s) détecté(s): ${uniqueTypes.join(', ')}`;

  if (richTypesFound.length === 0) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Données structurées basiques uniquement',
      'Ajoutez des types éligibles aux résultats enrichis (Product, Article, FAQPage, etc.).',
      details
    );
  }

  return pass(
    CHECK_ID,
    CHECK_NAME,
    CATEGORY,
    `${richTypesFound.length} type(s) de données structurées avancées`,
    details
  );
}

// Check #21: Validation Schema
export function analyzeSchemaValidation(context: AuditContext): CheckResult {
  const CHECK_ID = 21;
  const CHECK_NAME = 'Validation Schema';
  const CATEGORY = 'schema';

  const { schemas, errors } = extractSchemas(context);

  if (errors.length > 0) {
    return fail(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Erreurs de syntaxe dans les données structurées',
      errors.join('. '),
      `${errors.length} erreur(s) détectée(s)`
    );
  }

  if (schemas.length === 0) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Aucune donnée structurée à valider',
      'Ajoutez des données structurées Schema.org.'
    );
  }

  const validationIssues: string[] = [];

  // Basic validation checks
  for (const schema of schemas) {
    const type = schema['@type'];

    if (!type) {
      validationIssues.push('Schema sans @type');
      continue;
    }

    // Check required properties for common types
    switch (type) {
      case 'Product':
        if (!schema.name) validationIssues.push('Product: name manquant');
        break;
      case 'Article':
      case 'NewsArticle':
      case 'BlogPosting':
        if (!schema.headline && !schema.name) validationIssues.push(`${type}: headline manquant`);
        if (!schema.author) validationIssues.push(`${type}: author manquant`);
        if (!schema.datePublished) validationIssues.push(`${type}: datePublished manquant`);
        break;
      case 'Organization':
        if (!schema.name) validationIssues.push('Organization: name manquant');
        break;
      case 'LocalBusiness':
        if (!schema.name) validationIssues.push('LocalBusiness: name manquant');
        if (!schema.address) validationIssues.push('LocalBusiness: address manquant');
        break;
      case 'FAQPage':
        if (!schema.mainEntity || (Array.isArray(schema.mainEntity) && schema.mainEntity.length === 0)) {
          validationIssues.push('FAQPage: mainEntity (questions) manquant');
        }
        break;
      case 'BreadcrumbList':
        if (!schema.itemListElement || (Array.isArray(schema.itemListElement) && schema.itemListElement.length === 0)) {
          validationIssues.push('BreadcrumbList: itemListElement manquant');
        }
        break;
    }
  }

  const types = schemas.map(s => s['@type']).filter(Boolean);
  const details = `Types: ${[...new Set(types)].join(', ')}`;

  if (validationIssues.length > 3) {
    return fail(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      `${validationIssues.length} problèmes de validation`,
      validationIssues.slice(0, 5).join('. ') + (validationIssues.length > 5 ? '...' : ''),
      details
    );
  }

  if (validationIssues.length > 0) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      `${validationIssues.length} avertissement(s) de validation`,
      validationIssues.join('. '),
      details
    );
  }

  return pass(
    CHECK_ID,
    CHECK_NAME,
    CATEGORY,
    'Données structurées valides',
    details
  );
}

// Check #24: Format JSON-LD
export function analyzeJsonLdFormat(context: AuditContext): CheckResult {
  const CHECK_ID = 24;
  const CHECK_NAME = 'Format JSON-LD';
  const CATEGORY = 'schema';

  const { $ } = context;

  const jsonLdScripts = $('script[type="application/ld+json"]');
  const microdataElements = $('[itemscope]');
  const rdfaElements = $('[typeof]');

  const hasJsonLd = jsonLdScripts.length > 0;
  const hasMicrodata = microdataElements.length > 0;
  const hasRdfa = rdfaElements.length > 0;

  const formats: string[] = [];
  if (hasJsonLd) formats.push(`JSON-LD (${jsonLdScripts.length})`);
  if (hasMicrodata) formats.push(`Microdata (${microdataElements.length})`);
  if (hasRdfa) formats.push(`RDFa (${rdfaElements.length})`);

  if (formats.length === 0) {
    return fail(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Aucun format de données structurées détecté',
      'Utilisez JSON-LD, le format recommandé par Google.'
    );
  }

  // JSON-LD is the recommended format
  if (hasJsonLd && !hasMicrodata && !hasRdfa) {
    return pass(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'JSON-LD utilisé (format recommandé)',
      formats.join(', ')
    );
  }

  if (hasJsonLd) {
    if (hasMicrodata || hasRdfa) {
      return warning(
        CHECK_ID,
        CHECK_NAME,
        CATEGORY,
        'Plusieurs formats de données structurées utilisés',
        'Privilégiez JSON-LD et évitez de mélanger les formats pour plus de clarté.',
        formats.join(', ')
      );
    }
  }

  // Only microdata or RDFa
  return warning(
    CHECK_ID,
    CHECK_NAME,
    CATEGORY,
    'Format de données structurées non optimal',
    'Migrez vers JSON-LD, le format recommandé par Google pour sa facilité de maintenance.',
    formats.join(', ')
  );
}

// Check #25: Schema avancé (specific rich types)
export function analyzeAdvancedSchemaTypes(context: AuditContext): CheckResult {
  const CHECK_ID = 25;
  const CHECK_NAME = 'Schema avancé';
  const CATEGORY = 'schema';

  const { schemas } = extractSchemas(context);
  const types = schemas.map(s => s['@type']).filter(Boolean) as string[];

  // Advanced schema types that show extra features in SERP
  const advancedTypes: Record<string, string[]> = {
    'FAQPage': ['Questions/Réponses dans les SERP'],
    'HowTo': ['Étapes interactives dans les SERP'],
    'Recipe': ['Temps de cuisson, calories, notation'],
    'Product': ['Prix, disponibilité, avis'],
    'Review': ['Étoiles dans les SERP'],
    'AggregateRating': ['Notation agrégée'],
    'Event': ['Date, lieu dans les SERP'],
    'JobPosting': ['Offre d\'emploi enrichie'],
    'Course': ['Cours avec détails'],
    'VideoObject': ['Aperçu vidéo'],
    'SoftwareApplication': ['Détails application'],
  };

  const foundAdvanced: { type: string; benefits: string[] }[] = [];

  for (const type of types) {
    if (advancedTypes[type]) {
      foundAdvanced.push({ type, benefits: advancedTypes[type] });
    }
  }

  const hasBasicSchema = types.some(t =>
    ['Organization', 'WebSite', 'WebPage', 'BreadcrumbList', 'Person'].includes(t)
  );

  if (foundAdvanced.length === 0) {
    if (hasBasicSchema) {
      return warning(
        CHECK_ID,
        CHECK_NAME,
        CATEGORY,
        'Schemas basiques uniquement',
        'Ajoutez des types avancés (FAQPage, HowTo, Product, etc.) pour des résultats enrichis.',
        `Types actuels: ${[...new Set(types)].join(', ') || 'aucun'}`
      );
    }

    return fail(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Aucun schema avancé détecté',
      'Implémentez des données structurées avancées pour améliorer votre visibilité dans les SERP.'
    );
  }

  const details = foundAdvanced.map(a => `${a.type}: ${a.benefits.join(', ')}`).join('; ');

  return pass(
    CHECK_ID,
    CHECK_NAME,
    CATEGORY,
    `${foundAdvanced.length} type(s) de schema avancé`,
    details
  );
}
