// import React, { useEffect } from "react";
// import { SafeAreaView, Text, View, TouchableOpacity, ScrollView, Image } from "react-native";
// import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
// import MusicScreen from "@/app/pages/music";
// import { Link } from "expo-router";
// import { useRouter } from "expo-router";
// import { useNavigation } from "expo-router";
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withTiming,
//   Easing,
// } from "react-native-reanimated";
// import { Ionicons } from "@expo/vector-icons";
// import { LinearGradient } from "expo-linear-gradient";

// export default function HomePage() {

//   const navigation = useNavigation();
//   const { user } = useUser();
//   const opacity = useSharedValue(0);
// const router = useRouter();

//   useEffect(() => {
//     opacity.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.exp) });
//   }, []);

//   const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

//   return (
//     <SafeAreaView className="flex-1 bg-white px-6 pt-6">
//       <ScrollView showsVerticalScrollIndicator={false}>

//         {/* Header */}
//         <View className="flex-row justify-start items-center">
//           <TouchableOpacity>
//             <Ionicons name="menu-outline" size={28} color="black" />
//           </TouchableOpacity>
//           <Text className="text-2xl mt-6 ml-6 font-bold flex-1">MindCare{"\n"}Your Path to Inner Peace.</Text>
//           <TouchableOpacity className="mr-4">
//             <Link href="/profile">
//               <Image
//                 source={{ uri: user?.imageUrl || "https://via.placeholder.com/150" }}
//                 className="w-12 h-12 rounded-full "
//               />
//             </Link>
//           </TouchableOpacity>
//         </View>

//         {/* Welcome Card */}
//         {/* <Animated.View style={animatedStyle} className="bg-blue-500 rounded-lg p-6 mt-8">
//           <Text className="text-white text-lg font-bold">Ready to start meditations</Text>
//           <Text className="text-white text-sm mt-1">Start and get your gift!</Text>
//           <TouchableOpacity className="mt-4 bg-white px-6 py-2 rounded-full">
//             <Text className="text-blue-500 font-bold">Learn More</Text>
//           </TouchableOpacity>
//         </Animated.View> */}
//          {/* 1-on-1 Sessions */}
//          <Animated.View style={animatedStyle} className="items-center ml-4 mr-4 mt-8 mb-5">
//           <TouchableOpacity className="w-full p-5 rounded-lg bg-[#EFDFBB] flex-row justify-between items-center">
//             <Link href="/chat" className="flex-1">
//               <View className="flex items-start">
//                 <Text className="text-[#722F37] text-lg font-bold">1 on 1 Sessions</Text>
//                 <Text className="text-[#722F37] text-sm mt-1">
//                   Let's open up to the things that matter the most.
//                 </Text>
//                 <Text className="text-[#722F37] text-lg font-bold mt-2 flex items-center">
//                   Talk it out <Ionicons name="chatbubble-ellipses-outline" size={20} color="#722F37" />
//                 </Text>
//               </View>
//             </Link>
//             <Ionicons name="people-outline" size={40} color="#722F37" />
//           </TouchableOpacity>
//         </Animated.View>

//         {/* Categories */}
//         <View className="flex-row justify-between items-center ml-4 mt-8">
//           <Text className="text-lg font-bold">Categories</Text>
//           <TouchableOpacity className="mr-4">
//             <Text className="text-blue-500 font-semibold">View All</Text>
//           </TouchableOpacity>
//         </View>
//         <View className="flex-row mt-4 ml-2">
//           <TouchableOpacity className="px-5 py-2 bg-gray-100 rounded-full mr-3">
//             <Text className="text-gray-800">Relax</Text>
//           </TouchableOpacity>
//           <TouchableOpacity className="px-5 py-2 bg-gray-100 rounded-full mr-3">
//             <Text className="text-gray-800">Sleep</Text>
//           </TouchableOpacity>
//           <TouchableOpacity className="px-5 py-2 bg-gray-100 rounded-full">
//             <Text className="text-gray-800">Calm</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Latest Practices */}
//         <Text className="text-lg font-bold mt-8 ml-4">Latest Practices</Text>
//         <ScrollView horizontal={false} showsVerticalScrollIndicator={false} className="mt-5 ml-3 mr-3">
//           <View className="flex-row flex-wrap justify-between">
//             <TouchableOpacity className="w-[48%] bg-gray-100 rounded-lg p-4 mb-5" onPress={() => router.push("/pages/courses")}>
//               <Image
//                 source={require('../../../assets/images/courses.jpg')}
//                 className="w-full h-28 rounded-lg"
//               />
//               <Text className="text-base font-bold mt-3">Courses for you</Text>
//               <Text className="text-sm text-gray-600">Introduction</Text>
//             </TouchableOpacity>
//             <TouchableOpacity className="w-[48%] bg-gray-100 rounded-lg p-4 mb-5" onPress={() => router.push("/pages/motivation")}>
//               <Image
//                source={require('../../../assets/images/ted.jpg')}
//                 className="w-full h-28 rounded-lg"
//               />
//               <Text className="text-base font-bold mt-3">Motivational videos</Text>
//               <Text className="text-sm text-gray-600">Introduction</Text>
//             </TouchableOpacity>
//             <TouchableOpacity className="w-[48%] bg-gray-100 rounded-lg p-4 mb-5">
//               <Image
//                 source={require('../../../assets/images/community1.jpg')}
//                 className="w-full h-32 rounded-lg "
//                 resizeMode="center"
//               />
//               <Text className="text-base font-bold mt-3">Join Community</Text>
//               <Text className="text-sm text-gray-600">Guide</Text>
//             </TouchableOpacity>

