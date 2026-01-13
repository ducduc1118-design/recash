export const formatCurrency = (value: number) => {
  const fixed = value.toFixed(2);
  return `$${fixed}`;
};
