import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from '@react-pdf/renderer';
import type { AuditCategory, CheckResult, CheckStatus } from '@/types/audit';

// Use built-in Helvetica font (woff2 fonts cause DataView errors)

// Sanitize text to remove problematic characters for PDF rendering
const sanitizeText = (text: string | undefined | null): string => {
  if (!text) return '';
  // Remove emojis and other problematic Unicode characters
  return text
    .replace(/[\u{1F600}-\u{1F64F}]/gu, '') // Emoticons
    .replace(/[\u{1F300}-\u{1F5FF}]/gu, '') // Misc Symbols and Pictographs
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // Transport and Map
    .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '') // Flags
    .replace(/[\u{2600}-\u{26FF}]/gu, '')   // Misc symbols
    .replace(/[\u{2700}-\u{27BF}]/gu, '')   // Dingbats
    .replace(/[\u{FE00}-\u{FE0F}]/gu, '')   // Variation Selectors
    .replace(/[\u{1F900}-\u{1F9FF}]/gu, '') // Supplemental Symbols
    .replace(/[\u{1FA00}-\u{1FA6F}]/gu, '') // Chess Symbols
    .replace(/[\u{1FA70}-\u{1FAFF}]/gu, '') // Symbols and Pictographs Extended-A
    .replace(/[\u2192\u2190\u2191\u2193\u2194\u2195]/g, '->') // Arrows
    .replace(/[^\x00-\x7F\u00C0-\u00FF\u0100-\u017F]/g, ''); // Keep only ASCII + Latin Extended
};

// Colors
const colors = {
  primary: '#3B82F6',
  success: '#22C55E',
  warning: '#F59E0B',
  destructive: '#EF4444',
  muted: '#6B7280',
  background: '#FFFFFF',
  foreground: '#111827',
  border: '#E5E7EB',
  cardBg: '#F9FAFB',
};

// Styles
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 40,
    backgroundColor: colors.background,
    color: colors.foreground,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logo: {
    fontSize: 24,
    fontWeight: 700,
    color: colors.primary,
  },
  headerRight: {
    textAlign: 'right',
  },
  domain: {
    fontSize: 12,
    fontWeight: 600,
    color: colors.foreground,
    marginBottom: 4,
  },
  date: {
    fontSize: 9,
    color: colors.muted,
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    color: colors.foreground,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 11,
    color: colors.muted,
    marginBottom: 30,
  },
  scoreSection: {
    flexDirection: 'row',
    marginBottom: 30,
    gap: 20,
  },
  scoreCard: {
    flex: 1,
    backgroundColor: colors.cardBg,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: 700,
    marginBottom: 4,
  },
  scoreLabel: {
    fontSize: 9,
    color: colors.muted,
    textTransform: 'uppercase',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 2,
  },
  summaryLabel: {
    fontSize: 8,
    textTransform: 'uppercase',
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
  },
  categoryIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  categoryName: {
    flex: 1,
    fontSize: 12,
    fontWeight: 600,
  },
  categoryScore: {
    fontSize: 11,
    fontWeight: 600,
    color: colors.primary,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  checkStatus: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkStatusText: {
    fontSize: 8,
    fontWeight: 700,
    color: colors.background,
  },
  checkContent: {
    flex: 1,
  },
  checkName: {
    fontSize: 10,
    fontWeight: 600,
    marginBottom: 2,
  },
  checkMessage: {
    fontSize: 9,
    color: colors.muted,
    marginBottom: 4,
  },
  checkRecommendation: {
    fontSize: 9,
    color: colors.foreground,
    backgroundColor: colors.cardBg,
    padding: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerText: {
    fontSize: 8,
    color: colors.muted,
  },
  footerLink: {
    fontSize: 8,
    color: colors.primary,
    textDecoration: 'none',
  },
  pageNumber: {
    fontSize: 8,
    color: colors.muted,
  },
  ctaSection: {
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
    padding: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: colors.primary,
    marginBottom: 8,
  },
  ctaText: {
    fontSize: 10,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 12,
  },
  ctaLink: {
    fontSize: 10,
    fontWeight: 600,
    color: colors.primary,
    textDecoration: 'none',
  },
});

// Helper to get status color
const getStatusColor = (status: CheckStatus): string => {
  switch (status) {
    case 'pass':
      return colors.success;
    case 'warning':
      return colors.warning;
    case 'fail':
      return colors.destructive;
    default:
      return colors.muted;
  }
};

// Helper to get status symbol (using ASCII for PDF compatibility)
const getStatusSymbol = (status: CheckStatus): string => {
  switch (status) {
    case 'pass':
      return 'OK';
    case 'warning':
      return '!';
    case 'fail':
      return 'X';
    case 'manual':
      return '?';
    default:
      return '-';
  }
};

// Helper to get score color
const getScoreColor = (score: number): string => {
  if (score >= 80) return colors.success;
  if (score >= 50) return colors.warning;
  return colors.destructive;
};

