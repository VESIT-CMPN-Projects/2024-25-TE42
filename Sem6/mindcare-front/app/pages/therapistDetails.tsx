import React from "react";
import { View, Text, Image, TouchableOpacity, Alert, Linking } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import therapistsData from "../../components/therapistData"; // Ensure correct path

export default function TherapistDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Find the therapist by ID
  const therapist = therapistsData.find((t) => t.id === id);

  if (!therapist) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <Text className="text-xl font-bold text-red-600">Therapist Not Found</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-blue-600 px-4 py-2 rounded">
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Handle call action
  const handleContactClinic = () => {
    Alert.alert(
      "Contact Clinic",
      `Do you want to call ${therapist.name}'s clinic?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Call", onPress: () => Linking.openURL(`tel:${therapist.contact}`) },
      ]
    );
  };

  return (
    <View className="flex-1 p-6 bg-white">
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} className="mb-4">
        <Text className="text-lg font-semibold text-gray-700">← Back</Text>
      </TouchableOpacity>

      {/* Therapist Profile */}
      <View className="items-center">
        <Image source={therapist.image} className="w-32 h-32 rounded-full mb-4" />
        <Text className="text-2xl font-bold text-blue-700">{therapist.name}</Text>
        <Text className="text-lg text-gray-600">{therapist.specialization}</Text>
        <Text className="text-gray-500">{therapist.experience}</Text>
      </View>

      {/* Location */}
      <Text className="text-lg font-bold mt-4">📍 Location:</Text>
      <Text className="text-gray-700">{therapist.location}</Text>

      {/* Rating & Reviews */}
      <Text className="text-lg font-bold mt-4">⭐ Rating & Reviews:</Text>
      <Text className="text-gray-700">{therapist.rating}% Positive ({therapist.reviews} Reviews)</Text>

      {/* Availability */}
      <Text className="text-lg font-bold mt-4">🗓 Availability:</Text>
      <Text className="text-gray-700">{therapist.available}</Text>

      {/* Full Description */}
      <Text className="text-lg font-bold mt-4">📖 About:</Text>
      <Text className="text-gray-700">{therapist.description}</Text>

      {/* Contact Button */}
      <TouchableOpacity
        onPress={handleContactClinic}
        className="mt-6 bg-blue-600 px-4 py-2 rounded-full items-center"
      >
        <Text className="text-white font-semibold text-lg">📞 Contact Clinic</Text>
      </TouchableOpacity>
    </View>
  );
}
