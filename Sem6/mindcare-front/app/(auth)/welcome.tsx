import { Text, TouchableOpacity, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Swiper from "react-native-swiper";
import { useRef, useState } from "react";
import { onboarding } from "@/constants";

import CustomButton from "@/components/CustomButton";

const Onboarding = () => {
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const isLastSlide = activeIndex === onboarding.length - 1;

  return (
    <View className="flex-1 bg-white relative">
      {/* Skip Button */}
      <TouchableOpacity
        onPress={() => router.replace('/(auth)/sign-up')}
        className="absolute top-10 right-5 z-10 mt-8"
      >
        <Text className="text-white text-xl font-JakartaBold">Skip</Text>
      </TouchableOpacity>

      {/* Swiper */}
      <Swiper
        ref={swiperRef}
        loop={false}
        dot={<View className="w-[32px] h-[4px] mx-1 bg-[#E2E8F0] rounded-full" />}
        activeDot={<View className="w-[32px] h-[4px] mx-1 bg-[#0286FF] rounded-full" />}
        onIndexChanged={(index) => setActiveIndex(index)}
      >
        {onboarding.map((item) => (
          <View key={item.id} className="flex-1 relative">
            {/* Full-Screen Image */}
            <Image
              source={require('../../assets/images/started.jpg')}
              className="absolute top-0 left-0 w-full h-full"
              resizeMode="cover"
            />

            {/* Overlay for Content */}
            <View className="absolute bottom-10 left-5 right-5 p-5 mb-28 rounded-lg">
            {/* <Image
                source={require('../../assets/images/getStarted1.jpg')} 
                className="w-[100px] h-[100px] mb-4"
                resizeMode="contain"
              /> */}
              <Text className="text-white text-3xl font-bold text-center">
                {item.title}
              </Text>
              <Text className="text-md font-JakartaSemiBold text-center text-white mt-3">
                {item.description}
              </Text>
            </View>
          </View>
        ))}
      </Swiper>

      {/* Button at Bottom */}
      <View className="absolute bottom-5 left-5 right-5 mb-14">
        <CustomButton
          title={isLastSlide ? "Get Started" : "Next"}
          onPress={() =>
            isLastSlide ? router.replace("/(auth)/sign-up") : swiperRef.current?.scrollBy(1)
          }
          className="w-full"
        />
      </View>
    </View>
  );
};

export default Onboarding;
