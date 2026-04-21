const shortcode: Record<string, string> = {
  'Harvard University': 'harvard',
  'Stanford University': 'stanford',
  'MIT': 'mit',
  'Yale University': 'yale',
  'Princeton University': 'princeton',
  'Columbia University': 'columbia',
  'University of Chicago': 'uchicago',
  'Duke University': 'duke',
  'University of Pennsylvania': 'upenn',
  'Northwestern University': 'northwestern',
  'UCLA': 'ucla',
  'UC Berkeley': 'berkeley',
  'University of Michigan': 'umich',
  'NYU': 'nyu',
  'University of Virginia': 'uva',
  'University of Texas at Austin': 'utexas',
  'Georgetown University': 'georgetown',
  'University of Florida': 'ufl',
  'Ohio State University': 'osu',
  'Penn State University': 'psu',
  'University of Wisconsin': 'wisc',
  'University of Washington': 'uw',
  'Boston University': 'bu',
  'Arizona State University': 'asu',
  'SMU': 'smu',
  'Vanderbilt University': 'vandy',
  'George Washington University': 'gwu',
  'Emory University': 'emory',
  'USC': 'usc',
  'University of North Carolina': 'unc',
};

export function institutionShortcode(institution: string): string {
  if (shortcode[institution]) return shortcode[institution];
  return institution
    .toLowerCase()
    .replace(/university of /g, '')
    .replace(/university/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 24) || 'school';
}

export function buildAdvisorSlug(firstName: string, lastName: string, institution: string): string {
  const norm = (s: string) =>
    s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return `${norm(firstName)}-${norm(lastName)}-${institutionShortcode(institution)}`;
}

export function buildAdvisorUrl(slug: string): string {
  return `prelaw.jdnext.org/advisor/${slug}`;
}