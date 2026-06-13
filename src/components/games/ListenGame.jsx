import { useState, useMemo } from 'react';
import { getDistractors } from '../../utils/groupIdioms';

function buildQuestion(idiom) {
  const distractors = getDistractors(idiom, 3);
  const options = [idiom, ...distractors].sort(() => Math.random() - 0.5);
  return { idiom, options };
}

function speak(text) {
  if (!window.speechSynthesis) return false;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = 'zh-HK';
  utt.rate = 0.85;
  window.speechSynthesis.speak(utt);
  return true;
}

export default function ListenGame({ idioms, onFinish, onBack }) {
  const questions = useMemo(() => idioms.map(buildQuestion), [idioms]);
  const [current, setCurrent] = useState(0);
  const [answered, setAnswered] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [ttsUnavailable, setTtsUnavailable] = useState(false);
  const [played, setPlayed] = useState(false);

  const q = questions[current];

  function playAudio() {
    const ok = speak(q.idiom.char);
    if (!ok) setTtsUnavailable(true);
    else setPlayed(true);
  }

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
      setPlayed(false);
    }
  }

  function optionClass(option) {
    if (answered === null) {
      return played
        ? 'bg-white border-stone-200 hover:border-amber-400 hover:bg-amber-50'
        : 'bg-stone-100 border-stone-200 cursor-not-allowed opacity-60';
    }
    if (option.id === q.idiom.id) return 'bg-green-100 border-green-400 text-green-800';
    if (option.id === answered?.id) return 'bg-red-100 border-red-400 text-red-800';
    return 'bg-white border-stone-200 opacity-60';
  }

  return (
    <div className="max-w-md mx-auto px-4 pb-10">
      <div className="flex items-center gap-3 py-4">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-stone-200 text-stone-500">←</button>
        <div>
          <h1 className="text-lg font-bold text-stone-800">聽音選字</h1>
          <p className="text-xs text-stone-400">聆聽後選出成語</p>
        </div>
        <div className="ml-auto text-sm text-stone-500">{current + 1}/{questions.length}</div>
      </div>

      <div className="h-2 bg-stone-100 rounded-full mb-6">
        <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${(current / questions.length) * 100}%` }} />
      </div>

      {ttsUnavailable ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-700">
          您的裝置不支援廣東話語音，請嘗試在 iPhone Safari 開啟
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow p-8 mb-6 border border-stone-200 text-center">
          <p className="text-xs text-stone-400 mb-4">聆聽成語，選出正確答案</p>
          <button
            onClick={playAudio}
            className="w-20 h-20 rounded-full bg-amber-400 hover:bg-amber-500 text-white text-4xl shadow-lg active:scale-95 transition-all mx-auto flex items-center justify-center"
          >
            🔊
          </button>
          <p className="text-xs text-stone-400 mt-3">點擊播放</p>
          {answered !== null && (
            <button onClick={playAudio} className="mt-2 text-xs text-amber-600 underline">重新播放</button>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-6">
        {q.options.map(option => (
          <button
            key={option.id}
            onClick={() => played && answer(option)}
            disabled={!played && answered === null}
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
          <p className="text-sm text-stone-500">{q.idiom.jyutping}</p>
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
