export const dollarConverter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const dollarInputConverter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export const isNumber = (number: any) =>
  number !== null && number !== undefined && !Number.isNaN(number);