//             <TouchableOpacity className="w-[48%] bg-gray-100 rounded-lg p-4 mb-5" onPress={() => router.push("/pages/music")}>
//               <Image
//                source={require('../../../assets/images/music.jpeg')}
//                 className="w-full h-32 rounded-lg object-contain"
//                 // resizeMode="cover"
//               />
//               <Text className="text-base font-bold mt-3">Relax Music</Text>
//               <Text className="text-sm text-gray-600">Calm your mind </Text>

//             </TouchableOpacity>

//             <TouchableOpacity className="w-[48%] bg-gray-100 rounded-lg p-4 mb-5" onPress={() => router.push("/pages/aricles")}>
//               <Image
//                 source={require('../../../assets/images/articles.jpg')}
//                 className="w-full h-28 rounded-lg object-contain"
//                 resizeMode="cover"

//               />
//               <Text className="text-base font-bold mt-3">Articles</Text>
//               <Text className="text-sm text-gray-600 ">Read at your pace</Text>
//             </TouchableOpacity>

//             <TouchableOpacity className="w-[48%] bg-gray-100 rounded-lg p-4 mb-5" onPress={() => router.push("/pages/exercies")}>
//               <Image
//                  source={require('../../../assets/images/exercises.jpg')}
//                 className="w-full h-32 rounded-lg"
//                 resizeMode="cover"
//               />
//               <Text className="text-base font-bold mt-3">Exercises</Text>
//               <Text className="text-sm text-gray-600">Work on youself</Text>
//             </TouchableOpacity>

//             <TouchableOpacity className="w-[48%] bg-gray-100 rounded-lg p-4 mb-5" onPress={() => router.push("/pages/quiz")}>
//               <Image
//                source={require('../../../assets/images/quiz.jpg')}
//                 className="w-full h-28 rounded-lg"
//               />
//               <Text className="text-base font-bold mt-3">Tests</Text>
//               <Text className="text-sm text-gray-600">Know yourself better</Text>
//             </TouchableOpacity>

//             <TouchableOpacity className="w-[48%] bg-gray-100 rounded-lg p-4 mb-5" onPress={() => router.push("/pages/therpaist")} >
//               <Image
//                  source={require('../../../assets/images/doc.jpg')}
//                 className="w-full h-28 rounded-lg"
//               />
//               <Text className="text-base font-bold mt-3">Therapist</Text>
//               <Text className="text-sm text-gray-600">Not fullfilled enough?</Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>

//       </ScrollView>
//     </SafeAreaView>
//   );
// }

import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

export default function HomePage() {
  const router = useRouter();
  const opacity = useSharedValue(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: 1000,
      easing: Easing.out(Easing.exp),
    });

    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        if (token) {
          const userData = await AsyncStorage.getItem("user_data");
          setUser(userData ? JSON.parse(userData) : null);
        } else {
          Alert.alert("Unauthorized", "Please log in first.", [
            { text: "OK", onPress: () => router.push("/sign-in") },
          ]);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <SafeAreaView className="flex-1 bg-white px-6 pt-6">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row justify-start items-center">
          <TouchableOpacity>
            <Ionicons name="menu-outline" size={28} color="black" />
          </TouchableOpacity>
          <Text className="text-2xl mt-6 ml-6 font-bold flex-1">
            MindCare{""}Your Path to Inner Peace.
          </Text>
          <TouchableOpacity className="mr-4">
            <TouchableOpacity onPress={() => router.push("/profile")}>
              <Image
                source={{
                  uri: user?.imageUrl || "https://via.placeholder.com/150",
                }}
                className="w-12 h-12 rounded-full "
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        {/* 1-on-1 Sessions */}
        <Animated.View
          style={animatedStyle}
          className="items-center ml-4 mr-4 mt-8 mb-5"
        >
          <TouchableOpacity
            className="w-full p-5 rounded-lg bg-[#EFDFBB] flex-row justify-between items-center"
            onPress={() => router.push("/chat")}
          >
            <View className="flex items-start">
              <Text className="text-[#722F37] text-lg font-bold">
                1 on 1 Sessions
              </Text>
              <Text className="text-[#722F37] text-sm mt-1">
                Let's open up to the things that matter the most.
              </Text>
              <Text className="text-[#722F37] text-lg font-bold mt-2 flex items-center">
                Talk it out{" "}
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={20}
                  color="#722F37"
                />
              </Text>
            </View>
            <Ionicons name="people-outline" size={40} color="#722F37" />
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
