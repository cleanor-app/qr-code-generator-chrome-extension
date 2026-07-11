// Vendored from cleanor-web src/lib/browser-qr-tools.ts — dependency-free QR encoder (ISO/IEC 18004).
// Same algorithm that powers cleanor.app/tools/qr-code-generator. Do not edit by hand; re-transpile to update.
const ECC_ORDER = ["L", "M", "Q", "H"];
const ECC_FORMAT_BITS = { L: 1, M: 0, Q: 3, H: 2 };
const ECC_CODEWORDS_PER_BLOCK = {
  L: [
    -1,
    7,
    10,
    15,
    20,
    26,
    18,
    20,
    24,
    30,
    18,
    20,
    24,
    26,
    30,
    22,
    24,
    28,
    30,
    28,
    28,
    28,
    28,
    30,
    30,
    26,
    28,
    30,
    30,
    30,
    30,
    30,
    30,
    30,
    30,
    30,
    30,
    30,
    30,
    30,
    30
  ],
  M: [
    -1,
    10,
    16,
    26,
    18,
    24,
    16,
    18,
    22,
    22,
    26,
    30,
    22,
    22,
    24,
    24,
    28,
    28,
    26,
    26,
    26,
    26,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28
  ],
  Q: [
    -1,
    13,
    22,
    18,
    26,
    18,
    24,
    18,
    22,
    20,
    24,
    28,
    26,
    24,
    20,
    30,
    24,
    28,
    28,
    26,
    30,
    28,
    30,
    30,
    30,
    30,
    28,
    30,
    30,
    30,
    30,
    30,
    30,
    30,
    30,
    30,
    30,
    30,
    30,
    30,
    30
  ],
  H: [
    -1,
    17,
    28,
    22,
    16,
    22,
    28,
    26,
    26,
    24,
    28,
    24,
    28,
    22,
    24,
    24,
    30,
    28,
    28,
    26,
    28,
    30,
    24,
    30,
    30,
    30,
    30,
    30,
    30,
    30,
    30,
    30,
    30,
    30,
    30,
    30,
    30,
    30,
    30,
    30,
    30
  ]
};
const NUM_ERROR_CORRECTION_BLOCKS = {
  L: [
    -1,
    1,
    1,
    1,
    1,
    1,
    2,
    2,
    2,
    2,
    4,
    4,
    4,
    4,
    4,
    6,
    6,
    6,
    6,
    7,
    8,
    8,
    9,
    9,
    10,
    12,
    12,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    19,
    20,
    21,
    22,
    24,
    25
  ],
  M: [
    -1,
    1,
    1,
    1,
    2,
    2,
    4,
    4,
    4,
    5,
    5,
    5,
    8,
    9,
    9,
    10,
    10,
    11,
    13,
    14,
    16,
    17,
    17,
    18,
    20,
    21,
    23,
    25,
    26,
    28,
    29,
    31,
    33,
    35,
    37,
    38,
    40,
    43,
    45,
    47,
    49
  ],
  Q: [
    -1,
    1,
    1,
    2,
    2,
    4,
    4,
    6,
    6,
    8,
    8,
    8,
    10,
    12,
    16,
    12,
    17,
    16,
    18,
    21,
    20,
    23,
    23,
    25,
    27,
    29,
    34,
    34,
    35,
    38,
    40,
    43,
    45,
    48,
    51,
    53,
    56,
    59,
    62,
    65,
    68
  ],
  H: [
    -1,
    1,
    1,
    2,
    4,
    4,
    4,
    5,
    6,
    8,
    8,
    11,
    11,
    16,
    16,
    18,
    16,
    19,
    21,
    25,
    25,
    25,
    34,
    30,
    32,
    35,
    37,
    40,
    42,
    45,
    48,
    51,
    54,
    57,
    60,
    63,
    66,
    70,
    74,
    77,
    81
  ]
};
const PENALTY_N1 = 3;
const PENALTY_N2 = 3;
const PENALTY_N3 = 40;
const PENALTY_N4 = 10;
function getBit(value, index) {
  return (value >>> index & 1) !== 0;
}
function gfMultiply(x, y) {
  let z = 0;
  for (let i = 7; i >= 0; i--) {
    z = z << 1 ^ (z >>> 7) * 285;
    z ^= (y >>> i & 1) * x;
  }
  return z & 255;
}
function reedSolomonComputeDivisor(degree) {
  const result = new Array(degree).fill(0);
  result[degree - 1] = 1;
  let root = 1;
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < result.length; j++) {
      result[j] = gfMultiply(result[j], root);
      if (j + 1 < result.length) {
        result[j] ^= result[j + 1];
      }
    }
    root = gfMultiply(root, 2);
  }
  return result;
}
function reedSolomonComputeRemainder(data, divisor) {
  const result = new Array(divisor.length).fill(0);
  for (const b of data) {
    const factor = b ^ result.shift();
    result.push(0);
    for (let i = 0; i < result.length; i++) {
      result[i] ^= gfMultiply(divisor[i], factor);
    }
  }
  return result;
}
function getNumRawDataModules(version) {
  const size = version * 4 + 17;
  let result = size * size;
  result -= 8 * 8 * 3;
  result -= 15 * 2 + 1;
  result -= (size - 16) * 2;
  if (version >= 2) {
    const numAlign = Math.floor(version / 7) + 2;
    result -= (numAlign - 1) * (numAlign - 1) * 25;
    result -= (numAlign - 2) * 2 * 20;
    if (version >= 7) {
      result -= 6 * 3 * 2;
    }
  }
  return result;
}
function getNumDataCodewords(version, ecc) {
  return Math.floor(getNumRawDataModules(version) / 8) - ECC_CODEWORDS_PER_BLOCK[ecc][version] * NUM_ERROR_CORRECTION_BLOCKS[ecc][version];
}
function getAlignmentPatternPositions(version) {
  if (version === 1) {
    return [];
  }
  const size = version * 4 + 17;
  const numAlign = Math.floor(version / 7) + 2;
  const step = version === 32 ? 26 : Math.floor((version * 4 + numAlign * 2 + 1) / (numAlign * 2 - 2)) * 2;
  const result = new Array(numAlign);
  result[0] = 6;
  for (let i = result.length - 1, pos = size - 7; i >= 1; i--, pos -= step) {
    result[i] = pos;
  }
  return result;
}
function appendBits(bb, value, length) {
  for (let i = length - 1; i >= 0; i--) {
    bb.push(value >>> i & 1);
  }
}
function utf8Bytes(text) {
  if (typeof TextEncoder !== "undefined") {
    return Array.from(new TextEncoder().encode(text));
  }
  const bytes = [];
  for (let i = 0; i < text.length; i++) {
    let code = text.charCodeAt(i);
    if (code >= 55296 && code <= 56319 && i + 1 < text.length) {
      const next = text.charCodeAt(i + 1);
      if (next >= 56320 && next <= 57343) {
        code = 65536 + (code - 55296 << 10) + (next - 56320);
        i++;
      }
    }
    if (code < 128) {
      bytes.push(code);
    } else if (code < 2048) {
      bytes.push(192 | code >> 6, 128 | code & 63);
    } else if (code < 65536) {
      bytes.push(224 | code >> 12, 128 | code >> 6 & 63, 128 | code & 63);
    } else {
      bytes.push(
        240 | code >> 18,
        128 | code >> 12 & 63,
        128 | code >> 6 & 63,
        128 | code & 63
      );
    }
  }
  return bytes;
}
function addEccAndInterleave(data, version, ecc) {
  const numBlocks = NUM_ERROR_CORRECTION_BLOCKS[ecc][version];
  const blockEccLen = ECC_CODEWORDS_PER_BLOCK[ecc][version];
  const rawCodewords = Math.floor(getNumRawDataModules(version) / 8);
  const numShortBlocks = numBlocks - rawCodewords % numBlocks;
  const shortBlockLen = Math.floor(rawCodewords / numBlocks);
  const blocks = [];
  const rsDiv = reedSolomonComputeDivisor(blockEccLen);
  let k = 0;
  for (let i = 0; i < numBlocks; i++) {
    const datLen = shortBlockLen - blockEccLen + (i < numShortBlocks ? 0 : 1);
    const dat = data.slice(k, k + datLen);
    k += datLen;
    const ecOfBlock = reedSolomonComputeRemainder(dat, rsDiv);
    if (i < numShortBlocks) {
      dat.push(0);
    }
    blocks.push(dat.concat(ecOfBlock));
  }
  const result = [];
  const maxLen = blocks[blocks.length - 1].length;
  for (let i = 0; i < maxLen; i++) {
    for (let j = 0; j < blocks.length; j++) {
      if (i !== shortBlockLen - blockEccLen || j >= numShortBlocks) {
        result.push(blocks[j][i]);
      }
    }
  }
  return result;
}
function createGrid(version) {
  const size = version * 4 + 17;
  const modules = [];
  const isFunction = [];
  for (let y = 0; y < size; y++) {
    modules.push(new Array(size).fill(false));
    isFunction.push(new Array(size).fill(false));
  }
  return { size, modules, isFunction };
}
function setFunctionModule(grid, x, y, isDark) {
  grid.modules[y][x] = isDark;
  grid.isFunction[y][x] = true;
}
function drawFinderPattern(grid, x, y) {
  for (let dy = -4; dy <= 4; dy++) {
    for (let dx = -4; dx <= 4; dx++) {
      const dist = Math.max(Math.abs(dx), Math.abs(dy));
      const xx = x + dx;
      const yy = y + dy;
      if (xx >= 0 && xx < grid.size && yy >= 0 && yy < grid.size) {
        setFunctionModule(grid, xx, yy, dist !== 2 && dist !== 4);
      }
    }
  }
}
function drawAlignmentPattern(grid, x, y) {
  for (let dy = -2; dy <= 2; dy++) {
    for (let dx = -2; dx <= 2; dx++) {
      setFunctionModule(grid, x + dx, y + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
    }
  }
}
function drawFormatBits(grid, ecc, mask) {
  const data = ECC_FORMAT_BITS[ecc] << 3 | mask;
  let rem = data;
  for (let i = 0; i < 10; i++) {
    rem = rem << 1 ^ (rem >>> 9) * 1335;
  }
  const bits = (data << 10 | rem) ^ 21522;
  const size = grid.size;
  for (let i = 0; i <= 5; i++) {
    setFunctionModule(grid, 8, i, getBit(bits, i));
  }
  setFunctionModule(grid, 8, 7, getBit(bits, 6));
  setFunctionModule(grid, 8, 8, getBit(bits, 7));
  setFunctionModule(grid, 7, 8, getBit(bits, 8));
  for (let i = 9; i < 15; i++) {
    setFunctionModule(grid, 14 - i, 8, getBit(bits, i));
  }
  for (let i = 0; i < 8; i++) {
    setFunctionModule(grid, size - 1 - i, 8, getBit(bits, i));
  }
  for (let i = 8; i < 15; i++) {
    setFunctionModule(grid, 8, size - 15 + i, getBit(bits, i));
  }
  setFunctionModule(grid, 8, size - 8, true);
}
function drawVersion(grid, version) {
  if (version < 7) {
    return;
  }
  let rem = version;
  for (let i = 0; i < 12; i++) {
    rem = rem << 1 ^ (rem >>> 11) * 7973;
  }
  const bits = version << 12 | rem;
  const size = grid.size;
  for (let i = 0; i < 18; i++) {
    const bit = getBit(bits, i);
    const a = size - 11 + i % 3;
    const b = Math.floor(i / 3);
    setFunctionModule(grid, a, b, bit);
    setFunctionModule(grid, b, a, bit);
  }
}
function drawFunctionPatterns(grid, version, ecc) {
  const size = grid.size;
  for (let i = 0; i < size; i++) {
    setFunctionModule(grid, 6, i, i % 2 === 0);
    setFunctionModule(grid, i, 6, i % 2 === 0);
  }
  drawFinderPattern(grid, 3, 3);
  drawFinderPattern(grid, size - 4, 3);
  drawFinderPattern(grid, 3, size - 4);
  const alignPos = getAlignmentPatternPositions(version);
  const numAlign = alignPos.length;
  for (let i = 0; i < numAlign; i++) {
    for (let j = 0; j < numAlign; j++) {
      const skip = i === 0 && j === 0 || i === 0 && j === numAlign - 1 || i === numAlign - 1 && j === 0;
      if (!skip) {
        drawAlignmentPattern(grid, alignPos[i], alignPos[j]);
      }
    }
  }
  drawFormatBits(grid, ecc, 0);
  drawVersion(grid, version);
}
function drawCodewords(grid, data) {
  const size = grid.size;
  let i = 0;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) {
      right = 5;
    }
    for (let vert = 0; vert < size; vert++) {
      for (let j = 0; j < 2; j++) {
        const x = right - j;
        const upward = (right + 1 & 2) === 0;
        const y = upward ? size - 1 - vert : vert;
        if (!grid.isFunction[y][x] && i < data.length * 8) {
          grid.modules[y][x] = getBit(data[i >>> 3], 7 - (i & 7));
          i++;
        }
      }
    }
  }
}
function maskCondition(mask, x, y) {
  switch (mask) {
    case 0:
      return (x + y) % 2 === 0;
    case 1:
      return y % 2 === 0;
    case 2:
      return x % 3 === 0;
    case 3:
      return (x + y) % 3 === 0;
    case 4:
      return (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0;
    case 5:
      return x * y % 2 + x * y % 3 === 0;
    case 6:
      return (x * y % 2 + x * y % 3) % 2 === 0;
    case 7:
      return ((x + y) % 2 + x * y % 3) % 2 === 0;
    default:
      return false;
  }
}
function applyMask(grid, mask) {
  for (let y = 0; y < grid.size; y++) {
    for (let x = 0; x < grid.size; x++) {
      if (!grid.isFunction[y][x] && maskCondition(mask, x, y)) {
        grid.modules[y][x] = !grid.modules[y][x];
      }
    }
  }
}
function finderPenaltyAddHistory(grid, currentRunLength, runHistory) {
  let run = currentRunLength;
  if (runHistory[0] === 0) {
    run += grid.size;
  }
  for (let i = 6; i >= 1; i--) {
    runHistory[i] = runHistory[i - 1];
  }
  runHistory[0] = run;
}
function finderPenaltyCountPatterns(runHistory) {
  const n = runHistory[1];
  const core = n > 0 && runHistory[2] === n && runHistory[3] === n * 3 && runHistory[4] === n && runHistory[5] === n;
  return (core && runHistory[0] >= n * 4 && runHistory[6] >= n ? 1 : 0) + (core && runHistory[6] >= n * 4 && runHistory[0] >= n ? 1 : 0);
}
function finderPenaltyTerminateAndCount(grid, currentRunColor, currentRunLengthInput, runHistory) {
  let currentRunLength = currentRunLengthInput;
  if (currentRunColor) {
    finderPenaltyAddHistory(grid, currentRunLength, runHistory);
    currentRunLength = 0;
  }
  currentRunLength += grid.size;
  finderPenaltyAddHistory(grid, currentRunLength, runHistory);
  return finderPenaltyCountPatterns(runHistory);
}
function computePenaltyScore(grid) {
  const size = grid.size;
  const modules = grid.modules;
  let result = 0;
  for (let y = 0; y < size; y++) {
    let runColor = false;
    let runX = 0;
    const runHistory = [0, 0, 0, 0, 0, 0, 0];
    for (let x = 0; x < size; x++) {
      if (modules[y][x] === runColor) {
        runX++;
        if (runX === 5) {
          result += PENALTY_N1;
        } else if (runX > 5) {
          result++;
        }
      } else {
        finderPenaltyAddHistory(grid, runX, runHistory);
        if (!runColor) {
          result += finderPenaltyCountPatterns(runHistory) * PENALTY_N3;
        }
        runColor = modules[y][x];
        runX = 1;
      }
    }
    result += finderPenaltyTerminateAndCount(grid, runColor, runX, runHistory) * PENALTY_N3;
  }
  for (let x = 0; x < size; x++) {
    let runColor = false;
    let runY = 0;
    const runHistory = [0, 0, 0, 0, 0, 0, 0];
    for (let y = 0; y < size; y++) {
      if (modules[y][x] === runColor) {
        runY++;
        if (runY === 5) {
          result += PENALTY_N1;
        } else if (runY > 5) {
          result++;
        }
      } else {
        finderPenaltyAddHistory(grid, runY, runHistory);
        if (!runColor) {
          result += finderPenaltyCountPatterns(runHistory) * PENALTY_N3;
        }
        runColor = modules[y][x];
        runY = 1;
      }
    }
    result += finderPenaltyTerminateAndCount(grid, runColor, runY, runHistory) * PENALTY_N3;
  }
  for (let y = 0; y < size - 1; y++) {
    for (let x = 0; x < size - 1; x++) {
      const color = modules[y][x];
      if (color === modules[y][x + 1] && color === modules[y + 1][x] && color === modules[y + 1][x + 1]) {
        result += PENALTY_N2;
      }
    }
  }
  let dark = 0;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (modules[y][x]) {
        dark++;
      }
    }
  }
  const total = size * size;
  const kBalance = Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1;
  result += kBalance * PENALTY_N4;
  return result;
}
function encodeQr(text, ecc) {
  const bytes = utf8Bytes(text);
  let version = 1;
  for (; version <= 40; version++) {
    const capacityBits = getNumDataCodewords(version, ecc) * 8;
    const ccBits = version <= 9 ? 8 : 16;
    const usedBits = 4 + ccBits + bytes.length * 8;
    if (usedBits <= capacityBits) {
      break;
    }
  }
  if (version > 40) {
    throw new Error("This text is too long for a QR code. Shorten it and try again.");
  }
  const bb = [];
  appendBits(bb, 4, 4);
  appendBits(bb, bytes.length, version <= 9 ? 8 : 16);
  for (const b of bytes) {
    appendBits(bb, b, 8);
  }
  const dataCapacityBits = getNumDataCodewords(version, ecc) * 8;
  appendBits(bb, 0, Math.min(4, dataCapacityBits - bb.length));
  appendBits(bb, 0, (8 - bb.length % 8) % 8);
  for (let pad = 236; bb.length < dataCapacityBits; pad ^= 236 ^ 17) {
    appendBits(bb, pad, 8);
  }
  const dataCodewords = new Array(bb.length >>> 3).fill(0);
  for (let i = 0; i < bb.length; i++) {
    dataCodewords[i >>> 3] |= bb[i] << 7 - (i & 7);
  }
  const allCodewords = addEccAndInterleave(dataCodewords, version, ecc);
  const grid = createGrid(version);
  drawFunctionPatterns(grid, version, ecc);
  drawCodewords(grid, allCodewords);
  let bestMask = 0;
  let minPenalty = Number.MAX_SAFE_INTEGER;
  for (let mask = 0; mask < 8; mask++) {
    applyMask(grid, mask);
    drawFormatBits(grid, ecc, mask);
    const penalty = computePenaltyScore(grid);
    if (penalty < minPenalty) {
      minPenalty = penalty;
      bestMask = mask;
    }
    applyMask(grid, mask);
  }
  applyMask(grid, bestMask);
  drawFormatBits(grid, ecc, bestMask);
  return {
    modules: grid.modules,
    size: grid.size,
    version,
    ecc,
    mask: bestMask
  };
}
function qrToSvg(result, options) {
  const border = Math.max(0, options.margin ?? 4);
  const dark = options.dark ?? "#000000";
  const light = options.light ?? "#ffffff";
  const dimension = result.size + border * 2;
  const parts = [];
  for (let y = 0; y < result.size; y++) {
    for (let x = 0; x < result.size; x++) {
      if (result.modules[y][x]) {
        parts.push(`M${x + border},${y + border}h1v1h-1z`);
      }
    }
  }
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${options.size}" height="${options.size}" `,
    `viewBox="0 0 ${dimension} ${dimension}" shape-rendering="crispEdges">`,
    `<rect width="${dimension}" height="${dimension}" fill="${light}"/>`,
    `<path d="${parts.join("")}" fill="${dark}"/>`,
    `</svg>`
  ].join("");
}
function verifyQrEncoder() {
  const cases = [
    { text: "HELLO WORLD", ecc: "M", expectVersion: 1 },
    { text: "https://cleanor.app", ecc: "M" },
    { text: "A".repeat(120), ecc: "H" },
    { text: "The quick brown fox jumps over the lazy dog. 0123456789", ecc: "Q" }
  ];
  for (const testCase of cases) {
    const result = encodeQr(testCase.text, testCase.ecc);
    if (result.size !== result.version * 4 + 17) {
      return false;
    }
    if (result.modules.length !== result.size || result.modules[0].length !== result.size) {
      return false;
    }
    if (typeof testCase.expectVersion === "number" && result.version !== testCase.expectVersion) {
      return false;
    }
  }
  return true;
}
const QR_ECC_OPTIONS = ECC_ORDER.map((value) => ({
  value,
  label: value === "L" ? "Low (7%)" : value === "M" ? "Medium (15%)" : value === "Q" ? "Quartile (25%)" : "High (30%)"
}));
export {
  QR_ECC_OPTIONS,
  encodeQr,
  qrToSvg,
  verifyQrEncoder
};
