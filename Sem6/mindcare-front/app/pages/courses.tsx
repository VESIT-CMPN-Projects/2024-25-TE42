import React from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { Stack } from "expo-router";  
import { useRouter } from "expo-router";

const courses = [
    {
      id: "1",
      title: "Mindfulness Meditation",
      description: "Learn how to practice mindfulness to reduce stress.",
      image: require("../../assets/images/c2.jpeg"), // Use require() here
      amount: "₹1999",
    },
    {
      id: "2",
      title: "Self-Help Strategies",
      description: "Boost your confidence and improve self-growth.",
      image: require("../../assets/images/c2.jpeg"),
      amount: "₹2499",
    },
    {
      id: "3",
      title: "Deep Relaxation Techniques",
      description: "Master techniques to achieve deep mental relaxation.",
      image: require("../../assets/images/c3.png"),
      amount: "₹2999",
    },
  ];

const CourseCard = ({ course }) => (
  <View className="bg-white p-4 mb-4 rounded-lg shadow-md">
    <Image source={course.image} className="w-full h-40 rounded-lg mb-2" />


    <Text className="text-lg font-bold">{course.title}</Text>
    <Text className="text-gray-600 mb-2">{course.description}</Text>
    <Text className="text-green-600 font-semibold mb-2">Price: {course.amount}</Text>
    <TouchableOpacity className="bg-orange-700 py-3 px-5 rounded-lg flex-1 mr-2 shadow-md" onPress={() => alert(`Purchased: ${course.title}`)}>
      <Text className="text-white text-center font-bold">Buy Now</Text>
    </TouchableOpacity>
  </View>
);

export default function CoursePage() {
  const router = useRouter();
  return (
    <View className="flex-1 p-5 bg-gray-100">
      <Stack.Screen options={{ headerShown: false }} />
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#333" }}>←</Text>
      </TouchableOpacity>
      <Text className="text-2xl font-bold text-center mb-5">Courses</Text>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CourseCard course={item} />}
      />
    </View>
  );
}
