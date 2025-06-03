import { useState, useEffect } from 'react';

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
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState<Question | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [showRules, setShowRules] = useState(true);
  const [difficulty, setDifficulty] = useState<number | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    }
    if (timeLeft === 0 && gameStarted) {
      setGameStarted(false);
      setGameOver(true);
    }
    return () => clearInterval(timer);
  }, [gameStarted, timeLeft]);

  const startGame = (selectedDifficulty: number) => {
    setTimeLeft(5);
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
      setScore((s) => s + 70);
      setCorrectCount((c) => c + 1);
    } else {
      setScore((s) => s - 20);
      setWrongCount((w) => w + 1);
    }
    setQuestion(generateQuestion(difficulty));
  };


  return (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: '1rem',
    boxSizing: 'border-box'
  }}>
    <div style={{
      border: '2px solid #ccc',
      borderRadius: '10px',
      padding: '1.5rem',
      maxWidth: '600px',
      width: '100%',
      backgroundColor: '#191919',
      color: '#fff',
      textAlign: 'center',
    }}>
      <h1 style={{ marginBottom: '1rem' }}>🎯 DigitDash</h1>

      {!gameStarted && !gameOver && (
        <>
          <button
            onClick={startGame}
            style={{
              backgroundColor: 'green',
              color: 'white',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '5px',
              fontSize: '1rem',
              marginBottom: '1.2rem',
              cursor: 'pointer'
            }}
          >
            Start Game
          </button>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
  <button onClick={() => startGame(1)} style={{ backgroundColor: 'green', color: 'white', padding: '0.5rem 1rem' }}>⭐ Start Easy</button>
  <button onClick={() => startGame(2)} style={{ backgroundColor: 'orange', color: 'white', padding: '0.5rem 1rem' }}>⭐⭐ Start Medium</button>
  <button onClick={() => startGame(3)} style={{ backgroundColor: 'red', color: 'white', padding: '0.5rem 1rem' }}>⭐⭐⭐ Start Hard</button>
</div>


          {/* Scoring Rules Box */}
          <div style={{ textAlign: 'left', fontSize: '0.95rem' }}>
            <h3 style={{ textAlign: 'center' }}>📊 How Scoring Works</h3>
            <ul style={{ listStyleType: 'square', paddingLeft: '1.2rem' }}>
              <li><strong>✅ Correct Answer:</strong> +70 points</li>
              <li><strong>❌ Wrong Answer:</strong> −20 points</li>
              <li><strong>⏱️ Time Penalty:</strong> Answer slower = more score loss</li>
              <li>
                <strong>🔥 Streak Bonus:</strong>
                <ul style={{ listStyleType: 'circle', marginTop: '0.25rem' }}>
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

          <div style={{ marginTop: '1rem' }}>
            <h3>{question.num1} × {question.num2} = ?</h3>
            {question.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(opt)}
                style={{
                  margin: '0.5rem',
                  padding: '0.75rem 1.25rem',
                  fontSize: '1rem',
                  cursor: 'pointer',
                }}
              >
                {String.fromCharCode(97 + idx)}: {opt}
              </button>
            ))}
          </div>
        </>
      )}

      {gameOver && (
        <>
          {/* Top buttons */}
          <div style={{
  display: 'flex',
  justifyContent: 'center',
  gap: '1rem',
  marginBottom: '1rem',
  flexWrap: 'wrap'
}}>
  <button
    onClick={playAgain}
    style={{
      backgroundColor: 'green',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      padding: '0.5rem 1.2rem',
      cursor: 'pointer'
    }}
  >
    ▶️ Play Again
  </button>

  <button
      onClick={() => {
    setGameOver(false);
    setShowRules(true);
  }}
    style={{
      backgroundColor: '#555',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      padding: '0.5rem 1.2rem',
      cursor: 'pointer'
    }}
  >
    ℹ️ Scoring Info
  </button>
</div>


          {/* Final Score Display */}
          <div>
            <h2> Game Over!</h2>
            <p> Your Final Score: {score}</p>
            <p> Correct Answers: {correctCount}</p>
            <p> Wrong Answers: {wrongCount}</p>
          </div>
        </>
      )}
    </div>
  </div>
);

}

export default App;
