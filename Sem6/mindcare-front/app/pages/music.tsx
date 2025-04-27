import React, { useState, useEffect } from "react";
import { View, Text, Image, FlatList, TouchableOpacity, ActivityIndicator, TextInput } from "react-native";
import { Audio } from "expo-av";
import { useRouter } from "expo-router";
const API_URL = "https://api.deezer.com/chart"; // Replace with your preferred music API
import { Stack } from "expo-router"; 
import { ImageBackground } from "react-native";

const MusicScreen = () => {
  const router = useRouter();
  const [songs, setSongs] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setSongs(data.tracks.data);
        setFilteredSongs(data.tracks.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching music:", error);
        setLoading(false);
      }
    };

    fetchMusic();
  }, []);

  useEffect(() => {
    if (search) {
      setFilteredSongs(
        songs.filter((song) =>
          song.title.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setFilteredSongs(songs);
    }
  }, [search, songs]);

  const playSound = async (url) => {
    if (sound) {
      await sound.unloadAsync();
    }

    const { sound: newSound } = await Audio.Sound.createAsync({ uri: url });
    setSound(newSound);
    setCurrentTrack(url);
    setIsPlaying(true);
    await newSound.playAsync();
  };

  const togglePlayPause = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <View className="flex-1 bg-white px-5">
      <View className="-mx-5">
      <ImageBackground
      source={require("../../assets/images/musicbg.jpg")}
      className="w-full h-[150px] justify-center items-center"
      resizeMode="cover"
    >
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          position: "absolute",
          top: 20,
          left: 15,
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          padding: 8,
          borderRadius: 5,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#333" }}>←</Text>
      </TouchableOpacity>

      {/* Text Overlay */}
      <View className="absolute top-1/2 left-0 right-0 items-center">
        <Text className="text-2xl font-bold text-white">Calm your mind</Text>
      </View>

      <Stack.Screen options={{ headerShown: false }} />
    </ImageBackground>
      </View>
      {/* Header */}
      <Text className="text-white text-2xl font-bold mb-5 text-center">Music</Text>

      {/* Search Bar */}
      <TextInput
        className="bg-blue-50 text-white p-3 rounded-lg mb-5"
        placeholder="Search for songs..."
        placeholderTextColor="#aaa"
        value={search}
        onChangeText={(text) => setSearch(text)}
      />

      {/* Loading Indicator */}
      {loading ? (
        <ActivityIndicator size="large" color="white" />
      ) : (
        <FlatList
          data={filteredSongs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="flex-row items-center p-3 mb-3 bg-gray-300 rounded-lg"
              onPress={() => playSound(item.preview)}
            >
              <Image source={{ uri: item.album.cover_medium }} className="w-16 h-16 rounded-lg" />
              <View className="ml-3 flex-1">
                <Text className="text-black font-bold">{item.title}</Text>
                <Text className="text-gray-600">{item.artist.name}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Music Controls */}
      {currentTrack && (
        <View className="absolute bottom-5 left-0 right-0 bg-gray-500 p-4 rounded-lg mx-5 flex-row justify-between items-center">
          <TouchableOpacity onPress={togglePlayPause}>
            <Text className="text-white text-lg">{isPlaying ? "⏸" : "▶"}</Text>
          </TouchableOpacity>
          <Text className="text-white text-center flex-1">Now Playing</Text>
          <TouchableOpacity>
            <Text className="text-white text-lg">⏭</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default MusicScreen;
