export const formatPrice = (num) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(num / 100);
};

export const getUniqueValues = (data, type) => {
  let unique = data.map((item) => {
    return item[type];
  });
  return ['all', ...new Set(unique.flat())];
};
