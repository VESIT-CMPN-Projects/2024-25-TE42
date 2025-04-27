import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";

export default function QuizComponent({ quizData, quizTitle, onRestart }) {
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedScore, setSelectedScore] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const changeQuestion = () => {
    if (selectedScore !== null) {
      setScore((prevScore) => prevScore + selectedScore);
    }

    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedScore(null);
    } else {
      setShowResult(true);
    }
  };

  const handleResetClick = () => {
    setScore(0);
    setCurrentQuestion(0);
    setShowResult(false);
    setSelectedScore(null);
    onRestart();
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
        <Text className="text-2xl font-bold text-center mb-4">{quizTitle}</Text>
        {!showResult ? (
          <View>
            <Text className="text-lg font-semibold mb-4">{quizData[currentQuestion].question}</Text>
            <View className="mb-4">
              {quizData[currentQuestion].answers.map((answer, index) => (
                <TouchableOpacity
                  key={index}
                  className={`p-3 mb-2 rounded-lg ${selectedScore === answer.score ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                  onPress={() => setSelectedScore(answer.score)}
                >
                  <Text className="text-center text-lg font-medium">{answer.text}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity 
              className={`py-3 px-5 rounded-lg shadow-md mt-4 ${selectedScore !== null ? "bg-green-500" : "bg-gray-400"}`} 
              disabled={selectedScore === null}
              onPress={changeQuestion}
            >
              <Text className="text-white text-center font-bold">Next</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="items-center">
            <Text className="text-2xl font-bold">Result</Text>
            <Text className="text-xl font-semibold my-3">Score: {score}</Text>
            <Text className="text-lg text-center px-4 my-3">{getResultMessage()}</Text>
            <TouchableOpacity className="bg-blue-500 py-3 px-5 rounded-lg shadow-md mt-4" onPress={handleResetClick}>
              <Text className="text-white text-center font-bold">Restart Quiz</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
