import React, { useEffect, useState } from "react";
import designTop from "../assets/upraised images/designTop.svg";
import { IoRadioButtonOnSharp } from "react-icons/io5";
import { resultInitialState } from "../assets/constants";
import AnswerTimer from "./AnswerTimer";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import axios from "axios";

const Quiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { questions } = location.state || {};
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answerIndex, setAnswerIndex] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [result, setResult] = useState(resultInitialState);
  const [showResult, setShowResult] = useState(false);
  const [showAnswerTimer, setShowAnswerTimer] = useState(true);
  const [inputAnswer, setInputAnswer] = useState("");
  const [timeTaken, setTimeTaken] = useState(0); 
  const { question, choices, correctAnswer, type } = questions[currentQuestion];

  useEffect(() => {
    setInputAnswer("");
  }, [type]);

  const sendAnswerToAPI = async (payload) => {
    try {
      await axios.post(
        "https://675ba8229ce247eb19370281.mockapi.io/api/quiz/submit",
        payload
      );
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  const fetchFinalResults = async () => {
    try {
      const response = await axios.get(
        "https://675ba8229ce247eb19370281.mockapi.io/api/quiz/result"
      );
      setResult(response.data);
    } catch (error) {
      console.error("Error fetching final results:", error);
    }
  };

  const onAnswerClick = (answer, index) => {
    // console.log(answer,"answer")
    setAnswerIndex(index);
    if (answer === correctAnswer) {
      setAnswer(true);
    } else {
      setAnswer(false);
    }
  };

  const onClickNext = () => {
    const payload = {
      questionId: questions[currentQuestion].id,
      selectedAnswer: type === "FIB" ? inputAnswer : choices[answerIndex],
      isCorrect: answer,
      timeTaken,
    };

    sendAnswerToAPI(payload);

    setAnswerIndex(null);
    setShowAnswerTimer(false);
    setResult((prev) =>
      answer
        ? {
            ...prev,
            score: prev.score + 2,
            correctAnswers: prev.correctAnswers + 1,
          }
        : {
            ...prev,
            wrongAnswers: prev.wrongAnswers + 1,
          }
    );

    if (currentQuestion !== questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      fetchFinalResults();
      setShowResult(true);
    }

    setTimeout(() => {
      setShowAnswerTimer(true);
    }, 500);
  };

  const onStartAgain = () => {
    setResult(resultInitialState);
    setShowResult(false);
    navigate("/");
  };

  const onTimeUp = () => {
    setAnswer(false);
    onClickNext();
  };

  const handleInputChange = (e) => {
    setInputAnswer(e.target.value);
    if (e.target.value === correctAnswer) {
      setAnswer(true);
    } else {
      setAnswer(false);
    }
  };

  const answerType = () => {
    if (type === "FIB") {
      return (
        <input
          className="border-2 w-full py-4 px-4 mt-8 box-border rounded-lg"
          value={inputAnswer}
          onChange={handleInputChange}
        />
      );
    }
  
  
    return (
      <div className="mt-5">
        {choices &&
          choices.map((answer, index) => (
            <div
              key={index}
              onClick={() => onAnswerClick(answer, index)}
              className={`${
                answerIndex === index
                  ? "bg-custom-correct-background"
                  : "bg-custom-option-background"
              } mt-5 rounded-lg text-sm py-4 cursor-pointer hover:scale-105 ease-in-out duration-300 flex items-center`}
            >
              <span className="mx-2">
                <IoRadioButtonOnSharp
                  color={`${answerIndex === index ? "green" : "gray"}`}
                  size={16}
                />
              </span>
              {answer}
            </div>
          ))}
      </div>
    );
  };
  

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const percentage = (result.correctAnswers / questions.length) * 100;
  const getNeedleRotation = (percentage) => {
    return (percentage / 100) * 180 - 90;
  };

  return (
    <div className="bg-gradient-to-b from-white to-custom-purple w-screen h-screen py-5 md:py-10 flex items-center justify-center">
      <div className="iphone14:w-[95vw] iphone14:min-h-[78vh] iphone12:min-h-[78vh]  sm:w-72 md:w-80 lg:w-80 xl:w-96 mx-auto flex flex-col justify-center items-center shadow-xl pt-5 md:pt-10 bg-custom-purple relative max-h-[50vw] min-h-[45vw] md:min-h-[55vh] overflow-hidden">
        <div className="w-full sm:w-60 md:w-72 lg:w-80 xl:w-96 absolute -top-[0.2px]">
          <img src={designTop} alt="topDesign" />
        </div>

        {!showResult ? (
          <div className="bg-white mt-20 iphone14:w-[95vw] iphone12:w-[95vw] iphone14:max-h-[55vh] iphone12:min-h-[68vh] sm:w-60 md:w-72 lg:w-80 xl:w-96 rounded-tl-3xl rounded-tr-3xl px-5 py-5 max-h-[50vw] min-h-[45vw] overflow-scroll">
            <div className="rounded-full bg-white absolute  w-24 h-24 flex items-center justify-center z-10 iphone14:top-[11.5vw] iphone14:left-40 iphone14:w-18 iphone14:h-18 lg:top-[4.5vw] lg:left-32 md:left-28 iphone12:top-[8.8vw] iphone12:left-32">
              <div className="relative rounded-full flex justify-center items-center">
                <svg className="w-full h-full transform rotate-90 ">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="32%"
                    stroke="#f3f4fc"
                    strokeWidth="6"
                    fill="none"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="32%"
                    stroke="#4caf50"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray="251.2"
                    strokeDashoffset={(1 - progress / 100) * 251.2}
                    strokeLinecap="round"
                    className="transition-all duration-500 ease-out"
                  />
                </svg>
                <div className="absolute text-center text-black">
                  <p className="flex justify-center">
                    <span className="text-4xl font-extrabold">
                      {currentQuestion + 1}
                    </span>
                    <span className="text-sm font-light">
                      /{questions.length}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <h2 className="mt-12">{question}</h2>
            {answerType()}
            <div className="flex justify-center">
              <div
                onClick={onClickNext}
                disabled={answerIndex === null && !inputAnswer}
                className={`mt-10 cursor-pointer ${
                  answerIndex === null && !inputAnswer
                    ? "bg-custom-option-background cursor-not-allowed"
                    : "bg-button-color hover:scale-95 hover:bg-red-700"
                } rounded-full py-3 text-white w-full flex items-center justify-between px-3 `}
              >
                <span></span>
                {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
                <span className="mr-3">
                  <FaArrowRight />
                </span>
              </div>
            </div>
            {showAnswerTimer && (
              <AnswerTimer duration={1000} onTimeUp={onTimeUp} />
            )}
          </div>
        ) : (
          <div className="bg-white mt-20 iphone14:w-[95vw] iphone12:w-[95vw] iphone14:max-h-[55vh] iphone12:min-h-[68vh] sm:w-60 md:w-72 lg:w-80 xl:w-96 rounded-tl-3xl rounded-tr-3xl px-5 py-5 max-h-[50vw] min-h-[45vw] overflow-scroll">
            <h2 className="text-center font-bold text-xl">Your Result</h2>

            <div className="mt-8 flex justify-center items-center relative">
              <svg width="200" height="100" viewBox="0 0 200 100">
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#e6e6e6" 
                  strokeWidth="20"
                />
                <defs>
                  <linearGradient
                    id="progressGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                  
                    <stop offset="0%" stopColor="red" />
                    <stop offset="33%" stopColor="orange" />
                    <stop offset="66%" stopColor="yellow" />
                    <stop offset="100%" stopColor="green" />
                  </linearGradient>
                </defs>

                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="url(#progressGradient)" 
                  strokeWidth="20"
                  strokeDasharray="502.65" 
                  strokeDashoffset={0} 
                  strokeLinecap="round"
                  transform="rotate(-90 100 100)" 
                />

                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="url(#progressGradient)" 
                  strokeWidth="20"
                  strokeDasharray="502.65" 
                  strokeDashoffset={502.65 - (percentage / 100) * 502.65}
                  strokeLinecap="round"
                  transform="rotate(-90 100 100)"
                />

                <polygon
                  points="100,20 90,30 110,30"
                  fill="black"
                  transform={`rotate(${getNeedleRotation(percentage)} 100 100)`}
                />

                <text
                  x="100"
                  y="85" 
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fontSize="24"
                  fontWeight="bold"
                  fill="black"
                >
                  {Math.round(percentage)}%
                </text>
              </svg>
            </div>

            <div className="bg-custom-correct-background mt-10 mb-5 py-4 rounded-xl px-4">
              <p className="mr-4 flex items-center">
                <span className="mr-2">
                  <IoRadioButtonOnSharp color="green" />
                </span>
                <span className="font-bold">{result.correctAnswers}</span>
                <span className="font-lighter ml-2">Correct</span>
              </p>
            </div>
            {result.wrongAnswers > 0 && (
              <div className="bg-custom-incorrect-background mb-5 py-4 rounded-xl px-4">
                <p className="mr-4 flex items-center">
                  <span className="mr-2">
                    <IoRadioButtonOnSharp color="red" />
                  </span>
                  <span className="font-bold">{result.wrongAnswers}</span>
                  <span className="font-lighter ml-2">Incorrect</span>
                </p>
              </div>
            )}
            <button
              onClick={onStartAgain}
              className={`mt-10 cursor-pointer bg-button-color rounded-full py-3 text-white w-full hover:scale-95 ease-in-out duration-300`}
            >
              Start Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
