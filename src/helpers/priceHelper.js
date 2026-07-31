export const formatPrice = (price) => {
  const amount = Number(price);

  if (!amount || isNaN(amount)) return '';

  if (amount >= 10000000) {
    const value = amount / 10000000;
    return `${value % 1 === 0 ? value : value.toFixed(2)} Cr`;
  }

  if (amount >= 100000) {
    const value = amount / 100000;
    return `${value % 1 === 0 ? value : value.toFixed(2)} L`;
  }

  if (amount >= 1000) {
    const value = amount / 1000;
    return `${value % 1 === 0 ? value : value.toFixed(1)} K`;
  }

  return amount.toLocaleString('en-IN');
};
