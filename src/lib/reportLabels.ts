import { SchoolClassification, ListComposition } from '@/types/intake';

// Display-only labels. The stored values (Reach / Target / Safety and
// Overreaching / Healthy / Underreaching) are unchanged so existing reports
// keep working — only the words shown to students and advisors live here.
export const SCHOOL_CLASSIFICATION_LABELS: Record<SchoolClassification, string> = {
  Reach: 'Below Median',
  Target: 'Within Range',
  Safety: 'Above Median',
};

export const LIST_COMPOSITION_LABELS: Record<ListComposition, string> = {
  Overreaching: 'Profile Skews Above Median',
  Healthy: 'Profile Range Mixed',
  Underreaching: 'Profile Skews Below Median',
};

export function classificationLabel(classification: SchoolClassification): string {
  return SCHOOL_CLASSIFICATION_LABELS[classification] ?? classification;
}

export function listCompositionLabel(composition: ListComposition): string {
  return LIST_COMPOSITION_LABELS[composition] ?? composition;
}
