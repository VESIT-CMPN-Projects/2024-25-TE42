// import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
// import { useState, useRef, useEffect } from "react";
// import { LinearGradient } from "expo-linear-gradient";
// import { MotiView } from "moti";
// import { Feather, Octicons } from "@expo/vector-icons";
// import { useClerk } from "@clerk/clerk-expo";
// import * as Linking from "expo-linking";

// // Define types for our component props
// type ProfileFieldProps = {
//   label: string;
//   value: string;
//   onChange: (text: string) => void;
//   multiline?: boolean;
//   isLast?: boolean;
// };

// // Define types for progress items
// type ProgressItem = {
//   id: string;
//   title: string;
//   current: number;
//   target: number;
//   category: "skill" | "goal" | "habit";
//   startDate: string;
//   endDate?: string;
// };

// // Define types for achievements
// type Achievement = {
//   id: string;
//   title: string;
//   description: string;
//   completed: boolean;
//   date?: string;
//   icon: string;
// };

// export default function ProfileScreen() {
//   const { signOut } = useClerk();
//   const [name, setName] = useState<string>("User");
//   const [email, setEmail] = useState<string>("user756@gmail.com");
//   const [hobbies, setHobbies] = useState<string>("Gaming, Reading, Coding");
//   const [profession, setProfession] = useState<string>("Student");
//   const [location, setLocation] = useState<string>("Mumbai, India");
//   const [bio, setBio] = useState<string>("Passionate about coding and technology!");
  
//   // Progress tracking state
//   const [progressItems, setProgressItems] = useState<ProgressItem[]>([
//     {
//       id: "1",
//       title: "Daily Exercises",
//       current: 65,
//       target: 100,
//       category: "skill",
//       startDate: "2023-01-15",
//     },
//     {
//       id: "2",
//       title: "Complete Course",
//       current: 40,
//       target: 100,
//       category: "goal",
//       startDate: "2023-02-10",
//       endDate: "2023-05-30",
//     },
//     {
//       id: "3",
//       title: "Read Articles",
//       current: 85,
//       target: 100,
//       category: "habit",
//       startDate: "2023-01-01",
//     },
//   ]);
  
//   const [achievements, setAchievements] = useState<Achievement[]>([
//     {
//       id: "1",
//       title: "First Project",
//       description: "Completed your first coding project",
//       completed: true,
//       date: "2022-12-10",
//       icon: "trophy",
//     },
//     {
//       id: "2",
//       title: "Consistent Learner",
//       description: "Studied for 7 days in a row",
//       completed: true,
//       date: "2023-01-07",
//       icon: "flame",
//     },
//     {
//       id: "3",
//       title: "Networking Pro",
//       description: "Connected with 50+ professionals",
//       completed: false,
//       icon: "people",
//     },
//   ]);

//   // Calculate profile completion percentage
//   const [profileCompletion, setProfileCompletion] = useState<number>(0);
  
//   useEffect(() => {
//     // Calculate profile completion based on filled fields
//     const fields = [name, email, hobbies, profession, location, bio];
//     const filledFields = fields.filter(field => field.trim() !== "").length;
//     const completionPercentage = Math.round((filledFields / fields.length) * 100);
//     setProfileCompletion(completionPercentage);
//   }, [name, email, hobbies, profession, location, bio]);

//   const [showButton, setShowButton] = useState<boolean>(false);
//   const scrollViewRef = useRef<ScrollView>(null);

//   const handleScroll = (event: any) => {
//     const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
//     const isBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
//     setShowButton(isBottom);
//   };

//   const confirmSignOut = () => {
//     Alert.alert("Sign Out", "Are you sure you want to sign out?", [
//       { text: "Cancel", style: "cancel" },
//       { text: "Sign Out", style: "destructive", onPress: handleSignOut }
//     ]);
//   };

//   const handleSignOut = async () => {
//     try {
//       await signOut();
//       Linking.openURL(Linking.createURL("/"));
//     } catch (err) {
//       console.error(JSON.stringify(err, null, 2));
//     }
//   };
  
//   const updateProgress = (id: string, newValue: number) => {
//     setProgressItems(prev => 
//       prev.map(item => 
//         item.id === id ? { ...item, current: Math.min(newValue, item.target) } : item
//       )
//     );
//   };
  
