import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Link,
} from '@react-pdf/renderer';
import type { AuditCategory, CheckResult, CheckStatus } from '@/types/audit';

// Register fonts
Font.register({
  family: 'Inter',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2',
      fontWeight: 400,
    },
    {
      src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiJ-Ek-_EeA.woff2',
      fontWeight: 600,
    },
    {
      src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiJ-Ek-_EeA.woff2',
      fontWeight: 700,
    },
  ],
});

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
    fontFamily: 'Inter',
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

// Helper to get status symbol
const getStatusSymbol = (status: CheckStatus): string => {
  switch (status) {
    case 'pass':
      return '✓';
    case 'warning':
      return '!';
    case 'fail':
      return '✗';
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

// Check Item Component
const CheckItemView = ({ check }: { check: CheckResult }) => (
  <View style={styles.checkItem} wrap={false}>
    <View style={[styles.checkStatus, { backgroundColor: getStatusColor(check.status) }]}>
      <Text style={styles.checkStatusText}>{getStatusSymbol(check.status)}</Text>
    </View>
    <View style={styles.checkContent}>
      <Text style={styles.checkName}>
        #{check.id} - {check.name}
      </Text>
      <Text style={styles.checkMessage}>{check.message}</Text>
      {check.recommendation && check.status !== 'pass' && (
        <Text style={styles.checkRecommendation}>
          Recommandation: {check.recommendation}
        </Text>
      )}
    </View>
  </View>
);

// Category Section Component
const CategorySection = ({ category }: { category: AuditCategory }) => (
  <View style={styles.categorySection} wrap={false}>
    <View style={styles.categoryHeader}>
      <Text style={styles.categoryIcon}>{category.icon}</Text>
      <Text style={styles.categoryName}>{category.name}</Text>
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
            <Text style={styles.domain}>{domain}</Text>
            <Text style={styles.date}>Analyse du {formattedDate}</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Rapport d'Audit SEO Technique</Text>
        <Text style={styles.subtitle}>
          Analyse complete de {url} sur 50 points SEO
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
            Decouvrir SearchXLab →
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
