import React, { useState, useEffect } from "react";

const StopWatch = () => {
  const [breakLength, setBreakLength] = useState(5); // in minutes
  const [sessionLength, setSessionLength] = useState(25); // in minutes
  const [timeLeft, setTimeLeft] = useState(25 * 60); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState("Session"); // "Session" or "Break"

  // Update the timer every second if isRunning is true
  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 0) {
            document.getElementById("beep").play();
            if (currentPhase === "Session") {
              setCurrentPhase("Break");
              return breakLength * 60;
            } else {
              setCurrentPhase("Session");
              return sessionLength * 60;
            }
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, breakLength, sessionLength, currentPhase]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Handlers for incrementing/decrementing break and session lengths
  const handleBreakChange = (amount) => {
    setBreakLength((prev) => {
      const newLength = prev + amount;
      return newLength > 0 && newLength <= 60 ? newLength : prev;
    });
  };

  const handleSessionChange = (amount) => {
    setSessionLength((prev) => {
      const newLength = prev + amount;
      if (newLength > 0 && newLength <= 60) {
        setTimeLeft(newLength * 60); // Update timeLeft to reflect session changes
        return newLength;
      }
      return prev;
    });
  };

  // Reset the timer
  const handleReset = () => {
    setIsRunning(false);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setCurrentPhase("Session");
    const beepAudio = document.getElementById("beep");
    beepAudio.pause();
    beepAudio.currentTime = 0;
  };

  // Toggle timer start/stop
  const handleStartStop = () => {
    setIsRunning((prev) => !prev);
  };

  return (
    <div>
      <h1>Pomodoro Timer</h1>
      <div id="break-label">
        <h2>Break Length</h2>
        <button id="break-decrement" onClick={() => handleBreakChange(-1)}>
          -
        </button>
        <span id="break-length">{breakLength}</span>
        <button id="break-increment" onClick={() => handleBreakChange(1)}>
          +
        </button>
      </div>
      <div id="session-label">
        <h2>Session Length</h2>
        <button id="session-decrement" onClick={() => handleSessionChange(-1)}>
          -
        </button>
        <span id="session-length">{sessionLength}</span>
        <button id="session-increment" onClick={() => handleSessionChange(1)}>
          +
        </button>
      </div>
      <div id="timer">
        <h2 id="timer-label">{currentPhase}</h2>
        <span id="time-left">{formatTime(timeLeft)}</span>
      </div>
      <div>
        <button id="start_stop" onClick={handleStartStop}>
          {isRunning ? "Pause" : "Start"}
        </button>
        <button id="reset" onClick={handleReset}>
          Reset
        </button>
      </div>
      <audio
        id="beep"
        src="https://assets.mixkit.co/active_storage/sf`x/995/995.wav"
        preload="auto"
      />
    </div>
  );
};

export default StopWatch;
