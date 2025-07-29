export function getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
}

export function isNumeric(str: string) {
    if (typeof str != "string") return false // we only process strings!
    str = str.replace("{,}", ".").replace(",", ".");
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

export function parseNumber(str: string) {
    if (!isNumeric(str)) {
        return null;
    }
    str = str.replace("{,}", ".").replace(",", ".");
    if (str.contains(".")) {
        return parseFloat(str);
    } else {
        return parseInt(str);
    }
}

export function toLatexNumber(value: number, decimalSymbol: string = '{,}'): string {
  const valueStr = value.toString();

  // If it's an integer, return directly
  if (Number.isInteger(value)) {
    return value.toString();
  }

  const [, decimalPart] = valueStr.split('.');

  // Detect repeating decimal pattern
  const repeatingPattern = findRepeatingPattern(decimalPart);
  if (repeatingPattern) {
    return `${Math.floor(value)}${decimalSymbol}${repeatingPattern.repeat(2)}\\ldots`;
  }

  // Round to 6 decimal places
  const rounded = value.toFixed(6);
  const [intPart, decPart] = rounded.split('.');

  const originalDecimalDigits = decimalPart.length;
  const trimmedDecimals = decPart.replace(/0+$/, '');
  const needsEllipsis = originalDecimalDigits > 6;

  return `${intPart}${decimalSymbol}${trimmedDecimals}${needsEllipsis ? '\\ldots' : ''}`;
}

// Helper: Detects repeating sequence in decimal digits
function findRepeatingPattern(decimal: string): string | null {
  const maxPatternLength = Math.floor(decimal.length / 2);

  for (let len = 1; len <= maxPatternLength; len++) {
    const pattern = decimal.slice(0, len);
    const repeated = pattern.repeat(Math.ceil(decimal.length / len));
    if (decimal.startsWith(repeated.slice(0, decimal.length))) {
      return pattern;
    }
  }

  return null;
}
