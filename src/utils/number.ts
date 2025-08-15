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
    if (str.includes(".")) {
        return parseFloat(str);
    } else {
        return parseInt(str);
    }
}

export function intToStr(value: number|string, thousandthSep: string = ' ') {
    let strValue = value.toString();
    if (Math.abs(parseInt(strValue)) >= 10000) {
        // Space after every thousandth
        const chunkSize = 3;
        const numChunks = Math.ceil(strValue.length / chunkSize)
        const chunks = new Array(numChunks)

        for (let k = numChunks - 1, i = strValue.length - chunkSize; k >= 0; --k, i -= chunkSize) {
            const size = Math.min(chunkSize, i + chunkSize);
            i = Math.max(0, i);
            chunks[k] = strValue.substr(i, size);
        }
        strValue = chunks.join(thousandthSep);
    }

    return strValue;
}

export function toLatexNumber(value: number, decimalSymbol: string = '{,}'): string {
    const valueStr = value.toString();

    function intToLatex(value: number|string): string {
        return intToStr(value, "~");
    }

    // If it's an integer, return directly
    if (Number.isInteger(value)) {
        return intToLatex(value);
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

    return `${intToLatex(intPart)}${decimalSymbol}${trimmedDecimals}${needsEllipsis ? '\\ldots' : ''}`;
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
