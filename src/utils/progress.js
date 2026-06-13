const KEY = 'idiom-app-progress';

export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return initProgress();
}

export function saveProgress(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function initProgress() {
  return { levelGroups: { 0: { subLevels: {}, unlocked: true } }, totalStars: 0 };
}

export function resetProgress() {
  localStorage.removeItem(KEY);
  return initProgress();
}

export function updateSubLevel(progress, groupIdx, subIdx, stars) {
  const p = JSON.parse(JSON.stringify(progress));
  if (!p.levelGroups[groupIdx]) {
    p.levelGroups[groupIdx] = { subLevels: {}, unlocked: false };
  }
  const prev = p.levelGroups[groupIdx].subLevels[subIdx];
  const prevStars = prev?.stars || 0;
  p.levelGroups[groupIdx].subLevels[subIdx] = {
    completed: true,
    stars: Math.max(stars, prevStars),
  };
  // unlock next group when sub-level 0 of current done
  if (subIdx === 0) {
    const nextIdx = groupIdx + 1;
    if (!p.levelGroups[nextIdx]) {
      p.levelGroups[nextIdx] = { subLevels: {}, unlocked: true };
    } else {
      p.levelGroups[nextIdx].unlocked = true;
    }
  }
  // recalc total stars
  let total = 0;
  Object.values(p.levelGroups).forEach(g => {
    Object.values(g.subLevels).forEach(s => { total += s.stars || 0; });
  });
  p.totalStars = total;
  return p;
}