//   const toggleAchievement = (id: string) => {
//     setAchievements(prev => 
//       prev.map(item => {
//         if (item.id === id) {
//           const completed = !item.completed;
//           return { 
//             ...item, 
//             completed,
//             date: completed ? new Date().toISOString().split('T')[0] : undefined
//           };
//         }
//         return item;
//       })
//     );
//   };

//   const ProfileField = ({
//     label,
//     value,
//     onChange,
//     multiline = false,
//     isLast = false,
//   }: ProfileFieldProps) => (
//     <View className={`bg-[#EFDFBB]/20 p-3 rounded-xl shadow-sm mt-2 border border-[#EFDFBB]/30 ${isLast ? "mb-4" : ""}`}>
//       <Text className="text-gray-700 text-sm font-semibold">{label}</Text>
//       <View className="flex-row items-center mt-2">
//         <TextInput
//           value={value}
//           onChangeText={onChange}
//           multiline={multiline}
//           className="flex-1 text-lg text-gray-800"
//           placeholder={`Enter your ${label.toLowerCase()}`}
//         />
//         <Feather name="edit-3" size={18} color="gray" />
//       </View>
//     </View>
//   );
  
//   const ProgressBar = ({ progress }: { progress: number }) => (
//     <View className="h-2 bg-[#EFDFBB]/30 rounded-full w-full mt-1">
//       <View 
//         className="h-full bg-[#F66345] rounded-full" 
//         style={{ width: `${progress}%` }} 
//       />
//     </View>
//   );
  
//   const ProgressCard = ({ item, onUpdate }: { item: ProgressItem, onUpdate: (id: string, value: number) => void }) => (
//     <View className="bg-[#EFDFBB]/20 p-4 rounded-xl shadow-sm mb-3 border border-[#EFDFBB]/30">
//       <View className="flex-row justify-between items-center">
//         <Text className="text-gray-800 font-medium">{item.title}</Text>
//         <View className="bg-[#F66345]/20 px-2 py-1 rounded-lg">
//           <Text className="text-[#F66345] text-xs font-medium">{item.category}</Text>
//         </View>
//       </View>
      
//       <View className="flex-row justify-between items-center mt-2">
//         <Text className="text-gray-600 text-sm">{item.current}%</Text>
//         <Text className="text-gray-600 text-sm">Target: {item.target}%</Text>
//       </View>
      
//       <ProgressBar progress={item.current} />
      
//       <View className="flex-row justify-between mt-3">
//         <TouchableOpacity 
//           onPress={() => onUpdate(item.id, Math.max(0, item.current - 5))}
//           className="bg-[#EFDFBB]/40 w-10 h-10 rounded-full items-center justify-center"
//         >
//           <Feather name="minus" size={18} color="#F66345" />
//         </TouchableOpacity>
        
//         <TouchableOpacity 
//           onPress={() => onUpdate(item.id, Math.min(100, item.current + 5))}
//           className="bg-[#EFDFBB]/40 w-10 h-10 rounded-full items-center justify-center"
//         >
//           <Feather name="plus" size={18} color="#F66345" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
  
//   const AchievementCard = ({ item, onToggle }: { item: Achievement, onToggle: (id: string) => void }) => (
//     <TouchableOpacity 
//       onPress={() => onToggle(item.id)}
//       className={`flex-row items-center p-3 rounded-xl mb-2 ${
//         item.completed ? "bg-[#F66345]/10" : "bg-[#EFDFBB]/20"
//       } border border-[#EFDFBB]/30`}
//     >
//       <View className={`w-10 h-10 rounded-full items-center justify-center ${
//         item.completed ? "bg-[#F66345]/20" : "bg-[#EFDFBB]/40"
//       }`}>
//         <Octicons 
//           name={item.icon as any} 
//           size={20} 
//           color={item.completed ? "#F66345" : "#8B7E6A"} 
//         />
//       </View>
      
//       <View className="ml-3 flex-1">
//         <Text className={`font-medium ${item.completed ? "text-[#F66345]" : "text-gray-800"}`}>
//           {item.title}
//         </Text>
//         <Text className="text-gray-600 text-sm">{item.description}</Text>
//         {item.date && (
//           <Text className="text-gray-500 text-xs mt-1">Completed on {item.date}</Text>
//         )}
//       </View>
      
