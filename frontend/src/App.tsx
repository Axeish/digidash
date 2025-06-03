import { useState, useEffect } from 'react';

function App() {
  const [timeLeft, setTimeLeft] = useState(30);        // Countdown timer
  const [gameStarted, setGameStarted] = useState(false); // Is game running?
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

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


  useEffect(() => {
    let scoringInterval: NodeJS.Timeout;

    if (gameStarted) {
      scoringInterval = setInterval(() => {
        setScore((s) => s + 10); // increase fake score
      }, 2000);
    }

    return () => clearInterval(scoringInterval);
  }, [gameStarted]);

  const startGame = () => {
    setTimeLeft(30);
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>🎯 DigitDash</h1>

      <button onClick={startGame} disabled={gameStarted}>
        {gameStarted ? 'Game Running...' : 'Start Game'}
      </button>

      {gameStarted && (
        <>
          <h2>⏱ Time Left: {timeLeft}s</h2>
          <p>Score: {score}</p>
        </>
      )}

      {gameOver && (
        <div style={{ marginTop: '2rem', border: '2px solid #ccc', padding: '1rem' }}>
          <h3>🎉 Game Over!</h3>
          <p>🧮 Your Final Score: {score}</p>
        </div>
      )}
    </div>
  );
}

export default App;