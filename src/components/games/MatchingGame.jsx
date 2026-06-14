import { useState, useMemo } from 'react';

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function MatchingGame({ idioms, onFinish, onBack }) {
  const rightCol = useMemo(() => shuffle(idioms), [idioms]);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matched, setMatched] = useState(new Set());
  const [mistakes, setMistakes] = useState(0);
  const [flash, setFlash] = useState(null);

  function selectLeft(idiom) {
    if (matched.has(idiom.id)) return;
    setSelectedLeft(idiom);
    if (selectedRight) checkMatch(idiom, selectedRight);
  }

  function selectRight(idiom) {
    if (matched.has(idiom.id)) return;
    setSelectedRight(idiom);
    if (selectedLeft) checkMatch(selectedLeft, idiom);
  }

  function checkMatch(left, right) {
    if (left.id === right.id) {
      const newMatched = new Set(matched);
      newMatched.add(left.id);
      setMatched(newMatched);
      setSelectedLeft(null);
      setSelectedRight(null);
      setFlash('correct');
      setTimeout(() => setFlash(null), 600);
      if (newMatched.size === idioms.length) {
        const stars = mistakes === 0 ? 3 : mistakes <= 3 ? 2 : 1;
        setTimeout(() => onFinish(stars, idioms.length - mistakes, idioms.length), 500);
      }
    } else {
      setMistakes(m => m + 1);
      setFlash('wrong');
      setTimeout(() => {
        setFlash(null);
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 700);
    }
  }

  function cardClass(idiom, side) {
    const isMatched = matched.has(idiom.id);
    const isSelected = side === 'left' ? selectedLeft?.id === idiom.id : selectedRight?.id === idiom.id;
    if (isMatched) return 'opacity-0 pointer-events-none transition-opacity duration-500';
    let base = 'p-3 rounded-xl border-2 cursor-pointer select-none transition-all active:scale-95 ';
    if (flash === 'correct' && isSelected) return base + 'bg-green-100 border-green-400 scale-95';
    if (flash === 'wrong' && isSelected) return base + 'bg-red-100 border-red-400 animate-pulse';
    if (isSelected) return base + 'bg-amber-100 border-amber-400 shadow-md';
    return base + 'bg-white border-stone-200 hover:border-amber-300 shadow-sm hover:shadow';
  }

  return (
    <div className="max-w-2xl mx-auto px-4 pb-10">
      <div className="flex items-center gap-3 py-4">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-stone-200 text-stone-500" title="返回 Back">←</button>
        <div>
          <h1 className="text-lg font-bold text-stone-800">配對遊戲 Matching</h1>
          <p className="text-xs text-stone-400">配對成語與意思 Match idioms to meanings</p>
        </div>
        <div className="ml-auto text-sm text-stone-500">
          {matched.size}/{idioms.length} 已配對 Matched · 錯誤 Errors: {mistakes}
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex-1 space-y-2">
          {idioms.map(idiom => (
            <button key={idiom.id} onClick={() => selectLeft(idiom)} className={cardClass(idiom, 'left')}>
              <div className="text-xl font-bold text-stone-800">{idiom.char}</div>
              <div className="text-xs text-stone-400 mt-0.5">{idiom.jyutping}</div>
            </button>
          ))}
        </div>

        <div className="flex-1 space-y-2">
          {rightCol.map(idiom => (
            <button key={idiom.id} onClick={() => selectRight(idiom)} className={cardClass(idiom, 'right')}>
              <div className="text-sm text-stone-700 leading-snug">{idiom.meaning_zh}</div>
              <div className="text-xs text-stone-400 mt-0.5 leading-snug">{idiom.meaning_en}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
