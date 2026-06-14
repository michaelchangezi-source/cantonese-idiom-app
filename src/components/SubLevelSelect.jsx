import { LEVEL_GROUPS, DIFFICULTY_LABELS, DIFFICULTY_COLORS } from '../utils/groupIdioms';
import Stars from './Stars';

const SUB_NAMES = [
  '配對遊戲 Matching',
  '填字遊戲 Fill in the Blank',
  '情景選擇 Context Choice',
  '聽音選字 Listen & Choose',
];
const SUB_DESC = [
  '配對成語與意思 Match idioms to meanings',
  '填入缺少的字 Fill in the missing character',
  '選擇正確成語 Choose the correct idiom',
  '聆聽後選出成語 Listen and identify the idiom',
];
const SUB_ICONS = ['🔗', '✏️', '📖', '🔊'];

export default function SubLevelSelect({ groupIdx, progress, onStartGame, onBack }) {
  const group = LEVEL_GROUPS[groupIdx];
  const gData = progress.levelGroups[groupIdx] || { subLevels: {}, unlocked: true };

  return (
    <div className="max-w-md mx-auto px-4 pb-10">
      <div className="flex items-center gap-3 py-4">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-stone-200 text-stone-500" title="返回 Back">
          ←
        </button>
        <div>
          <h1 className="text-xl font-bold text-stone-800">關卡 Level {groupIdx + 1}</h1>
          <span className={`text-xs px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[group.difficulty]}`}>
            {DIFFICULTY_LABELS[group.difficulty]}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-4 mb-6 border border-stone-200">
        <p className="text-xs text-stone-400 mb-2">本關成語 Idioms in this level ({group.idioms.length}個)</p>
        <div className="flex flex-wrap gap-2">
          {group.idioms.map(idiom => (
            <span key={idiom.id} className="text-sm font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-lg">
              {idiom.char}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {SUB_NAMES.map((name, subIdx) => {
          const subData = gData.subLevels[subIdx];
          const locked = subIdx > 0 && !gData.subLevels[subIdx - 1]?.completed;

          return (
            <button
              key={subIdx}
              onClick={() => !locked && onStartGame(groupIdx, subIdx)}
              disabled={locked}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all active:scale-98 ${
                locked
                  ? 'bg-stone-100 border-stone-200 cursor-not-allowed opacity-60'
                  : subData?.completed
                  ? 'bg-green-50 border-green-200 hover:border-green-300 cursor-pointer'
                  : 'bg-white border-stone-200 hover:border-amber-300 shadow hover:shadow-md cursor-pointer'
              }`}
            >
              <div className="text-3xl">{locked ? '🔒' : SUB_ICONS[subIdx]}</div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-stone-700">{name}</div>
                <div className="text-xs text-stone-400">{SUB_DESC[subIdx]}</div>
              </div>
              <div className="flex flex-col items-end gap-1">
                {subData?.completed && <Stars count={subData.stars} small />}
                {!subData?.completed && !locked && (
                  <span className="text-xs text-amber-600 font-medium">開始 Start</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
