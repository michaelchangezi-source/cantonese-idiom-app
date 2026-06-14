import { useState } from 'react';
import { LEVEL_GROUPS, DIFFICULTY_LABELS, DIFFICULTY_COLORS } from '../utils/groupIdioms';
import Stars from './Stars';

export default function HomeScreen({ progress, totalGroups, completedGroups, onSelectGroup, onReset }) {
  const [showSettings, setShowSettings] = useState(false);
  const pct = totalGroups > 0 ? Math.round((completedGroups / totalGroups) * 100) : 0;

  return (
    <div className="max-w-2xl mx-auto px-4 pb-10">
      <div className="flex items-center justify-between py-4">
        <div>
          <h1 className="text-2xl font-bold text-amber-700">廣東話成語闖關</h1>
          <p className="text-sm text-stone-500">Cantonese Idiom Challenge</p>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-full hover:bg-stone-200 transition-colors text-stone-500"
          title="設定 Settings"
        >
          ⚙️
        </button>
      </div>

      {showSettings && (
        <div className="bg-white rounded-xl shadow p-4 mb-4 border border-stone-200">
          <h2 className="font-semibold text-stone-700 mb-3">設定 Settings</h2>
          <button
            onClick={() => { onReset(); setShowSettings(false); }}
            className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm hover:bg-red-100 transition-colors"
          >
            重置所有進度 Reset Progress
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow p-4 mb-6 border border-stone-200">
        <div className="flex justify-between text-sm text-stone-600 mb-2">
          <span>總進度 Progress</span>
          <span>{completedGroups} / {totalGroups} 關卡完成 Levels Done</span>
        </div>
        <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-400 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="text-right text-xs text-stone-400 mt-1">⭐ {progress.totalStars} 星 Stars</div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {LEVEL_GROUPS.map((group, idx) => {
          const gData = progress.levelGroups[idx];
          const unlocked = idx === 0 || gData?.unlocked;
          const subStars = gData ? Object.values(gData.subLevels).reduce((a, s) => a + (s.stars || 0), 0) : 0;
          const completedSubs = gData ? Object.values(gData.subLevels).filter(s => s.completed).length : 0;

          return (
            <button
              key={idx}
              onClick={() => unlocked && onSelectGroup(idx)}
              disabled={!unlocked}
              className={`relative rounded-xl p-3 text-center transition-all active:scale-95 ${
                unlocked
                  ? 'bg-white shadow hover:shadow-md cursor-pointer border border-stone-200 hover:border-amber-300'
                  : 'bg-stone-100 cursor-not-allowed border border-stone-200 opacity-60'
              }`}
            >
              {!unlocked && (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-stone-100/80">
                  <span className="text-2xl">🔒</span>
                </div>
              )}
              <div className="text-xs text-stone-400 mb-1">關卡 Level</div>
              <div className="text-xl font-bold text-stone-700">{idx + 1}</div>
              <div className={`text-xs px-1.5 py-0.5 rounded-full inline-block mt-1 leading-tight ${DIFFICULTY_COLORS[group.difficulty]}`}>
                {DIFFICULTY_LABELS[group.difficulty]}
              </div>
              <div className="mt-1.5">
                <Stars count={Math.round(subStars / 4)} max={3} small />
              </div>
              {completedSubs > 0 && (
                <div className="text-xs text-stone-400 mt-1">{completedSubs}/4</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