// Map category IDs to text-based icons (emojis don't work in react-pdf)
const getCategoryIcon = (categoryId: string): string => {
  const iconMap: Record<string, string> = {
    international: '[i18n]',
    technical: '[tech]',
    content: '[txt]',
    schema: '[data]',
    media: '[img]',
    performance: '[perf]',
    javascript: '[js]',
    navigation: '[nav]',
    analysis: '[log]',
    errors: '[err]',
  };
  return iconMap[categoryId] || '[?]';
};

// Check Item Component
const CheckItemView = ({ check }: { check: CheckResult }) => (
  <View style={styles.checkItem} wrap={false}>
    <View style={[styles.checkStatus, { backgroundColor: getStatusColor(check.status) }]}>
      <Text style={styles.checkStatusText}>{getStatusSymbol(check.status)}</Text>
    </View>
    <View style={styles.checkContent}>
      <Text style={styles.checkName}>
        #{check.id} - {sanitizeText(check.name)}
      </Text>
      <Text style={styles.checkMessage}>{sanitizeText(check.message)}</Text>
      {check.recommendation && check.status !== 'pass' && (
        <Text style={styles.checkRecommendation}>
          Recommandation: {sanitizeText(check.recommendation)}
        </Text>
      )}
    </View>
  </View>
);

// Category Section Component
const CategorySection = ({ category }: { category: AuditCategory }) => (
  <View style={styles.categorySection} wrap={false}>
    <View style={styles.categoryHeader}>
      <Text style={styles.categoryIcon}>{getCategoryIcon(category.id)}</Text>
      <Text style={styles.categoryName}>{sanitizeText(category.name)}</Text>
      <Text style={styles.categoryScore}>
        {category.score}/{category.maxScore}
      </Text>
    </View>
    {category.checks.map((check) => (
      <CheckItemView key={check.id} check={check} />
    ))}
  </View>
);

// Props interface
interface AuditPDFProps {
  id: string;
  domain: string;
  url: string;
  score: number;
  summary: {
    passed: number;
    warnings: number;
    critical: number;
    notApplicable: number;
  };
  categories: AuditCategory[];
  createdAt: Date;
}

// Main PDF Document
export function AuditPDF({
  domain,
  url,
  score,
  summary,
  categories,
  createdAt,
}: AuditPDFProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>50SEO</Text>
          <View style={styles.headerRight}>
            <Text style={styles.domain}>{sanitizeText(domain)}</Text>
            <Text style={styles.date}>Analyse du {formattedDate}</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Rapport d Audit SEO Technique</Text>
        <Text style={styles.subtitle}>
          Analyse complete de {sanitizeText(url)} sur 50 points SEO
        </Text>

        {/* Score Section */}
        <View style={styles.scoreSection}>
          <View style={styles.scoreCard}>
            <Text style={[styles.scoreValue, { color: getScoreColor(score) }]}>
              {score}
            </Text>
            <Text style={styles.scoreLabel}>Score Global /100</Text>
          </View>
        </View>

        {/* Summary Row */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: '#DCFCE7' }]}>
            <Text style={[styles.summaryValue, { color: colors.success }]}>
              {summary.passed}
            </Text>
            <Text style={[styles.summaryLabel, { color: colors.success }]}>Reussis</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: '#FEF3C7' }]}>
            <Text style={[styles.summaryValue, { color: colors.warning }]}>
              {summary.warnings}
            </Text>
            <Text style={[styles.summaryLabel, { color: colors.warning }]}>
              Avertissements
            </Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: '#FEE2E2' }]}>
            <Text style={[styles.summaryValue, { color: colors.destructive }]}>
              {summary.critical}
            </Text>
            <Text style={[styles.summaryLabel, { color: colors.destructive }]}>
              Critiques
            </Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: '#F3F4F6' }]}>
            <Text style={[styles.summaryValue, { color: colors.muted }]}>
              {summary.notApplicable}
            </Text>
            <Text style={[styles.summaryLabel, { color: colors.muted }]}>N/A</Text>
          </View>
        </View>

        {/* Categories */}
        {categories.map((category) => (
          <CategorySection key={category.id} category={category} />
        ))}

        {/* CTA Section */}
        <View style={styles.ctaSection} wrap={false}>
          <Text style={styles.ctaTitle}>Besoin d'aide pour ameliorer votre SEO ?</Text>
          <Text style={styles.ctaText}>
            Decouvrez notre audit GEO (Generative Engine Optimization) et boostez
            votre visibilite sur les moteurs IA comme ChatGPT et Perplexity.
          </Text>
          <Link src="https://www.searchxlab.com" style={styles.ctaLink}>
            Decouvrir SearchXLab
          </Link>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Propulse par{' '}
            <Link src="https://www.searchxlab.com" style={styles.footerLink}>
              SearchXLab
            </Link>
          </Text>
          <Link src="https://50seo.fr" style={styles.footerLink}>
            50seo.fr
          </Link>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );
}
