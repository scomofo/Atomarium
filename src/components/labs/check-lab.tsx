import { useState } from "react";
import { Bench } from "@/components/bench";
import { QUESTIONS } from "@/lib/course-data";
import { useCourse } from "@/lib/store";

export function CheckLab() {
  const recordScore = useCourse((state) => state.recordScore);
  const bestScore = useCourse((state) => state.bestScore);
  const attempts = useCourse((state) => state.attempts);
  const resetProgress = useCourse((state) => state.resetProgress);
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [picks, setPicks] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const question = QUESTIONS[step];

  function choose(index: number) {
    if (picked !== null || !question) return;
    setPicked(index);
    if (index === question.answer) setCorrect((value) => value + 1);
  }

  function next() {
    if (picked === null) return;
    const history = [...picks, picked];
    if (step + 1 >= QUESTIONS.length) {
      const score = history.reduce((sum, choice, index) => {
        return sum + (choice === QUESTIONS[index]?.answer ? 1 : 0);
      }, 0);
      setPicks(history);
      setCorrect(score);
      setDone(true);
      recordScore(score);
      return;
    }
    setPicks(history);
    setPicked(null);
    setStep((value) => value + 1);
  }

  function again() {
    setStep(0);
    setPicked(null);
    setCorrect(0);
    setPicks([]);
    setDone(false);
  }

  return (
    <Bench
      id="check"
      lede="Eight questions taken from the benches. No timer. Read the reason either way."
      notes={
        <>
          <p>
            A right answer without the mechanism is just a memory. The note under each choice is
            the part worth keeping.
          </p>
          <p className="text-fog tabular-nums">
            {attempts > 0 ? `Best so far: ${bestScore} of ${QUESTIONS.length}.` : "No score yet."}
          </p>
          <button type="button" className="btn btn-quiet" onClick={resetProgress}>
            Clear saved progress
          </button>
        </>
      }
    >
      <div className="rounded-2xl border border-line bg-panel p-4 sm:p-5">
        {done ? (
          <div>
            <p className="text-xs tracking-widest text-brass uppercase">Result</p>
            <h2 className="mt-2 text-4xl text-mist tabular-nums">
              {correct} of {QUESTIONS.length}
            </h2>
            <p className="mt-2 text-sm text-fog">
              {correct === QUESTIONS.length
                ? "Clean sweep. The benches have nothing left to hide."
                : "The misses are listed with the reason. The benches are still there if you want another look."}
            </p>
            <ul className="mt-5 space-y-4">
              {QUESTIONS.map((item, index) => {
                const choice = picks[index];
                const ok = choice === item.answer;
                return (
                  <li key={item.prompt} className="border-t border-line pt-3">
                    <p className="text-sm text-mist">{item.prompt}</p>
                    <p className={`mt-1 text-sm ${ok ? "text-brass" : "text-fog"}`}>
                      {ok ? "Right. " : `You chose “${item.choices[choice ?? 0]}”. `}
                      {item.why}
                    </p>
                  </li>
                );
              })}
            </ul>
            <button type="button" className="btn btn-brass mt-6" onClick={again}>
              Try again
            </button>
          </div>
        ) : question ? (
          <div>
            <p className="text-xs tracking-widest text-fog uppercase tabular-nums">
              {step + 1} of {QUESTIONS.length}
            </p>
            <h2 className="mt-2 text-2xl text-mist sm:text-3xl">{question.prompt}</h2>
            <div className="mt-5 grid gap-2">
              {question.choices.map((choice, index) => {
                const selected = picked === index;
                const isAnswer = picked !== null && index === question.answer;
                const wrong = selected && index !== question.answer;
                return (
                  <button
                    key={choice}
                    type="button"
                    className={`btn h-auto min-h-11 justify-start px-4 py-3 text-left ${
                      isAnswer ? "btn-brass" : ""
                    } ${wrong ? "border-fog text-fog" : ""}`}
                    onClick={() => choose(index)}
                    disabled={picked !== null && !selected && !isAnswer}
                  >
                    {choice}
                  </button>
                );
              })}
            </div>
            {picked !== null ? (
              <>
                <p className="mt-4 text-sm leading-relaxed text-mist">{question.why}</p>
                <button type="button" className="btn btn-brass mt-4" onClick={next}>
                  {step + 1 === QUESTIONS.length ? "See the result" : "Next question"}
                </button>
              </>
            ) : null}
          </div>
        ) : null}
      </div>
    </Bench>
  );
}
