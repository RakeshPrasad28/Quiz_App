import React, { useEffect, useRef, useState } from "react";

function AnswerTimer({ duration, onTimeUp }) {
  const [counter, setCounter] = useState(0);
  const [pro, setPro] = useState(0);
  const counterRef = useRef();
  useEffect(() => {
    counterRef.current = setInterval(() => {
      setCounter((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(counterRef.current);
  }, []);

  useEffect(() => {
    setPro(100 * (counter / duration));
    if (counter === duration) {
      clearInterval(counterRef.current);
      setTimeout(() => {
        onTimeUp();
      }, 1000);
    }
  }, [counter]);

  return (
    <div className="absolute w-full left-0 bottom-0">
      <div
        className="h-[5px] duration-[1000ms] bg-red-600 rounded-xl ease-linear"
        style={{
          width: `${pro}%`,
          backgroundColor: `${
            pro < 40 ? "lightgreen" : pro < 70 ? "orange" : "red"
          }`,
        }}
      ></div>
    </div>
  );
}

export default AnswerTimer;
