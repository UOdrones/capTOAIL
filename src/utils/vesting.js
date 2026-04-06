/**
 * Vesting schedule calculations.
 * Supports 4-year and 5-year schedules with configurable cliff.
 */

/**
 * Calculate vested percentage for a holder at a given month.
 *
 * @param {number} totalPercent - Total equity grant (%)
 * @param {number} vestingYears - 4 or 5
 * @param {number} cliffMonths - Cliff in months (typically 12)
 * @param {number} elapsedMonths - Months since grant start
 * @returns {{ vested: number, unvested: number, vestedRatio: number }}
 */
export function calculateVesting(totalPercent, vestingYears, cliffMonths, elapsedMonths) {
  const totalMonths = vestingYears * 12;

  if (elapsedMonths < 0) {
    return { vested: 0, unvested: totalPercent, vestedRatio: 0 };
  }

  // Fully vested
  if (elapsedMonths >= totalMonths) {
    return { vested: totalPercent, unvested: 0, vestedRatio: 1 };
  }

  // Before cliff — nothing vested
  if (elapsedMonths < cliffMonths) {
    return { vested: 0, unvested: totalPercent, vestedRatio: 0 };
  }

  // At cliff — cliff portion vests immediately, then monthly after
  const vestedRatio = elapsedMonths / totalMonths;
  const vested = parseFloat((totalPercent * vestedRatio).toFixed(2));
  const unvested = parseFloat((totalPercent - vested).toFixed(2));

  return { vested, unvested, vestedRatio };
}

/**
 * Apply vesting to all holders at a given elapsed month.
 *
 * @param {Array} holders - Array of holders with vestingYears, cliffMonths
 * @param {number} elapsedMonths - Months elapsed
 * @returns {Array} holders with vested/unvested fields added
 */
export function applyVesting(holders, elapsedMonths) {
  return holders.map(h => {
    if (!h.vestingEnabled) {
      return { ...h, vested: h.percent, unvested: 0, vestedRatio: 1 };
    }
    const result = calculateVesting(
      h.percent,
      h.vestingYears || 4,
      h.cliffMonths || 12,
      elapsedMonths
    );
    return { ...h, ...result };
  });
}

/**
 * Generate vesting milestones for timeline display.
 */
export function getVestingMilestones(vestingYears, cliffMonths) {
  const milestones = [];
  const totalMonths = vestingYears * 12;

  milestones.push({ month: 0, label: 'Grant', type: 'start' });

  if (cliffMonths > 0) {
    milestones.push({ month: cliffMonths, label: `${cliffMonths}mo Cliff`, type: 'cliff' });
  }

  // Yearly milestones
  for (let y = 1; y <= vestingYears; y++) {
    const m = y * 12;
    if (m !== cliffMonths && m <= totalMonths) {
      milestones.push({ month: m, label: `Year ${y}`, type: y === vestingYears ? 'end' : 'year' });
    }
  }

  return milestones;
}

/**
 * Format months into a human-readable string.
 */
export function formatMonths(months) {
  if (months < 12) return `${months}mo`;
  const years = Math.floor(months / 12);
  const remaining = months % 12;
  if (remaining === 0) return `${years}yr`;
  return `${years}yr ${remaining}mo`;
}
