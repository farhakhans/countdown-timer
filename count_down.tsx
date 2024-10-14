"use client"

import { useState, useRef, useEffect, ChangeEvent } from "react";
import { Input } from "@/components/ui/input"; // Assuming these components use Tailwind CSS internally
import { Button } from "@/components/ui/button"; // Same assumption as above

export default function Countdown() {
  const [duration, setDuration] = useState<number | string>(" ");
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const timeRef = useRef<NodeJS.Timeout | null>(null);

  const handleSetDuration = (): void => {
    if (typeof duration === "number" && duration > 0) {
      setTimeLeft(duration);
      setIsActive(false);
      setIsPaused(false);
      if (timeRef.current) {
        clearInterval(timeRef.current);
      }
    }
  };

  const handleStart = (): void => {
    if (timeLeft > 0) {
      setIsActive(true);
      setIsPaused(false);
    }
  };

  const handlePause = (): void => {
    if (isActive) {
      setIsPaused(true);
      setIsActive(false);
      if (timeRef.current) {
        clearInterval(timeRef.current);
      }
    }
  };

  const handleReset = (): void => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(typeof duration === "number" ? duration : 0);
    if (timeRef.current) {
      clearInterval(timeRef.current);
    }
  };

  useEffect(() => {
    if (isActive && !isPaused) {
      timeRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timeRef.current!);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timeRef.current) {
        clearInterval(timeRef.current);
      }
    };
  }, [isActive, isPaused]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handleDurationChange = (e: ChangeEvent<HTMLInputElement>): void =>
    setDuration(Number(e.target.value) || "");

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-blue-500 mb-4">Countdown Timer</h2>

        <Input
          type="number"
          placeholder="Set duration (seconds)"
          value={duration}
          onChange={handleDurationChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
        />

        <div className="text-4xl font-bold text-gray-700 mb-6">
          {formatTime(timeLeft)}
        </div>

        <div className="flex space-x-4 justify-center mb-4">
          <Button
            onClick={handleStart}
            className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
            disabled={isActive}
          >
            Start
          </Button>

          <Button
            onClick={handlePause}
            className="bg-yellow-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-yellow-600 transition duration-300"
          >
            Pause
          </Button>

          <Button
            onClick={handleReset}
            className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}





