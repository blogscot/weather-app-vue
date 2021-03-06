export function toFahrenheit(temp) {
  return (temp * 9) / 5 + 32;
}

export function toCelcius(temp) {
  return ((temp - 32) * 5) / 9;
}

export function fromKelvin(temp) {
  return (temp - 273.15).toFixed(1);
}

/**
 *  Pauses for dramatic effect.
 */
export async function delay(amount) {
  return new Promise(resolve => setTimeout(() => resolve(), amount));
}

/**
 *  Gets the width and height of the window.
 */
export const getDimensions = () => {
  const { width, height } = window.screen;
  // Allow for user to rotate device
  return width > height
    ? { width: width, height: width }
    : { width: height, height: height };
};