//       {item.completed && (
//         <Feather name="check-circle" size={20} color="#F66345" />
//       )}
//     </TouchableOpacity>
//   );

//   const profileFields = [
//     { label: "Name", value: name, onChange: setName },
//     { label: "Email", value: email, onChange: setEmail },
//     { label: "Hobbies", value: hobbies, onChange: setHobbies },
//     { label: "Profession", value: profession, onChange: setProfession },
//     { label: "Location", value: location, onChange: setLocation },
//     { label: "Bio", value: bio, onChange: setBio, multiline: true },
//   ];

//   return (
//     <View className="flex-1 bg-[#EFDFBB]">
//       <View className="flex-1 pb-12">
//         <View className="flex-row justify-between items-center px-6 pt-12 bg-[#F66345]">
//           <Text className="text-white text-3xl font-bold">Profile</Text>
//           <TouchableOpacity onPress={confirmSignOut} className="flex-row items-center p-2">
//             <Feather name="log-out" size={20} color="white" />
//             <Text className="text-white text-lg ml-2">Sign Out</Text>
//           </TouchableOpacity>
//         </View>

//         <ScrollView
//           ref={scrollViewRef}
//           className="flex-1 px-6 pb-4"
//           contentContainerStyle={{ paddingBottom: 100 }}
//           onScroll={handleScroll}
//           scrollEventThrottle={16}
//         >
//           <MotiView
//             from={{ opacity: 0, translateY: -50 }}
//             animate={{ opacity: 1, translateY: 0 }}
//             transition={{ type: "spring", stiffness: 100 }}
//             className="flex items-center mb-5 bg-[#F66345] pb-8 -mx-6 rounded-b-3xl shadow-md"
//           >
//             <View className="w-28 h-28 rounded-full border-4 border-white flex items-center justify-center overflow-hidden mt-2">
//               <Image source={{ uri: "https://via.placeholder.com/150" }} className="w-24 h-24 rounded-full" />
//             </View>

//             <Text className="text-3xl font-bold mt-4 text-white">Hello, {name.split(" ")[0]}!</Text>
//             <Text className="text-white text-lg mb-3">Welcome to your profile</Text>
            
//             {/* Profile completion indicator */}
//             <View className="w-4/5 mt-2">
//               <View className="flex-row justify-between">
//                 <Text className="text-white text-sm">Profile Completion</Text>
//                 <Text className="text-white text-sm font-bold">{profileCompletion}%</Text>
//               </View>
//               <View className="h-2 bg-white/30 rounded-full w-full mt-1">
//                 <View 
//                   className="h-full bg-white rounded-full" 
//                   style={{ width: `${profileCompletion}%` }} 
//                 />
//               </View>
//             </View>
//           </MotiView>

//           <MotiView
//             from={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay: 0.2, duration: 0.5 }}
//           >
//             {/* Section headers with minimalist design */}
//             <View className="mt-4 mb-2">
//               <Text className="text-xl font-bold text-gray-800">Personal Information</Text>
//               <View className="h-1 w-12 bg-[#F66345] rounded-full mt-1" />
//             </View>
            
//             {profileFields.map((field, index) => (
//               <ProfileField
//                 key={field.label}
//                 label={field.label}
//                 value={field.value}
//                 onChange={field.onChange}
//                 multiline={field.multiline}
//                 isLast={index === profileFields.length - 1}
//               />
//             ))}
            
//             {/* Progress Tracking Section */}
//             <View className="mt-8 mb-2">
//               <Text className="text-xl font-bold text-gray-800">Progress Tracking</Text>
//               <View className="h-1 w-12 bg-[#F66345] rounded-full mt-1" />
//             </View>
            
//             {progressItems.map(item => (
//               <ProgressCard 
//                 key={item.id} 
//                 item={item} 
//                 onUpdate={updateProgress} 
//               />
//             ))}
            
//             {/* Achievements Section */}
//             <View className="mt-8 mb-2">
//               <Text className="text-xl font-bold text-gray-800">Achievements</Text>
//               <View className="h-1 w-12 bg-[#F66345] rounded-full mt-1" />
//             </View>
            
