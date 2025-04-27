import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";

import anxietyQuizData from "../../data/anxietyquiz.json";
import ocdQuizData from "../../data/ocdquiz.json";
import depressionQuizData from "../../data/depressionquiz.json";
import { Stack } from "expo-router"; 
import { ImageBackground } from "react-native";

const quizOptions = [
  { title: "Anxiety Quiz", key: "anxiety" },
  { title: "Depression Quiz", key: "depression" },
  { title: "OCD Quiz", key: "ocd" }
];

export default function QuizApp() {
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const handleQuizSelection = (quizKey) => {
    setSelectedQuiz(quizKey);
  };

  return (
    <ImageBackground
    source={require("../../assets/images/q1.jpg")}
    className="w-full h-full flex justify-end px-5"
    resizeMode="cover"
  >
    <View className="flex-1 bg-gray-100 p-10 mt-8 ">
       <Stack.Screen options={{ headerShown: false }} />
      {!selectedQuiz ? (
        <ScrollView>
          <Text className="text-3xl font-bold text-center mb-6">Select a Quiz</Text>
          {quizOptions.map((quiz) => (
            <TouchableOpacity
              key={quiz.key}
              className="bg-black p-4 mb-4 rounded-lg shadow-md"
              onPress={() => handleQuizSelection(quiz.key)}
            >
              <Text className="text-white text-center text-lg font-semibold">
                {quiz.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <QuizComponent quizKey={selectedQuiz} onRestart={() => setSelectedQuiz(null)} />
      )}
    </View>
    </ImageBackground>
  );
}

function QuizComponent({ quizKey, onRestart }) {
  const quizData = getQuizData(quizKey);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [clickedOption, setClickedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const changeQuestion = () => {
    updateScore();
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setClickedOption(null);
    } else {
      setShowResult(true);
    }
  };

  const updateScore = () => {
    if (clickedOption !== null) {
      setScore((prevScore) => prevScore + clickedOption);
    }
  };

  const getResultMessage = () => {
    if (score > 0 && score <= 10) return "Subclinical: Some symptoms are present, but they do not significantly impair daily life.";
    if (score > 10 && score <= 20) return "Mild: Symptoms cause some distress and impairment, but remain manageable.";
    if (score > 20 && score <= 35) return "Moderate: Symptoms cause significant distress and impairment in daily activities.";
    if (score > 35) return "Severe: Symptoms severely impact daily life.";
    return "No significant symptoms detected.";
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 p-5">
      <View className="bg-white p-6 rounded-lg shadow-md">
        <Text className="text-2xl font-bold text-center mb-4">{quizKey.toUpperCase()} Quiz</Text>
        {!showResult ? (
          <View>
            <Text className="text-lg font-semibold mb-4">{quizData[currentQuestion].question}</Text>
            <View className="mb-4">
            {quizData[currentQuestion].answers.map((answer, index) => (
                <TouchableOpacity
                    key={index}
                    className={`p-3 mb-2 rounded-lg ${clickedOption === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    onPress={() => setClickedOption(index + 1)}
                >
    <Text className="text-center text-lg font-medium">
      {typeof answer === "object" ? answer.text : answer}
    </Text> 
  </TouchableOpacity>
))}

            </View>
            <TouchableOpacity className="bg-green-500 py-3 px-5 rounded-lg shadow-md mt-4" onPress={changeQuestion}>
              <Text className="text-white text-center font-bold">Next</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="items-center">
            <Text className="text-2xl font-bold">Result</Text>
            <Text className="text-xl font-semibold my-3">Score: {score}</Text>
            <Text className="text-lg text-center px-4 my-3">{getResultMessage()}</Text>
            <TouchableOpacity className="bg-blue-500 py-3 px-5 rounded-lg shadow-md mt-4" onPress={onRestart}>
              <Text className="text-white text-center font-bold">Restart Quiz</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

// Function to load the correct quiz data
const getQuizData = (quizKey) => {
  const quizzes = {
    anxiety: anxietyQuizData,
    depression: depressionQuizData,
    ocd: ocdQuizData
  };
  return quizzes[quizKey] || [];
};
