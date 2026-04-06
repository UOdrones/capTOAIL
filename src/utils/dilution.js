/**
 * Dilution math for SAFE, PE, and Angel+VC investment modes.
 * All functions return a new holders array with updated percentages.
 */

/**
 * SAFE conversion: investors get equity based on valuation cap / discount,
 * diluting all existing holders proportionally.
 *
 * @param {Array} holders - Current holders [{name, percent, ...}]
 * @param {number} investmentAmount - $ being invested
 * @param {number} valuationCap - SAFE valuation cap ($)
 * @param {number} discount - Discount rate (0–100)
 * @param {number} preMoneyValuation - Pre-money valuation at next round ($)
 * @returns {{ holders: Array, investorPercent: number }}
 */
export function calculateSAFE(holders, investmentAmount, valuationCap, discount, preMoneyValuation) {
  if (!investmentAmount || !preMoneyValuation) {
    return { holders: [...holders], investorPercent: 0 };
  }

  // Effective valuation = min(cap, discounted valuation)
  const discountedVal = preMoneyValuation * (1 - discount / 100);
  const effectiveVal = valuationCap > 0 ? Math.min(valuationCap, discountedVal) : discountedVal;

  // Post-money = pre-money + investment
  const postMoney = effectiveVal + investmentAmount;
  const investorPercent = (investmentAmount / postMoney) * 100;
  const dilutionFactor = 1 - investorPercent / 100;

  const dilutedHolders = holders.map(h => ({
    ...h,
    percent: parseFloat((h.percent * dilutionFactor).toFixed(2)),
  }));

  return { holders: dilutedHolders, investorPercent: parseFloat(investorPercent.toFixed(2)) };
}

/**
 * Private Equity buyout: investor acquires a target percentage,
 * diluting existing holders proportionally.
 *
 * @param {Array} holders - Current holders
 * @param {number} targetPercent - % the PE firm wants to acquire
 * @param {number} valuation - Company valuation ($)
 * @returns {{ holders: Array, investorPercent: number, investmentAmount: number }}
 */
export function calculatePE(holders, targetPercent, valuation) {
  if (!targetPercent || !valuation) {
    return { holders: [...holders], investorPercent: 0, investmentAmount: 0 };
  }

  const investorPercent = Math.min(targetPercent, 99);
  const dilutionFactor = 1 - investorPercent / 100;
  const investmentAmount = (investorPercent / 100) * valuation;

  const dilutedHolders = holders.map(h => ({
    ...h,
    percent: parseFloat((h.percent * dilutionFactor).toFixed(2)),
  }));

  return {
    holders: dilutedHolders,
    investorPercent: parseFloat(investorPercent.toFixed(2)),
    investmentAmount: parseFloat(investmentAmount.toFixed(2)),
  };
}

/**
 * Angel + VC: Two-step dilution.
 * Step 1: Angel SAFE converts at seed valuation
 * Step 2: VC priced round dilutes everyone including converted angel
 *
 * @param {Array} holders
 * @param {number} angelAmount
 * @param {number} angelCap - Angel SAFE valuation cap
 * @param {number} vcAmount
 * @param {number} preMoneyValuation - Pre-money valuation at VC round
 * @returns {{ holders: Array, angelPercent: number, vcPercent: number }}
 */
export function calculateAngelVC(holders, angelAmount, angelCap, vcAmount, preMoneyValuation) {
  if (!preMoneyValuation) {
    return { holders: [...holders], angelPercent: 0, vcPercent: 0 };
  }

  // Step 1: Angel SAFE converts
  const step1 = calculateSAFE(holders, angelAmount, angelCap, 0, preMoneyValuation);
  const angelPercent = step1.investorPercent;

  // Step 2: VC priced round on top
  const allHoldersAfterAngel = [
    ...step1.holders,
    { id: 'angel', name: 'Angel Investor(s)', role: 'Angel', percent: angelPercent, color: '#fbbf24', group: 'investor' },
  ];

  const postMoneyVC = preMoneyValuation + vcAmount;
  const vcPercent = vcAmount > 0 ? (vcAmount / postMoneyVC) * 100 : 0;
  const vcDilution = 1 - vcPercent / 100;

  const finalHolders = allHoldersAfterAngel.map(h => ({
    ...h,
    percent: parseFloat((h.percent * vcDilution).toFixed(2)),
  }));

  return {
    holders: finalHolders,
    angelPercent: parseFloat((angelPercent * vcDilution).toFixed(2)),
    vcPercent: parseFloat(vcPercent.toFixed(2)),
  };
}

/**
 * Add an ESOP (option pool) by diluting all holders proportionally.
 */
export function addOptionPool(holders, poolPercent) {
  if (!poolPercent) return [...holders];
  const dilutionFactor = 1 - poolPercent / 100;
  return holders.map(h => ({
    ...h,
    percent: parseFloat((h.percent * dilutionFactor).toFixed(2)),
  }));
}

/**
 * Format dollar amounts
 */
export function formatDollars(amount) {
  if (amount >= 1_000_000_000) return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
  return `$${amount.toFixed(0)}`;
}

/**
 * Format percentage
 */
export function formatPercent(pct) {
  return `${pct.toFixed(2)}%`;
}
