import { LEVEL_GROUPS } from '../utils/groupIdioms';
import MatchingGame from './games/MatchingGame';
import FillBlankGame from './games/FillBlankGame';
import ScenarioGame from './games/ScenarioGame';
import ListenGame from './games/ListenGame';

const GAMES = [MatchingGame, FillBlankGame, ScenarioGame, ListenGame];

export default function GameRouter({ groupIdx, subIdx, onFinish, onBack }) {
  const group = LEVEL_GROUPS[groupIdx];
  const GameComponent = GAMES[subIdx];

  return (
    <GameComponent
      idioms={group.idioms}
      difficulty={group.difficulty}
      groupIdx={groupIdx}
      subIdx={subIdx}
      onFinish={onFinish}
      onBack={onBack}
    />
  );
}
