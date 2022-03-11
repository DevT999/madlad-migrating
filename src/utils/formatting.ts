export const formatCardNumber = (number: string | number): string => {
  const padded = number.toString().padStart(4, '0');
  return `#${padded}`;
};

export const formatNumber = (number: string | number, decimals: number) => {
  let res;
  if (typeof number === 'number') {
    res = number
      .toFixed(decimals)
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  } else {
    res = parseFloat(number)
      .toFixed(decimals)
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }
  return res;
};

export const formatAbbreviated = (num: number, decimals: number) => {
  if (num >= 1000000) {
    return `${formatNumber(Math.round(num / 10000) / 100, decimals)}M`;
  }

  if (num >= 1000) {
    return `${formatNumber(Math.round(num / 10) / 100, decimals)}K`;
  }

  return formatNumber(num, decimals);
};

export const truncate = (input: string, length: number) =>
  input.length > length ? `${input.substring(0, length)}...` : input;
