
import { useState, useEffect, useRef } from "react";

function FocusTimer() {
  // Store the remaining time (25 minutes)
  const [timeLeft, setTimeLeft] = useState(25 * 60);

  // Check whether the timer is running
  const [isRunning, setIsRunning] = useState(false);

  // Store completed sessions
  const [sessions, setSessions] = useState(() => {
    return Number(localStorage.getItem("sessions")) || 0;
  });

  // Store the interval ID
  const intervalRef = useRef(null);

  // Control the countdown
  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((previousTime) => {
        if (previousTime <= 1) {
          setIsRunning(false);
          setSessions((previous) => previous + 1);
          return 0;
        }

        return previousTime - 1;
      });
    }, 1000);

    // Clean up the interval
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  // Save completed sessions
  useEffect(() => {
    localStorage.setItem("sessions", sessions);
  }, [sessions]);

  // Update browser tab title
  useEffect(() => {
    document.title = formatTime(timeLeft);

    return () => {
      document.title = "Focus Timer";
    };
  }, [timeLeft]);

  // Convert seconds into MM:SS
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  }

  // Start timer
  function handleStart() {
    if (timeLeft > 0) {
      setIsRunning(true);
    }
  }

  // Pause timer
  function handlePause() {
    setIsRunning(false);
  }

  // Reset timer
  function handleReset() {
    setIsRunning(false);
    setTimeLeft(25 * 60);
  }

  return (
    <div className="timer-container">
      <h1>Focus Timer</h1>

      <h2>{formatTime(timeLeft)}</h2>

      <div className="timer-buttons">
        <button onClick={handleStart}>Start</button>
        <button onClick={handlePause}>Pause</button>
        <button onClick={handleReset}>Reset</button>
      </div>

      {timeLeft === 0 && <h3>Time for a break!</h3>}

      <p>Sessions completed: {sessions}</p>
    </div>
  );
}

export default FocusTimer;
