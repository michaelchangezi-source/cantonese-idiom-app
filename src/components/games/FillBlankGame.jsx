import { useState, useMemo } from 'react';
import { getCharDistractors } from '../../utils/groupIdioms';

function buildQuestion(idiom) {
  const chars = idiom.char.split('');
  const blankIdx = Math.floor(Math.random() * chars.length);
  const correctChar = chars[blankIdx];
  const distractors = getCharDistractors(idiom, 3);
  const options = [correctChar, ...distractors].sort(() => Math.random() - 0.5);
  const display = chars.map((c, i) => i === blankIdx ? '＿' : c).join('');
  const jyutpingParts = idiom.jyutping.split(' ');
  const blankJyutping = jyutpingParts[blankIdx] || '';
  return { idiom, display, correctChar, options, blankJyutping };
}

export default function FillBlankGame({ idioms, onFinish, onBack }) {
  const questions = useMemo(() => idioms.map(buildQuestion), [idioms]);
  const [current, setCurrent] = useState(0);
  const [answered, setAnswered] = useState(null);
  const [correct, setCorrect] = useState(0);

  const q = questions[current];

  function answer(char) {
    if (answered !== null) return;
    const isCorrect = char === q.correctChar;
    setAnswered(char);
    if (isCorrect) setCorrect(c => c + 1);
  }

  function next() {
    if (current + 1 >= questions.length) {
      const stars = correct === idioms.length ? 3 : correct >= 6 ? 2 : 1;
      onFinish(stars, correct, idioms.length);
    } else {
      setCurrent(c => c + 1);
      setAnswered(null);
    }
  }

  function optionClass(char) {
    if (answered === null) return 'bg-white border-stone-200 hover:border-amber-400 hover:bg-amber-50';
    if (char === q.correctChar) return 'bg-green-100 border-green-400 text-green-800';
    if (char === answered) return 'bg-red-100 border-red-400 text-red-800';
    return 'bg-white border-stone-200 opacity-60';
  }

  return (
    <div className="max-w-md mx-auto px-4 pb-10">
      <div className="flex items-center gap-3 py-4">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-stone-200 text-stone-500" title="返回 Back">←</button>
        <div>
          <h1 className="text-lg font-bold text-stone-800">填字遊戲 Fill in the Blank</h1>
          <p className="text-xs text-stone-400">填入缺少的字 Fill in the missing character</p>
        </div>
        <div className="ml-auto text-sm text-stone-500">{current + 1}/{questions.length}</div>
      </div>

      <div className="h-2 bg-stone-100 rounded-full mb-6">
        <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${(current / questions.length) * 100}%` }} />
      </div>

      <div className="bg-white rounded-2xl shadow p-6 mb-6 border border-stone-200">
        <div className="text-4xl font-bold text-center text-stone-800 mb-2 tracking-widest">
          {q.display}
        </div>
        <div className="text-center text-sm text-stone-400">{q.blankJyutping && `缺少的字 Missing: ${q.blankJyutping}`}</div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {q.options.map(char => (
          <button
            key={char}
            onClick={() => answer(char)}
            className={`py-4 text-3xl font-bold rounded-xl border-2 transition-all active:scale-95 ${optionClass(char)}`}
          >
            {char}
          </button>
        ))}
      </div>

      {answered !== null && (
        <div className={`rounded-xl p-4 mb-4 ${answered === q.correctChar ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <p className="font-semibold text-stone-700 mb-1">
            {answered === q.correctChar ? '✅ 正確 Correct!' : `❌ 正確答案 Answer: ${q.correctChar}`}
          </p>
          <p className="text-sm text-stone-600">{q.idiom.char} — {q.idiom.meaning_zh}</p>
          <p className="text-xs text-stone-400">{q.idiom.meaning_en}</p>
        </div>
      )}

      {answered !== null && (
        <button
          onClick={next}
          className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-white font-bold rounded-xl transition-colors"
        >
          {current + 1 >= questions.length ? '查看結果 Results' : '下一題 Next'}
        </button>
      )}
    </div>
  );
}
