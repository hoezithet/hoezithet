/**
 * Interpolate a regular string with the given parameters.
 *
 * The string should be formatted exactly like a template literal.
 *
 * @param {string} str The string to interpolate
 * @param {[key: string]: string} params The parameters to substitute inside the string
 */
export default (str: string, params: { [key: string]: string; }) => {
    const names = Object.keys(params);
    const vals = Object.values(params);
    return new Function(...names, `return \`${str}\`;`)(...vals);
}
