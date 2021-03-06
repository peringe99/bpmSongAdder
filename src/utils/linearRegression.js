
const sum = arr => arr.reduce((acc, val) => acc + val, 0);
const sqrSum = arr => arr.reduce((acc, val) => val * val + acc, 0);

/**
 * Find the slope (a) and y-intercept (b) of the best suited line for the passed data.
 * @param {Array} x X-data points.
 * @param {Array} y Y-data points.
 * @return {Array}  Array containing slope and y-intercept values.
 */
export const findRegressionLine = (x, y) => {
    if (x.length !== y.length) {
        throw Error('Arrays not of the same length.');
    }
    const n = x.length;
    const sumX = sum(x);
    const sumY = sum(y);
    const sumXY = x.reduce((acc, val, index) => acc + val * y[index], 0);
    const sqrSumX = sqrSum(x);
    const a = (n * sumXY - sumX * sumY) / (n * sqrSumX - sumX * sumX);
    const b = (sumY * sqrSumX - sumX * sumXY) / (n * sqrSumX - sumX * sumX);

    return [a, b];
};