import idioms from '../data/idioms.json';

const GROUP_SIZE = 8;

// Sort by difficulty then id, group into sets of 8
export function buildLevelGroups() {
  const byDiff = {};
  idioms.forEach(id => {
    if (!byDiff[id.difficulty]) byDiff[id.difficulty] = [];
    byDiff[id.difficulty].push(id);
  });

  const groups = [];
  [1, 2, 3, 4, 5].forEach(diff => {
    const list = byDiff[diff] || [];
    for (let i = 0; i < list.length; i += GROUP_SIZE) {
      groups.push({ difficulty: diff, idioms: list.slice(i, i + GROUP_SIZE) });
    }
  });
  return groups;
}

export const LEVEL_GROUPS = buildLevelGroups();

export const DIFFICULTY_LABELS = {
  1: '初級', 2: '中級', 3: '高級', 4: '進階', 5: '專家',
};

export const DIFFICULTY_COLORS = {
  1: 'bg-green-100 text-green-700',
  2: 'bg-blue-100 text-blue-700',
  3: 'bg-amber-100 text-amber-700',
  4: 'bg-orange-100 text-orange-700',
  5: 'bg-red-100 text-red-700',
};

export function getDistractors(idiom, count = 3) {
  const pool = idioms.filter(i => i.difficulty === idiom.difficulty && i.id !== idiom.id);
  const shuffled = pool.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getCharDistractors(idiom, count = 3) {
  // Pick random chars from other idioms at same difficulty
  const pool = idioms.filter(i => i.difficulty === idiom.difficulty && i.id !== idiom.id);
  const chars = new Set();
  pool.sort(() => Math.random() - 0.5).forEach(i => {
    i.char.split('').forEach(c => chars.add(c));
  });
  return [...chars].filter(c => !idiom.char.includes(c)).slice(0, count);
}
