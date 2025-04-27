import React from "react";
import { View, Text, FlatList, Image } from "react-native";
import { Stack } from "expo-router";  
import { TouchableOpacity } from 'react-native';
import { useRouter } from "expo-router";

const mentalHealthActivities = [
    {
        id: "1",
        title: "Guided Meditation",
        description: "Practice guided meditation to calm your mind, reduce anxiety, and enhance self-awareness. This technique involves focusing on your breath, a mantra, or a visualization to achieve deep relaxation.",
        image: require("../../assets/images/getStarted2.jpg"),
      },
      {
        id: "2",
        title: "Breathing Exercises",
        description: "Simple breathing techniques to help manage stress and depression. These exercises involve slow, deep breathing patterns that activate the parasympathetic nervous system, promoting relaxation and reducing tension.",
        image: require("../../assets/images/m2.jpg"),
      },
      {
        id: "3",
        title: "Yoga for Mental Health",
        description: "Yoga postures that promote relaxation and improve mental well-being. By combining physical movement, breath control, and mindfulness, yoga can help reduce cortisol levels and enhance emotional balance.",
        image: require("../../assets/images/m3.jpg"),
      },
      {
        id: "4",
        title: "Journaling for Self-Reflection",
        description: "Write down your thoughts to process emotions and gain clarity. Journaling helps you identify patterns in your thoughts and behaviors, fostering personal growth and mental clarity.",
        image: require("../../assets/images/m4.jpg"),
      },
      {
        id: "5",
        title: "Progressive Muscle Relaxation",
        description: "A technique to reduce muscle tension and stress systematically. This method involves tensing and relaxing different muscle groups to promote physical relaxation and mental calmness.",
        image: require("../../assets/images/m5.jpg"),
      },
      {
        id: "6",
        title: "Listening to Calming Music",
        description: "Use music therapy to ease anxiety and improve focus. Soft instrumental music, nature sounds, or binaural beats can enhance relaxation and mental clarity.",
        image: require("../../assets/images/m6.jpg"),
      },
      {
        id: "7",
        title: "Nature Walks",
        description: "Spending time in nature to boost mental clarity and well-being. Walking outdoors, especially in green spaces, helps reduce stress, improve mood, and encourage mindfulness.",
        image: require("../../assets/images/m7.jpg"),
      }
    ];

const ActivityCard = ({ activity }) => (
  <View className="bg-white p-4 mb-4 rounded-lg shadow-md">
     {activity.image && (
      <Image source={activity.image} style={{ width: "100%", height: 160, borderRadius: 10, marginBottom: 8 }} 
      resizeMode="coverx`" 
/>
    )}
    <Text className="text-lg font-bold">{activity.title}</Text>
    <Text className="text-gray-600">{activity.description}</Text>
  </View>
);

export default function MentalHealthPage() {
     const router = useRouter();
  return (
    <View className="flex-1 p-5 bg-gray-100">
      
            <Stack.Screen options={{ headerShown: false }} />
            {/* Header */}
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={{ fontSize: 20, fontWeight: "bold", color: "#333" }}>←</Text>
            </TouchableOpacity>
      <Text className="text-2xl font-bold text-center mb-5">Mental Health Activities</Text>
      <FlatList
        data={mentalHealthActivities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ActivityCard activity={item} />}
      />
    </View>
  );
}
