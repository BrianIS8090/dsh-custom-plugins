function numericVersion(value) {
  const match = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$/.exec(value);
  if (!match) throw Error(`Unsupported semantic version: ${value}`);
  return { numbers: match.slice(1, 4).map(Number), prerelease: match[4] };
}

const compare = (left, right) => {
  for (let index = 0; index < 3; index += 1) {
    if (left[index] !== right[index]) return left[index] < right[index] ? -1 : 1;
  }
  return 0;
};

export const LOCAL_VERSION = '0.5.42-ru.3';

// Preserve the verified stable range and admit exactly this local Starter.
export function localizedPeerRange(upstreamVersion, stableRange) {
  if (!satisfiesCaretRange(upstreamVersion, stableRange)) throw Error(`Pinned upstream Starter does not satisfy ${stableRange}`);
  return `${stableRange} || ${LOCAL_VERSION}`;
}

// Covers the stable caret peer ranges declared by the pinned Source packages.
export function satisfiesCaretRange(version, range) {
  const candidate = numericVersion(version);
  const match = /^\^(\d+)\.(\d+)\.(\d+)$/.exec(range);
  if (!match) throw Error(`Unsupported caret range: ${range}`);
  if (candidate.prerelease) return false;
  const lower = match.slice(1, 4).map(Number);
  const upper = lower[0] > 0 ? [lower[0] + 1, 0, 0]
    : lower[1] > 0 ? [0, lower[1] + 1, 0]
      : [0, 0, lower[2] + 1];
  return compare(candidate.numbers, lower) >= 0 && compare(candidate.numbers, upper) < 0;
}
