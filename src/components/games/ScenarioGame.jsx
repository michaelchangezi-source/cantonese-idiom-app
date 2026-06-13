import { useState, useMemo } from 'react';
import { getDistractors } from '../../utils/groupIdioms';

function buildQuestion(idiom) {
  const blanked = idiom.example.replace(idiom.char, '＿'.repeat(idiom.char.length));
  const distractors = getDistractors(idiom, 3);
  const options = [idiom, ...distractors].sort(() => Math.random() - 0.5);
  return { idiom, blanked, options };
}

export default function ScenarioGame({ idioms, onFinish, onBack }) {
  const questions = useMemo(() => idioms.map(buildQuestion), [idioms]);
  const [current, setCurrent] = useState(0);
  const [answered, setAnswered] = useState(null);
  const [correct, setCorrect] = useState(0);

  const q = questions[current];

  function answer(option) {
    if (answered !== null) return;
    setAnswered(option);
    if (option.id === q.idiom.id) setCorrect(c => c + 1);
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

  function optionClass(option) {
    if (answered === null) return 'bg-white border-stone-200 hover:border-amber-400 hover:bg-amber-50';
    if (option.id === q.idiom.id) return 'bg-green-100 border-green-400 text-green-800';
    if (option.id === answered?.id) return 'bg-red-100 border-red-400 text-red-800';
    return 'bg-white border-stone-200 opacity-60';
  }

  return (
    <div className="max-w-md mx-auto px-4 pb-10">
      <div className="flex items-center gap-3 py-4">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-stone-200 text-stone-500">←</button>
        <div>
          <h1 className="text-lg font-bold text-stone-800">情景選擇</h1>
          <p className="text-xs text-stone-400">選擇正確成語</p>
        </div>
        <div className="ml-auto text-sm text-stone-500">{current + 1}/{questions.length}</div>
      </div>

      <div className="h-2 bg-stone-100 rounded-full mb-6">
        <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${(current / questions.length) * 100}%` }} />
      </div>

      <div className="bg-white rounded-2xl shadow p-5 mb-6 border border-stone-200">
        <p className="text-xs text-stone-400 mb-2">選出合適的成語填入空格：</p>
        <p className="text-lg text-stone-800 leading-relaxed">{q.blanked}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {q.options.map(option => (
          <button
            key={option.id}
            onClick={() => answer(option)}
            className={`py-3 px-2 text-xl font-bold rounded-xl border-2 transition-all active:scale-95 ${optionClass(option)}`}
          >
            {option.char}
          </button>
        ))}
      </div>

      {answered !== null && (
        <div className={`rounded-xl p-4 mb-4 ${answered.id === q.idiom.id ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <p className="font-semibold text-stone-700 mb-1">
            {answered.id === q.idiom.id ? '✅ 正確！' : `❌ 正確答案：${q.idiom.char}`}
          </p>
          <p className="text-sm text-stone-600">{q.idiom.meaning_zh}</p>
          <p className="text-xs text-stone-400">{q.idiom.meaning_en}</p>
        </div>
      )}

      {answered !== null && (
        <button onClick={next} className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-white font-bold rounded-xl transition-colors">
          {current + 1 >= questions.length ? '查看結果' : '下一題'}
        </button>
      )}
    </div>
  );
}
