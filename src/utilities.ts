export default function calculatePercentageAvailable(
  totalBikesAvailable: number,
  totalBikeCapacity: number
) {
  let percentageAvailable: number;

  if (totalBikesAvailable === 0) {
    percentageAvailable = 0;
  } else {
    percentageAvailable = (totalBikesAvailable / totalBikeCapacity) * 100;
  }

  return {
    number: percentageAvailable,
    string: percentageAvailable.toFixed(2),
  };
}
