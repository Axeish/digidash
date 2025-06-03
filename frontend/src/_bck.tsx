import { useState, useEffect } from 'react';

type Question = {
  num1: number;
  num2: number;
  options: number[];
  correctAnswer: number;
};

function generateQuestion(): Question {
  const num1 = Math.floor(Math.random() * 90 + 10);
  const num2 = Math.floor(Math.random() * 90 + 10);
  const correctAnswer = num1 * num2;

  const options = new Set<number>([correctAnswer]);
  while (options.size < 3) {
    const fake = correctAnswer + Math.floor(Math.random() * 21 - 10); // +/-10 range
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
  const [timeLeft, setTimeLeft] = useState(30);        // Countdown timer
  const [gameStarted, setGameStarted] = useState(false); // Is game running?
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState<Question | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);



  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (gameStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000); // 1 second
    }

    if (timeLeft === 0 && gameStarted) {
      setGameStarted(false);
      setGameOver(true);

    }

    return () => clearInterval(timer);
  }, [gameStarted, timeLeft]);




const startGame = () => {
    setTimeLeft(10);
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setGameOver(false);
    setGameStarted(true);
    setQuestion(generateQuestion());
  };

  const handleAnswer = (selected: number) => {
    if (!question) return;

    if (selected === question.correctAnswer) {
      setScore((s) => s + 10);
      setCorrectCount((c) => c + 1);
    } else {
      setScore((s) => s - 8);
      setWrongCount((w) => w + 1);
    }

    setQuestion(generateQuestion());
  };

  return (

    <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h1>🎯 DigitDash</h1>

      <button onClick={startGame} disabled={gameStarted}>
        {gameStarted ? 'Game Running...' : 'Start Game'}
      </button>
    <div style={{
  border: '2px solid #ccc',
  borderRadius: '10px',
  padding: '1rem',
  maxWidth: '600px',
  margin: '1rem auto',
  backgroundColor: '#191919',
  textAlign: 'left',
  fontSize: '0.95rem'
}}>
  <h3 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>📊 How Scoring Works</h3>

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



      {gameStarted && question && (
        <>
          <h2>⏱ Time Left: {timeLeft}s</h2>
          <p>📊 Score: {score}</p>

          <div style={{ marginTop: '1rem' }}>
            <h3>
              {question.num1} × {question.num2} = ?
            </h3>
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
        <div style={{ marginTop: '2rem', border: '2px solid #ccc', padding: '1rem' }}>
          <h3>🎉 Game Over!</h3>
          <p>🧮 Your Final Score: {score}</p>
           <p>✅ Correct Answers: {correctCount}</p>
          <p>❌ Wrong Answers: {wrongCount}</p>
        </div>
      )}
    </div>
  );
}

export default App;