//             {achievements.map(item => (
//               <AchievementCard 
//                 key={item.id} 
//                 item={item} 
//                 onToggle={toggleAchievement} 
//               />
//             ))}
            
//             {/* Add New Progress Item Button */}
//             <TouchableOpacity 
//               className="mt-6 bg-[#EFDFBB]/40 p-4 rounded-xl border border-dashed border-[#F66345]/50 items-center"
//               onPress={() => Alert.alert("Coming Soon", "This feature will be available in the next update!")}
//             >
//               <Feather name="plus-circle" size={24} color="#F66345" />
//               <Text className="text-[#722F37] mt-2 font-medium">Add New Goal or Skill</Text>
//             </TouchableOpacity>
//           </MotiView>
//         </ScrollView>
//       </View>

//       {showButton && (
//         <View className="absolute bottom-10 left-0 right-0 mb-5 flex items-center">
//           <TouchableOpacity 
//             className="w-11/12 rounded-full shadow-lg overflow-hidden"
//             onPress={() => Alert.alert("Success", "Your profile has been updated successfully!")}
//           >
//             <LinearGradient colors={["#F66345", "#D9534F"]} className="py-3 px-8 flex items-center">
//               <Text className="text-white font-bold text-lg">Save Changes</Text>
//             </LinearGradient>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );
// }



// -----------------------------------------------------------------------



