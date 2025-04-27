import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRoute } from "@react-navigation/native";
import Quiz from "../../components/quiz";

// Import quiz data
import anxietyQuizData from "../../data/anxietyquiz.json";
import ocdQuizData from "../../data/ocdquiz.json";
import depressionQuizData from "../../data/depressionquiz.json";

const quizMapping: Record<string, any> = {
  anxiety: anxietyQuizData,
  ocd: ocdQuizData,
  depression: depressionQuizData,
};

const QuizScreen = () => {
  const route = useRoute();
  const { quizType } = route.params as { quizType: string };
  
  const [quizData, setQuizData] = useState<any | null>(null);

  useEffect(() => {
    if (quizType in quizMapping) {
      setQuizData(quizMapping[quizType]);
    }
  }, [quizType]);

  if (!quizData) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4 text-gray-700">Loading Quiz...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <Text className="text-2xl font-bold text-gray-800 text-center mb-4">{quizType.toUpperCase()} Quiz</Text>
      <Quiz questions={quizData.questions} />
    </View>
  );
};

export default QuizScreen;
