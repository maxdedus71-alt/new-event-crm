function toNumber(value) {
  return Number(value || 0);
}

function calculateOrderTotals(contractors = [], extraCharge = 0) {
  let totalContractorExpenses = 0;
  let totalCommission = 0;

  const normalizedContractors = contractors.map(item => {
    const serviceCost = toNumber(item.serviceCost);
    const commissionPercent = toNumber(item.commissionPercent);
    const commissionAmount = serviceCost * (commissionPercent / 100);
    const contractorTotal = serviceCost + commissionAmount;

    totalContractorExpenses += serviceCost;
    totalCommission += commissionAmount;

    return {
      ...item,
      serviceCost,
      commissionPercent,
      commissionAmount: Number(commissionAmount.toFixed(2)),
      contractorTotal: Number(contractorTotal.toFixed(2))
    };
  });

  const extra = toNumber(extraCharge);
  const clientTotal = totalContractorExpenses + totalCommission + extra;
  const taxAmount = clientTotal * 0.10;
  const netProfit = clientTotal - totalContractorExpenses - taxAmount;

  return {
    contractors: normalizedContractors,
    totals: {
      totalContractorExpenses: Number(totalContractorExpenses.toFixed(2)),
      totalCommission: Number(totalCommission.toFixed(2)),
      extraCharge: Number(extra.toFixed(2)),
      clientTotal: Number(clientTotal.toFixed(2)),
      taxAmount: Number(taxAmount.toFixed(2)),
      netProfit: Number(netProfit.toFixed(2))
    }
  };
}

module.exports = {
  calculateOrderTotals
};