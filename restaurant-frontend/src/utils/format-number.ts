export function fCurrency(number: number, locale = 'vi-VN', currency = 'VND') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
}
