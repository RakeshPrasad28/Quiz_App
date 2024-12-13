import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StartButton from "../assets/upraised images/Start button.png";
import Group3 from "../assets/upraised images/Group 3.svg";
import "../styles/Home.css";
import axios from "axios";

const Home = () => {
  const [quizData, setQuizData] = useState([]);
  useEffect(() => {
    getQuizQuestions();
  }, []);

  const getQuizQuestions = async () => {
    try {
      const response = await axios.get(
        "https://675ba8229ce247eb19370281.mockapi.io/api/quiz/questions"
      );
      setQuizData(response.data);
    } catch (error) {
      console.log(error, "error in App");
    }
  };

  const imageElement = (
    <img
      src={StartButton}
      alt="start"
      className="w-48 sm:w-60 md:w-72 lg:w-80 xl:w-96 transition-transform duration-300 hover:scale-110 ease-in-out"
    />
  );
  return (
    <div className="bg-gradient-to-b from-white to-custom-purple w-screen h-screen p-5 md:p-10 flex items-center justify-center">
      <div className="w-full sm:w-96 md:w-80 lg:w-96 xl:w-96 mx-auto flex flex-col justify-center items-center shadow-xl p-5 md:p-10">
        <div className="flex justify-center items-center my-10 md:my-20">
          <img
            src={Group3}
            alt="Quizo"
            className="w-40 sm:w-48 md:w-56 lg:w-64 xl:w-72 my-10"
          />
        </div>
        {quizData.length > 0 ? (
          <Link to="/quiz" state={{ questions: quizData }}>
            {imageElement}
          </Link>
        ) : (
          imageElement
        )}
      </div>
    </div>
  );
};

export default Home;
