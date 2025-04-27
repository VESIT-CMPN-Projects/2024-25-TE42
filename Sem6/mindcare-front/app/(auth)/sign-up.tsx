// import { useSignUp } from "@clerk/clerk-expo";
// import { Link, router } from "expo-router";
// import { useState } from "react";
// import { Alert, ScrollView, Text, View } from "react-native";
// import { ReactNativeModal } from "react-native-modal";
// import { ImageBackground } from "react-native";
// import LinearGradient from "react-native-linear-gradient";


// import CustomButton from "@/components/CustomButton";
// import InputField from "@/components/InputField";
// import OAuth from "@/components/OAuth";

// const SignUp = () => {
//   const { isLoaded, signUp, setActive } = useSignUp();
//   const [showSuccessModal, setShowSuccessModal] = useState(false);

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });
//   const [verification, setVerification] = useState({
//     state: "default",
//     error: "",
//     code: "",
//   });

//   // Sign-up function
//   const onSignUpPress = async () => {
//     if (!isLoaded) {
//       Alert.alert("Error", "Sign-up service is not loaded yet. Try again.");
//       return;
//     }

//     try {
//       console.log("Creating user:", form.email);
//       await signUp.create({
//         emailAddress: form.email,
//         password: form.password,
//       });

//       console.log("Preparing email verification...");
//       await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

//       setVerification((prev) => ({
//         ...prev,
//         state: "pending",
//         error: "",
//       }));
//     } catch (err) {
//       console.error("Sign-up Error:", err);
//       Alert.alert("Error", err.errors?.[0]?.longMessage || "Sign-up failed.");
//     }
//   };

//   // Email Verification Function
//   const onPressVerify = async () => {
//     if (!isLoaded) return;
//     try {
//       const completeSignUp = await signUp.attemptEmailAddressVerification({
//         code: verification.code,
//       });
//       if (completeSignUp.status === "complete") {
//         // await fetchAPI("/(api)/user", {
//         //   method: "POST",
//         //   body: JSON.stringify({
//         //     name: form.name,
//         //     email: form.email,
//         //     clerkId: completeSignUp.createdUserId,
//         //   }),
//         // });

//         await setActive({ session: completeSignUp.createdSessionId });
//         setVerification({
//           ...verification,
//           state: "success",
//         });
//       } else {
//         setVerification({
//           ...verification,
//           error: "Verification failed. Please try again.",
//           state: "failed",
//         });
//       }
//     } catch (err: any) {
//       // See https://clerk.com/docs/custom-flows/error-handling
//       // for more info on error handling
//       setVerification({
//         ...verification,
//         error: err.errors[0].longMessage,
//         state: "failed",
//       });
//     }
//   };
//   return (
//     <ScrollView className="flex-1 bg-gradient-to-b from-blue-400 to-purple-600">
//       <View className="flex-1">
//       <ImageBackground
//     source={require("../../assets/images/bg1.jpg")}
//     className="w-full h-[250px] flex justify-end px-5"
//     resizeMode="cover"
//   >
//         <View className="relative w-full h-[250px] flex justify-end ">
//           <Text className="  text-4xl text-green-900 font-JakartaSemiBold mb-5">Create Your Account</Text>
//         </View>
//        </ImageBackground>
       


      

//        <View className="p-5 bg-white rounded-t-3xl shadow-lg">


//           <InputField
//             label="Name"
//             placeholder="Enter name"
//             value={form.name}
//             onChangeText={(value) => setForm({ ...form, name: value })}
//           />
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
//           <CustomButton title="Sign Up" onPress={onSignUpPress} className="mt-6 bg-green-700" />
//           <OAuth />
//           <Link href="/sign-in" className="text-lg text-center text-gray-300 mt-10">
//             Already have an account? <Text className="text-green-600">Log In</Text>
//           </Link>
//         </View>



