{/* Categories */}
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