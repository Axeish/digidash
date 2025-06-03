import { useState, useEffect } from 'react';
import './App.css';
import { useRef } from 'react';


// Define global constant here
const GAME_TIME = 30;
const HIGHSCORE_SIZE = 10;


type Question = {
  num1: number;
  num2: number;
  options: number[];
  correctAnswer: number;
};

function generateQuestion(difficulty: number): Question {
  let num1, num2;
  if (difficulty === 1) {
    num1 = Math.floor(Math.random() * 9 + 1); // 1-9
    num2 = Math.floor(Math.random() * 9 + 1);
  } else if (difficulty === 2) {
    num1 = Math.floor(Math.random() * 90 + 10); // 10-99
    num2 = Math.floor(Math.random() * 9 + 1);
  } else {
    num1 = Math.floor(Math.random() * 90 + 10);
    num2 = Math.floor(Math.random() * 90 + 10);
  }

  const correctAnswer = num1 * num2;

  const options = new Set<number>([correctAnswer]);
  while (options.size < 3) {
    const fake = correctAnswer + Math.floor(Math.random() * 21 - 10);
    if (fake > 0) options.add(fake);
  }

  return {
    num1,
    num2,
    options: Array.from(options).sort(() => Math.random() - 0.5),
    correctAnswer,
  };
}

function App() {
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState<Question | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [showRules, setShowRules] = useState(true);
  const [difficulty, setDifficulty] = useState<number | null>(null);
  const [highScores, setHighScores] = useState<number[]>(() => {
  const saved = localStorage.getItem('highScores');
  return saved ? JSON.parse(saved) : [];
});

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const timeRef = useRef(GAME_TIME); // separate from state
  const scoreRef = useRef(0);

useEffect(() => {
  if (!gameStarted) return;

  timeRef.current = GAME_TIME; // reset on start
  setTimeLeft(GAME_TIME);

  timerRef.current = setInterval(() => {
    timeRef.current -= 1;
    setTimeLeft(timeRef.current);

    if (timeRef.current === 0) {
      clearInterval(timerRef.current!);
      setGameStarted(false);
      setGameOver(true);



      const updatedScores = [...highScores, scoreRef.current]
        .sort((a, b) => b - a)
        .slice(0, HIGHSCORE_SIZE);



      setHighScores(updatedScores);
        localStorage.setItem('highScores', JSON.stringify(updatedScores));
      }

  }, 1000);

  return () => clearInterval(timerRef.current!);
}, [gameStarted]);



  const startGame = (selectedDifficulty: number) => {
    setTimeLeft(GAME_TIME);
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setGameOver(false);
    setGameStarted(true);
    setDifficulty(selectedDifficulty)
    setShowRules(false);
    setQuestion(generateQuestion(selectedDifficulty));
  };
  const playAgain = () => {
    if (difficulty !== null) {
      startGame(difficulty);
    }
  };
  const handleAnswer = (selected: number) => {
    if (!question || difficulty === null) return;
    if (selected === question.correctAnswer) {
      setScore((s) => {
    const newScore = s + 70;
    scoreRef.current = newScore;
    return newScore;
  });
      setCorrectCount((c) => c + 1);
    } else {
      setScore((s) => {
    const newScore = s - 20;
    scoreRef.current = newScore;
    return newScore;
  });
      setWrongCount((w) => w + 1);
    }
    setQuestion(generateQuestion(difficulty));
  };


  return (
<div className="main-section">
  <div className="center-box">
    <h1 className="title">🎯 DigitDash</h1>

    {!gameStarted && !gameOver && (
      <>


        <div className="difficulty-buttons">
          <button onClick={() => startGame(1)} className="easy">⭐ Start Easy</button>
          <button onClick={() => startGame(2)} className="medium">⭐⭐ Start Medium</button>
          <button onClick={() => startGame(3)} className="hard">⭐⭐⭐ Start Hard</button>
        </div>

        <div className="scoring-box">
          <h3>📊 How Scoring Works</h3>
          <ul>
            <li><strong>✅ Correct Answer:</strong> +70 points</li>
            <li><strong>❌ Wrong Answer:</strong> −20 points</li>
            <li><strong>⏱️ Time Penalty:</strong> Answer slower = more score loss</li>
            <li>
              <strong>🔥 Streak Bonus:</strong>
              <ul>
                <li>5 in a row = +50</li>
                <li>10 in a row = +150</li>
                <li>20 in a row = +400</li>
                <li>30+ in a row = +1000 🎉</li>
              </ul>
            </li>
            <li><strong>Speed Tip:</strong> Answer within 3 seconds for full points!</li>
          </ul>
        </div>
      </>
    )}

    {gameStarted && question && (
      <>
        <h2>⏱ Time Left: {timeLeft}s</h2>
        <p>📊 Score: {score}</p>

        <div className="answer-options">
          <h3>{question.num1} × {question.num2} = ?</h3>
          {question.options.map((opt, idx) => (
            <button key={idx} onClick={() => handleAnswer(opt)} className="answer-button">
              {String.fromCharCode(97 + idx)}: {opt}
            </button>
          ))}
        </div>
      </>
    )}

    {gameOver && (
      <>
        <div className="final-buttons">
  <button onClick={playAgain} className="button play-again">
    ▶️ Play Again
  </button>
  <button
    onClick={() => {
      setGameOver(false);
      setShowRules(true);
    }}
    className="button info-button"
  >
    ℹ️ Scoring Info
  </button>
</div>


        <div>
          <h2>Game Over!</h2>
          <p>Your Final Score: {score}</p>
          <p>Correct Answers: {correctCount}</p>
          <p>Wrong Answers: {wrongCount}</p>
        </div>
      </>
    )}
  </div>

{/* Leaderboard Box */}
<div className="leaderboard-box">
  <h3> Leaderboard</h3>
  <ol>
    {highScores.map((s, i) => (
      <li key={i}>{s}</li>
    ))}
  </ol><p>✨ Can you beat your best score?</p>
</div>
</div>

);

}

export default App;
