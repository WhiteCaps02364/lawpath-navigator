export function institutionShortcode(institution: string): string {
  // Always derive from the full institution name: lowercase, strip special characters,
  // collapse whitespace/punctuation to single hyphens.
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