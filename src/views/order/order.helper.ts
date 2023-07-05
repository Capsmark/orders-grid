export function generateBoundaries(
  quantity?: number,
  upper?: number,
  lower?: number,
): number[] {
  if (!quantity || !upper || lower === null || lower === undefined) {
    return [];
  }

  if (quantity < 0 || upper < 0 || lower < 0) {
    return [];
  }

  if (quantity === 1) {
    return [upper ?? lower ?? 0];
  }

  const boundaries: number[] = [];

  const step = (upper - lower) / (quantity - 1);

  for (let i = 0; i < quantity; i++) {
    const boundary = lower + step * i;
    boundaries.push(+boundary.toFixed(4));
  }

  return boundaries;
}

export function calculateAverage(amount: number, boundaries: number[]) {
  let totalQ = 0;
  boundaries.forEach((b) => {
    totalQ = totalQ + amount / boundaries.length / b;
  });

  return amount / totalQ;
}

export const calculatePercent = (value: number, boundary: number, isSell: boolean) => {
  return `${((value - boundary) / boundary) * 100 * (isSell ? -1 : 1)}%`;
};

export const calculateProfitValue = (percentage: number, boundary: number) =>
  (boundary * (percentage + 100)) / 100;

export const calculateLossValue = (percentage: number, boundary: number) =>
  (boundary * (100 - percentage)) / 100;
