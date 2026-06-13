import { useState } from 'react';
import HomeScreen from './components/HomeScreen';
import SubLevelSelect from './components/SubLevelSelect';
import GameRouter from './components/GameRouter';
import ResultScreen from './components/ResultScreen';
import { loadProgress, saveProgress, updateSubLevel, resetProgress } from './utils/progress';
import { LEVEL_GROUPS } from './utils/groupIdioms';

export default function App() {
  const [screen, setScreen] = useState('home');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [progress, setProgress] = useState(() => loadProgress());

  function goHome() { setScreen('home'); }

  function openGroup(groupIdx) {
    setSelectedGroup(groupIdx);
    setScreen('sublevel');
  }

  function startGame(groupIdx, subIdx) {
    setSelectedGroup(groupIdx);
    setSelectedSub(subIdx);
    setScreen('game');
  }

  function finishGame(stars, score, total) {
    const newProgress = updateSubLevel(progress, selectedGroup, selectedSub, stars);
    setProgress(newProgress);
    saveProgress(newProgress);
    setLastResult({ stars, score, total, groupIdx: selectedGroup, subIdx: selectedSub });
    setScreen('result');
  }

  function handleReset() {
    if (confirm('確定要重置所有進度嗎？此操作不可撤銷。')) {
      const p = resetProgress();
      setProgress(p);
      saveProgress(p);
      goHome();
    }
  }

  const totalGroups = LEVEL_GROUPS.length;
  const completedGroups = Object.values(progress.levelGroups).filter(
    g => g.subLevels[0]?.completed
  ).length;

  return (
    <div className="min-h-screen bg-stone-50">
      {screen === 'home' && (
        <HomeScreen
          progress={progress}
          totalGroups={totalGroups}
          completedGroups={completedGroups}
          onSelectGroup={openGroup}
          onReset={handleReset}
        />
      )}
      {screen === 'sublevel' && selectedGroup !== null && (
        <SubLevelSelect
          groupIdx={selectedGroup}
          progress={progress}
          onStartGame={startGame}
          onBack={goHome}
        />
      )}
      {screen === 'game' && selectedGroup !== null && selectedSub !== null && (
        <GameRouter
          groupIdx={selectedGroup}
          subIdx={selectedSub}
          onFinish={finishGame}
          onBack={() => setScreen('sublevel')}
        />
      )}
      {screen === 'result' && lastResult && (
        <ResultScreen
          result={lastResult}
          onReplay={() => startGame(lastResult.groupIdx, lastResult.subIdx)}
          onNext={() => {
            const nextSub = lastResult.subIdx + 1;
            if (nextSub < 4) {
              startGame(lastResult.groupIdx, nextSub);
            } else {
              openGroup(lastResult.groupIdx);
            }
          }}
          onHome={goHome}
          groupIdioms={LEVEL_GROUPS[lastResult.groupIdx]?.idioms || []}
        />
      )}
    </div>
  );
}
