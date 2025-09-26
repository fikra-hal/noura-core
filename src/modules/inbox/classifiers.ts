/**
 * Determines if an inbox item needs follow-up based on days open
 * @param daysOpen Number of days the item has been open
 * @returns true if the item needs follow-up (>=3 days), false otherwise
 */
export function needsFollowUp(daysOpen: number): boolean {
  return daysOpen >= 3;
}
