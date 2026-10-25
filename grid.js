function parseGridSize(value) {
  if (value === null || String(value).trim() === '') return null;
  const size = Number(value);
  return Number.isInteger(size) && size >= 1 && size <= 100 ? size : null;
}
function nextShade(level) {
  return Math.min(1, Math.round((Number(level) + 0.1) * 10) / 10);
}
if (typeof module !== 'undefined') module.exports = { parseGridSize, nextShade };
