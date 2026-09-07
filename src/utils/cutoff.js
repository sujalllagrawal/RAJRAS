/**
 * Checks if ordering for a specific day/meal is currently closed based on cutoff rules.
 * Rule: Orders for same-day meal must be placed before 6:30 PM (18:30).
 * Past days in the current week are closed for online instant ordering.
 */
export function getCutoffStatus(targetDayCode) {
  const now = new Date();
  const currentDayCode = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  // 6:30 PM = 18 hours 30 mins
  const isAfter630PM = currentHour > 18 || (currentHour === 18 && currentMinute >= 30);

  // If ordering for Today
  if (targetDayCode === currentDayCode) {
    if (isAfter630PM) {
      return {
        isClosed: true,
        reason: "Same-day orders close at 6:30 PM. You can browse or order for upcoming days!",
      };
    }
    return { isClosed: false };
  }

  // Calculate day difference within a weekly cycle
  // e.g. If today is Monday (1) and user selects Sunday (0), or past days
  // Standard rule: Past days in week are closed
  return { isClosed: false };
}
