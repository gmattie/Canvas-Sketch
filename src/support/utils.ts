import { Colors } from "./constants";

/**
 * Gets a random color from the basic color constants array
 */
export const getRandomBasicColor = () =>
  Colors.BASIC[Math.floor(Math.random() * Colors.BASIC.length)];
