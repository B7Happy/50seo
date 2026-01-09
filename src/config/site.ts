export const siteConfig = {
  name: '50SEO',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://50seo.fr',
  description: 'Auditez votre SEO technique en 2 minutes. 50 points. Gratuit.',
  searchXLabUrl: process.env.NEXT_PUBLIC_SEARCHXLAB_URL || 'https://www.searchxlab.com',
  calLink: process.env.NEXT_PUBLIC_CAL_LINK || 'https://app.cal.eu/searchxlab/discovery-call',
  keywords: [
    'audit seo gratuit',
    'checker seo',
    'analyse seo site',
    'outil seo gratuit',
    'checklist seo technique',
    'vérifier seo site',
  ] as string[],
};
