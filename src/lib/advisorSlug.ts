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
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'school';
}

export function buildAdvisorNameSlug(firstName: string, lastName: string): string {
  const norm = (s: string) =>
    s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return `${norm(firstName)}-${norm(lastName)}`;
}

// Backward-compatible: returns just the name slug (first-last). Institution is encoded
// separately in the URL path now.
export function buildAdvisorSlug(firstName: string, lastName: string, _institution?: string): string {
  return buildAdvisorNameSlug(firstName, lastName);
}

// New URL format: prelaw.jdnext.org/[institution-shortcode]/advisor/[firstname-lastname]
export function buildAdvisorUrl(nameSlug: string, institution: string): string {
  return `prelaw.jdnext.org/${institutionShortcode(institution)}/advisor/${nameSlug}`;
}

export function buildAdvisorPath(nameSlug: string, institution: string): string {
  return `/${institutionShortcode(institution)}/advisor/${nameSlug}`;
}