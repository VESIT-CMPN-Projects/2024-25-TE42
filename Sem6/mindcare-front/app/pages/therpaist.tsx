import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { Stack, useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// Therapist Data
const therapistsData = [
  {
    id: "1",
    name: "Dr. Ketan Parmar",
    specialization: "Psychologist",
    experience: "37 years experience overall",
    location: "Borivali East, Mumbai",
    rating: 74,
    reviews: 31,
    available: "Available Tomorrow",
    image: require("../../assets/images/dr-ketan.jpg"),
  },
  {
    id: "2",
    name: "Dr. Naazneen Ladak",
    specialization: "Psychologist",
    experience: "21 years experience overall",
    location: "Andheri West, Mumbai  BHN Elder Care + 2 more",
    rating: 98,
    reviews: 82,
    available: "Available Today",
    image: require("../../assets/images/dr-naazneen-ladak.jpg"),
  },
  {
    id: "3",
    name: "Ms. Riddhi Patel",
    specialization: "Psychologist",
    experience: "12 years experience overall",
    location: "Vileparle West, Mumbai  Psychoknowmics Educational And Counseling ",
    rating: 98,
    reviews: 82,
    available: "Available Today",
    image: require("../../assets/images/ms-riddhi-patel.jpg"),
  },
  {
    id: "4",
    name: "Ms. Mithila Desai",
    specialization: "Psychologist",
    experience: "37 years experience overall",
    location: "Borivali West, Mumbai  Dr Mithila Desai's Power Of Mind Clinic",
    rating: 93,
    reviews: 107,
    available: "Available Today",
    image: require("../../assets/images/ms-mithila-desai.jpg"),
  },
  {
    id: "5",
    name: "Ms. Rashi Laskari",
    specialization: "Psychologist",
    experience: "16 years experience overall",
    location: "Andheri West, Mumbai  Inner Light Counselling Centre",
    rating: 97,
    reviews: 99,
    available: "Available Today",
    image: require("../../assets/images/ms-rashi-laskari.jpg"),
  },
  {
    id: "6",
    name: "Ms. Mahima Pawar",
    specialization: "Psychologist",
    experience: "9 years experience overall",
    location: "Andheri East, Mumbai  Evolve Wellness",
    rating: 100,
    reviews: 17,
    available: "Available Today",
    image: require("../../assets/images/ms-mahima-pawar.jpg"),
  },
];

// Therapist Card Component
const TherapistCard = ({ therapist }) => {
  const router = useRouter(); // Ensure router is used inside the component

  return (
    <TouchableOpacity
      onPress={() => router.push({ pathname: "/pages/therapistDetails", params: { id: therapist.id } })}
      className="bg-white p-2 mb-4 rounded-xl shadow-lg flex-row items-center w-[98%] self-center"
    >
      {/* Profile Image */}
      <Image source={therapist.image} className="w-24 h-24 rounded-full mr-4" />

      {/* Therapist Details */}
      <View className="flex-1 ml-4">
        <Text className="text-lg font-semibold text-blue-700">{therapist.name}</Text>
        <Text className="text-gray-600">{therapist.specialization}</Text>
        <Text className="text-gray-500 text-sm">{therapist.experience}</Text>
        <Text className="font-bold text-gray-800">{therapist.location}</Text>

        {/* Rating and Reviews */}
        <View className="flex-row items-center mt-2">
          <Icon name="thumb-up" size={20} color="green" />
          <Text className="text-green-600 font-bold ml-1">{therapist.rating}%</Text>
          <Text className="text-blue-600 ml-3">{therapist.reviews} Patient Stories</Text>
        </View>

        {/* Availability */}
        <Text className="text-gray-500 mt-1">{therapist.available}</Text>
      </View>
    </TouchableOpacity>
  );
};

// Therapist List Page
export default function TherapistListPage() {
  const router = useRouter();

  return (
    <View className="flex-1 p-4 bg-gray-100">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Back Button */}
      <TouchableOpacity onPress={() => router.push("/(root)/(tabs)/home")} className="mb-3">
        <Text className="text-lg font-semibold text-gray-700">← Back</Text>
      </TouchableOpacity>

      {/* Page Title */}
      <Text className="text-2xl font-bold text-center text-orange-800 mb-4">
        🩺 Find a Therapist 🩺
      </Text>

      {/* Therapist List */}
      <FlatList
        data={therapistsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TherapistCard therapist={item} />}
      />
    </View>
  );
}