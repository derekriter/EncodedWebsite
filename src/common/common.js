/**
 * Replaces the char at the given index with replacement
 * @returns A modified string with the replacement
 */
String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}