import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import { useState, useRef, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { Feather, Octicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";

// Define types for our component props
type ProfileFieldProps = {
  label: string;
  value: string;
  onChange: (text: string) => void;
  multiline?: boolean;
  isLast?: boolean;
};

// Define types for progress items
type ProgressItem = {
  id: string;
  title: string;
  current: number;
  target: number;
  category: "skill" | "goal" | "habit";
  startDate: string;
  endDate?: string;
};

// Define types for achievements
type Achievement = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  date?: string;
  icon: string;
};

export default function ProfileScreen() {
  const [name, setName] = useState<string>("User");
  const [email, setEmail] = useState<string>("user756@gmail.com");
  const [hobbies, setHobbies] = useState<string>("Gaming, Reading, Coding");
  const [profession, setProfession] = useState<string>("Student");
  const [location, setLocation] = useState<string>("Mumbai, India");
  const [bio, setBio] = useState<string>("Passionate about coding and technology!");

  // Progress tracking state
  const [progressItems, setProgressItems] = useState<ProgressItem[]>([
    {
      id: "1",
      title: "Daily Exercises",
      current: 65,
      target: 100,
      category: "skill",
      startDate: "2023-01-15",
    },
    {
      id: "2",
      title: "Complete Course",
      current: 40,
      target: 100,
      category: "goal",
      startDate: "2023-02-10",
      endDate: "2023-05-30",
    },
    {
      id: "3",
      title: "Read Articles",
      current: 85,
      target: 100,
      category: "habit",
      startDate: "2023-01-01",
    },
  ]);

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "1",
      title: "First Project",
      description: "Completed your first coding project",
      completed: true,
      date: "2022-12-10",
      icon: "trophy",
    },
    {
      id: "2",
      title: "Consistent Learner",
      description: "Studied for 7 days in a row",
      completed: true,
      date: "2023-01-07",
      icon: "flame",
    },
    {
      id: "3",
      title: "Networking Pro",
      description: "Connected with 50+ professionals",
      completed: false,
      icon: "people",
    },
  ]);

  // Calculate profile completion percentage
  const [profileCompletion, setProfileCompletion] = useState<number>(0);

  useEffect(() => {
    // Calculate profile completion based on filled fields
    const fields = [name, email, hobbies, profession, location, bio];
    const filledFields = fields.filter(field => field.trim() !== "").length;
    const completionPercentage = Math.round((filledFields / fields.length) * 100);
    setProfileCompletion(completionPercentage);
  }, [name, email, hobbies, profession, location, bio]);

  const [showButton, setShowButton] = useState<boolean>(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    setShowButton(isBottom);
  };

  const confirmSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: handleSignOut }
    ]);
  };

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      // Redirect to the login screen or any other screen as needed
      // Example: router.replace("/(auth)/sign-in");
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  const updateProgress = (id: string, newValue: number) => {
    setProgressItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, current: Math.min(newValue, item.target) } : item
      )
    );
  };

  const toggleAchievement = (id: string) => {
    setAchievements(prev =>
      prev.map(item => {
        if (item.id === id) {
          const completed = !item.completed;
          return {
            ...item,
            completed,
            date: completed ? new Date().toISOString().split('T')[0] : undefined
          };
        }
        return item;
      })
    );
  };

  const ProfileField = ({
    label,
    value,
    onChange,
    multiline = false,
    isLast = false,
  }: ProfileFieldProps) => (
    <View className={`bg-[#EFDFBB]/20 p-3 rounded-xl shadow-sm mt-2 border border-[#EFDFBB]/30 ${isLast ? "mb-4" : ""}`}>
      <Text className="text-gray-700 text-sm font-semibold">{label}</Text>
      <View className="flex-row items-center mt-2">
        <TextInput
          value={value}
          onChangeText={onChange}
          multiline={multiline}
          className="flex-1 text-lg text-gray-800"
          placeholder={`Enter your ${label.toLowerCase()}`}
        />
        <Feather name="edit-3" size={18} color="gray" />
      </View>
    </View>
  );

  const ProgressBar = ({ progress }: { progress: number }) => (
    <View className="h-2 bg-[#EFDFBB]/30 rounded-full w-full mt-1">
      <View
        className="h-full bg-[#F66345] rounded-full"
        style={{ width: `${progress}%` }}
      />
    </View>
  );

  const ProgressCard = ({ item, onUpdate }: { item: ProgressItem, onUpdate: (id: string, value: number) => void }) => (
    <View className="bg-[#EFDFBB]/20 p-4 rounded-xl shadow-sm mb-3 border border-[#EFDFBB]/30">
      <View className="flex-row justify-between items-center">
        <Text className="text-gray-800 font-medium">{item.title}</Text>
        <View className="bg-[#F66345]/20 px-2 py-1 rounded-lg">
          <Text className="text-[#F66345] text-xs font-medium">{item.category}</Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center mt-2">
        <Text className="text-gray-600 text-sm">{item.current}%</Text>
        <Text className="text-gray-600 text-sm">Target: {item.target}%</Text>
      </View>

      <ProgressBar progress={item.current} />

      <View className="flex-row justify-between mt-3">
        <TouchableOpacity
          onPress={() => onUpdate(item.id, Math.max(0, item.current - 5))}
          className="bg-[#EFDFBB]/40 w-10 h-10 rounded-full items-center justify-center"
        >
          <Feather name="minus" size={18} color="#F66345" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onUpdate(item.id, Math.min(100, item.current + 5))}
          className="bg-[#EFDFBB]/40 w-10 h-10 rounded-full items-center justify-center"
        >
          <Feather name="plus" size={18} color="#F66345" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const AchievementCard = ({ item, onToggle }: { item: Achievement, onToggle: (id: string) => void }) => (
    <TouchableOpacity
      onPress={() => onToggle(item.id)}
      className={`flex-row items-center p-3 rounded-xl mb-2 ${
        item.completed ? "bg-[#F66345]/10" : "bg-[#EFDFBB]/20"
      } border border-[#EFDFBB]/30`}
    >
      <View className={`w-10 h-10 rounded-full items-center justify-center ${
        item.completed ? "bg-[#F66345]/20" : "bg-[#EFDFBB]/40"
      }`}>
        <Octicons
          name={item.icon as any}
          size={20}
          color={item.completed ? "#F66345" : "#8B7E6A"}
        />
      </View>

      <View className="ml-3 flex-1">
        <Text className={`font-medium ${item.completed ? "text-[#F66345]" : "text-gray-800"}`}>
          {item.title}
        </Text>
        <Text className="text-gray-600 text-sm">{item.description}</Text>
        {item.date && (
          <Text className="text-gray-500 text-xs mt-1">Completed on {item.date}</Text>
        )}
      </View>

      {item.completed && (
        <Feather name="check-circle" size={20} color="#F66345" />
      )}
    </TouchableOpacity>
  );

  const profileFields = [
    { label: "Name", value: name, onChange: setName },
    { label: "Email", value: email, onChange: setEmail },
    { label: "Hobbies", value: hobbies, onChange: setHobbies },
    { label: "Profession", value: profession, onChange: setProfession },
    { label: "Location", value: location, onChange: setLocation },
    { label: "Bio", value: bio, onChange: setBio, multiline: true },
  ];

  return (
    <View className="flex-1 bg-[#EFDFBB]">
      <View className="flex-1 pb-12">
        <View className="flex-row justify-between items-center px-6 pt-12 bg-[#F66345]">
          <Text className="text-white text-3xl font-bold">Profile</Text>
          <TouchableOpacity onPress={confirmSignOut} className="flex-row items-center p-2">
            <Feather name="log-out" size={20} color="white" />
            <Text className="text-white text-lg ml-2">Sign Out</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-6 pb-4"
          contentContainerStyle={{ paddingBottom: 100 }}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <MotiView
            from={{ opacity: 0, translateY: -50 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="flex items-center mb-5 bg-[#F66345] pb-8 -mx-6 rounded-b-3xl shadow-md"
          >
            <View className="w-28 h-28 rounded-full border-4 border-white flex items-center justify-center overflow-hidden mt-2">
              <Image source={{ uri: "https://via.placeholder.com/150" }} className="w-24 h-24 rounded-full" />
            </View>

            <Text className="text-3xl font-bold mt-4 text-white">Hello, {name.split(" ")[0]}!</Text>
            <Text className="text-white text-lg mb-3">Welcome to your profile</Text>

            {/* Profile completion indicator */}
            <View className="w-4/5 mt-2">
              <View className="flex-row justify-between">
                <Text className="text-white text-sm">Profile Completion</Text>
                <Text className="text-white text-sm font-bold">{profileCompletion}%</Text>
              </View>
              <View className="h-2 bg-white/30 rounded-full w-full mt-1">
                <View
                  className="h-full bg-white rounded-full"
                  style={{ width: `${profileCompletion}%` }}
                />
              </View>
            </View>
          </MotiView>

          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {/* Section headers with minimalist design */}
            <View className="mt-4 mb-2">
              <Text className="text-xl font-bold text-gray-800">Personal Information</Text>
              <View className="h-1 w-12 bg-[#F66345] rounded-full mt-1" />
            </View>

            {profileFields.map((field, index) => (
              <ProfileField
                key={field.label}
                label={field.label}
                value={field.value}
                onChange={field.onChange}
                multiline={field.multiline}
                isLast={index === profileFields.length - 1}
              />
            ))}

            {/* Progress Tracking Section */}
            <View className="mt-8 mb-2">
              <Text className="text-xl font-bold text-gray-800">Progress Tracking</Text>
              <View className="h-1 w-12 bg-[#F66345] rounded-full mt-1" />
            </View>

            {progressItems.map(item => (
              <ProgressCard
                key={item.id}
                item={item}
                onUpdate={updateProgress}
              />
            ))}

            {/* Achievements Section */}
            <View className="mt-8 mb-2">
              <Text className="text-xl font-bold text-gray-800">Achievements</Text>
              <View className="h-1 w-12 bg-[#F66345] rounded-full mt-1" />
            </View>

            {achievements.map(item => (
              <AchievementCard
                key={item.id}
                item={item}
                onToggle={toggleAchievement}
              />
            ))}

            {/* Add New Progress Item Button */}
            <TouchableOpacity
              className="mt-6 bg-[#EFDFBB]/40 p-4 rounded-xl border border-dashed border-[#F66345]/50 items-center"
              onPress={() => Alert.alert("Coming Soon", "This feature will be available in the next update!")}
            >
              <Feather name="plus-circle" size={24} color="#F66345" />
              <Text className="text-[#722F37] mt-2 font-medium">Add New Goal or Skill</Text>
            </TouchableOpacity>
          </MotiView>
        </ScrollView>
      </View>

      {showButton && (
        <View className="absolute bottom-10 left-0 right-0 mb-5 flex items-center">
          <TouchableOpacity
            className="w-11/12 rounded-full shadow-lg overflow-hidden"
            onPress={() => Alert.alert("Success", "Your profile has been updated successfully!")}
          >
            <LinearGradient colors={["#F66345", "#D9534F"]} className="py-3 px-8 flex items-center">
              <Text className="text-white font-bold text-lg">Save Changes</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
