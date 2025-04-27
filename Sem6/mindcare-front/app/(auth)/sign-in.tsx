// import { useSignIn } from "@clerk/clerk-expo";
// import { Link, router } from "expo-router";
// import { useCallback, useState } from "react";
// import { Alert, ScrollView, Text, View } from "react-native";

// import CustomButton from "@/components/CustomButton";
// import InputField from "@/components/InputField";
// import OAuth from "@/components/OAuth";
// import { ImageBackground } from "react-native";

// const SignIn = () => {
//   const { signIn, setActive, isLoaded } = useSignIn();

//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });

//   const onSignInPress = useCallback(async () => {
//     if (!isLoaded) return;

//     try {
//       const signInAttempt = await signIn.create({
//         identifier: form.email,
//         password: form.password,
//       });

//       if (signInAttempt.status === "complete") {
//         await setActive({ session: signInAttempt.createdSessionId });
//         router.replace("/(root)/(tabs)/home");
//       } else {
//         console.log(JSON.stringify(signInAttempt, null, 2));
//         Alert.alert("Error", "Log in failed. Please try again.");
//       }
//     } catch (err) {
//       console.log(JSON.stringify(err, null, 2));
//       Alert.alert("Error", err.errors[0].longMessage);
//     } 
//   }, [isLoaded, form]);

//   return (
//     <ScrollView className="flex-1 bg-gradient-to-b from-blue-400 to-purple-600">
//       <View className="flex-1">
//       <ImageBackground
//     source={require("../../assets/images/bg1.jpg")}
//     className="w-full h-[250px] flex justify-end px-5"
//     resizeMode="cover"
//   >
//         <View className="relative w-full h-[250px] flex justify-end px-5">
//           <Text className="text-4xl text-green-700 font-JakartaSemiBold mb-5">
//             Welcome back
//           </Text>
//         </View>

//         </ImageBackground>

//         <View className="p-5 bg-white rounded-t-3xl shadow-lg">
//           <InputField
//             label="Email"
//             placeholder="Enter email"
//             textContentType="emailAddress"
//             value={form.email}
//             onChangeText={(value) => setForm({ ...form, email: value })}
//           />

//           <InputField
//             label="Password"
//             placeholder="Enter password"
//             secureTextEntry={true}
//             textContentType="password"
//             value={form.password}
//             onChangeText={(value) => setForm({ ...form, password: value })}
//           />

//           <CustomButton
//             title="Sign In"
//             onPress={onSignInPress}
//             className="mt-6 bg-green-700"
            
          

//           />

//           <OAuth />

//           <Link href="/sign-up" className="text-lg text-center text-gray-300 mt-10">
//             Don't have an account? <Text className="text-green-500">Sign Up</Text>
//           </Link>
//         </View>
//         <ImageBackground
//           source={require("../../assets/images/bg4.jpg")} // Replace with your image path
//           className="w-full h-40"
//           resizeMode="cover"
//         />
//       </View>
     
//     </ScrollView>
//   );
// };

// export default SignIn;


import axios from "axios";
import { Link, router } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, ScrollView, Text, View, ImageBackground } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";

const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const onSignInPress = useCallback(async () => {
    try {
      const response = await axios.post("http://192.168.1.6:5000/api/auth/login", {
        email: form.email,
        password: form.password,
      });

      const { access_token, user } = response.data;

      if (!access_token) {
        throw new Error("No access token received");
      }

      await AsyncStorage.setItem("access_token", access_token);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      console.log("Login successful:", response.data);
      router.replace("/(root)/(tabs)/home");

    } catch (err) {
      console.error("Login Error:", err);

      if (err.response) {
        Alert.alert("Error", err.response.data.message || "Login failed. Please try again.");
      } else if (err.message.includes("Network Error")) {
        Alert.alert("Error", "Cannot connect to server. Check internet or backend.");
      } else {
        Alert.alert("Error", err.message || "An error occurred.");
      }
    }
  }, [form]);

  return (
    <ScrollView className="flex-1 bg-gradient-to-b from-blue-400 to-purple-600">
      <View className="flex-1">
        <ImageBackground
          source={require("../../assets/images/bg1.jpg")}
          className="w-full h-[250px] flex justify-end px-5"
          resizeMode="cover"
        >
          <View className="relative w-full h-[250px] flex justify-end px-5">
            <Text className="text-4xl text-green-700 font-JakartaSemiBold mb-5">
              Welcome back
            </Text>
          </View>
        </ImageBackground>

        <View className="p-5 bg-white rounded-t-3xl shadow-lg">
          <InputField
            label="Email"
            placeholder="Enter email"
            textContentType="emailAddress"
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />

          <InputField
            label="Password"
            placeholder="Enter password"
            secureTextEntry={true}
            textContentType="password"
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />

          <CustomButton
            title="Sign In"
            onPress={onSignInPress}
            className="mt-6 bg-green-700"
          />

          <Link href="/sign-up" className="text-lg text-center text-gray-300 mt-10">
            Don't have an account? <Text className="text-green-500">Sign Up</Text>
          </Link>
        </View>
        <ImageBackground
          source={require("../../assets/images/bg4.jpg")}
          className="w-full h-40"
          resizeMode="cover"
        />
      </View>
    </ScrollView>
  );
};

export default SignIn;