//          {/* Verification Modal */}
//          <ReactNativeModal
//           isVisible={verification.state === "pending"}
//           onModalHide={() => {
//             if (verification.state === "success") {
//               setShowSuccessModal(true);
//             }
//           }}
//         >
//           <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
//             <Text className="font-JakartaExtraBold text-2xl mb-2">Verification</Text>
//             <Text className="font-Jakarta mb-5">
//               We've sent a verification code to {form.email}.
//             </Text>
//             <InputField
//               label={"Code"}
//               placeholder={"12345"}
//               value={verification.code}
//               keyboardType="numeric"
//               onChangeText={(code) => setVerification({ ...verification, code })}
//             />
//             {verification.error && (
//               <Text className="text-red-500 text-sm mt-1">{verification.error}</Text>
//             )}
//             <CustomButton
//               title="Verify Email"
//               onPress={onPressVerify}
//               className="mt-5 bg-success-500"
//             />
//           </View>
//         </ReactNativeModal>

//         {/* Success Modal */}
//         <ReactNativeModal isVisible={showSuccessModal}>
//           <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
//             <Text className="text-3xl font-JakartaBold text-center">Verified</Text>
//             <Text className="text-base text-gray-400 font-Jakarta text-center mt-2">
//               You have successfully verified your account.
//             </Text>
//             <CustomButton
//               title="Browse Home"
//               onPress={() => {
//                 setShowSuccessModal(false); // Close modal
//                 router.push(`/(root)/(tabs)/home`); // Navigate to home
//               }}
//               className="mt-5"
//             />

//           </View>
//         </ReactNativeModal>
//       </View>
//     </ScrollView>
//   );
// };

// export default SignUp;



import { useState, useEffect } from "react";
import { Alert, ScrollView, Text, View, ImageBackground } from "react-native";
import { Link, router } from "expo-router";
import ReactNativeModal from "react-native-modal";
import axios from "axios";
import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignUp = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [verification, setVerification] = useState({ state: "default", error: "", code: "" });

  useEffect(() => {
    if (verification.state === "pending") {
      console.log("Verification is pending...");
    }
    return () => {
      console.log("Cleaning up...");
    };
  }, [verification.state]);

  const onSignUpPress = async () => {
    try {
      console.log("Creating user:", form.email);

      const response = await axios.post("http://192.168.1.6:5000/api/auth/register", {
        username: form.username,
        email: form.email,
        password: form.password,
      });

      console.log("User created successfully:", response.data);

      // Store token in AsyncStorage
      await AsyncStorage.setItem("user", response.data.user)
      await AsyncStorage.setItem("authToken", response.data.access_token);
      console.log("Token stored:", await AsyncStorage.getItem("access_token"));

      setVerification({ ...verification, state: "pending", error: "" });
      setShowSuccessModal(true);
    } catch (err: any) {
      console.error("Sign-up Error:", err);

      // Show user-friendly error messages
      Alert.alert("Error", err.response?.data?.message || "Sign-up failed. Please try again.");
    }
  };

  return (
    <ScrollView className="flex-1 bg-gradient-to-b from-blue-400 to-purple-600">
      <View className="flex-1">
        <ImageBackground
          source={require("../../assets/images/bg1.jpg")}
          className="w-full h-[250px] flex justify-end px-5"
          resizeMode="cover"
        >
          <View className="relative w-full h-[250px] flex justify-end ">
            <Text className="text-4xl text-green-900 font-JakartaSemiBold mb-5">
              Create Your Account
            </Text>
          </View>
        </ImageBackground>

        <View className="p-5 bg-white rounded-t-3xl shadow-lg">
          <InputField
            label="Name"
            placeholder="Enter name"
            value={form.username}
            onChangeText={(value) => setForm({ ...form, username: value })}
          />
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
            secureTextEntry
            textContentType="password"
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />
          <CustomButton title="Sign Up" onPress={onSignUpPress} className="mt-6 bg-green-700" />

          {/* Uncomment OAuth if needed */}
          {/* <OAuth /> */}

          <Link href="/sign-in" className="text-lg text-center text-gray-600 mt-10">
            Already have an account?{" "}
            <Text className="text-green-600">Log In</Text>
          </Link>
        </View>

        {/* Success Modal */}
        <ReactNativeModal isVisible={showSuccessModal}>
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Text className="text-3xl font-JakartaBold text-center">Verified</Text>
            <Text className="text-base text-gray-400 font-Jakarta text-center mt-2">
              You have successfully created your account.
            </Text>
            <CustomButton
              title="Browse Home"
              onPress={() => {
                setShowSuccessModal(false);
                router.push("/(root)/(tabs)/home");
              }}
              className="mt-5"
            />
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
};

export default SignUp;
