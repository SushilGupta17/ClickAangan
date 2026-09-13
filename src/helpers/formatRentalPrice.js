export const formatRentalPrice = price => {
  if (price === null || price === undefined || price === '') {
    return '0';
  }

  const number = Number(price);

  if (isNaN(number)) {
    return '0';
  }

  return number.toLocaleString('en-IN');
};