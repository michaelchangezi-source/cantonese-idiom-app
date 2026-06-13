import { useEffect, useState } from 'react';
import Stars from './Stars';

const SUB_NAMES = ['配對遊戲', '填字遊戲', '情景選擇', '聽音選字'];

export default function ResultScreen({ result, onReplay, onNext, onHome, groupIdioms }) {
  const { stars, score, total, subIdx } = result;
  const [visibleStars, setVisibleStars] = useState(0);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleStars(Math.min(i, stars));
      if (i >= stars) clearInterval(interval);
    }, 350);
    return () => clearInterval(interval);
  }, [stars]);

  return (
    <div className="max-w-md mx-auto px-4 pb-10">
      <div className="py-6 text-center">
        <p className="text-sm text-stone-400 mb-1">{SUB_NAMES[subIdx]} 完成！</p>
        <div className="flex justify-center gap-3 my-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <span
              key={i}
              className={`text-5xl transition-all duration-300 ${i < visibleStars ? 'scale-125 opacity-100' : 'opacity-20 scale-100'}`}
            >
              ⭐
            </span>
          ))}
        </div>
        <p className="text-2xl font-bold text-stone-800">{score}/{total} 正確！</p>
        <p className="text-stone-500 text-sm mt-1">
          {stars === 3 ? '完美！' : stars === 2 ? '做得好！' : '繼續努力！'}
        </p>
      </div>

      <div className="flex gap-3 mb-8">
        <button
          onClick={onReplay}
          className="flex-1 py-3 border-2 border-amber-300 text-amber-600 font-bold rounded-xl hover:bg-amber-50 transition-colors"
        >
          重玩
        </button>
        <button
          onClick={onNext}
          className="flex-1 py-3 bg-amber-400 hover:bg-amber-500 text-white font-bold rounded-xl transition-colors"
        >
          {subIdx < 3 ? '下一關' : '返回關卡'}
        </button>
      </div>

      <button onClick={onHome} className="w-full py-2 text-stone-400 text-sm hover:text-stone-600">
        返回主頁
      </button>

      {/* Review section */}
      <div className="mt-8">
        <h2 className="text-base font-bold text-stone-700 mb-3">成語複習</h2>
        <div className="space-y-2">
          {groupIdioms.map(idiom => (
            <div key={idiom.id} className="bg-white rounded-xl p-3 border border-stone-200 shadow-sm">
              <div className="flex items-baseline gap-3">
                <span className="text-xl font-bold text-amber-700">{idiom.char}</span>
                <span className="text-xs text-stone-400">{idiom.jyutping}</span>
              </div>
              <p className="text-sm text-stone-600 mt-1">{idiom.meaning_zh}</p>
              <p className="text-xs text-stone-400">{idiom.meaning_en}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
