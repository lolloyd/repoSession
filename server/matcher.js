// Text normalization and fuzzy matching for rebus puzzles
function normalizeText(text) {
  if (typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/['’"“”]/g, '') // remove quotes/apostrophes: "i'll" -> "ill", "it's" -> "its"
    .replace(/[^a-z0-9\s]/g, ' ') // replace punctuation/hyphens with space
    .replace(/\s+/g, ' ')
    .trim();
}

// Convert numbers like 3, 4, 40 to words and vice-versa for alternative matching
const numberMap = {
  '3': 'three', 'three': '3',
  '4': 'four', 'four': '4',
  '40': 'forty', 'forty': '40',
  '6': 'six', 'six': '6',
  '8': 'eight', 'eight': '8'
};

function getVariants(text) {
  const norm = normalizeText(text);
  const variants = new Set([norm]);

  // Remove common articles from the beginning: "a", "an", "the"
  const withoutArticle = norm.replace(/^(the|a|an)\s+/, '');
  variants.add(withoutArticle);

  // Without spaces (e.g. "corner stone" -> "cornerstone")
  variants.add(norm.replace(/\s+/g, ''));
  variants.add(withoutArticle.replace(/\s+/g, ''));

  return Array.from(variants);
}

function calculateLevenshtein(a, b) {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function checkAnswer(guess, puzzle) {
  if (!guess || !puzzle) return { isCorrect: false, isClose: false };
  
  const guessNorm = normalizeText(guess);
  const guessVariants = getVariants(guess);

  // Build target acceptable variations
  const targetVariations = new Set();
  const allTargets = [puzzle.answer, ...(puzzle.acceptable || [])];
  
  for (const t of allTargets) {
    for (const v of getVariants(t)) {
      targetVariations.add(v);
    }
  }

  // Exact match with any variant
  for (const g of guessVariants) {
    if (targetVariations.has(g)) {
      return { isCorrect: true, isClose: false };
    }
  }

  // Check fuzzy "Close" match (e.g. 1-2 edit distance)
  let isClose = false;
  for (const target of targetVariations) {
    if (target.length >= 5) {
      const dist = calculateLevenshtein(guessNorm, target);
      if (dist <= 2 && dist > 0) {
        isClose = true;
        break;
      }
    }
  }

  return { isCorrect: false, isClose };
}

module.exports = {
  normalizeText,
  checkAnswer
};
