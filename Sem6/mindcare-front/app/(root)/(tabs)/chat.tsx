import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { getChatbotResponse, clearChatHistory } from "../../services/giminiService";

const { width } = Dimensions.get("window");
const HISTORY_WIDTH = width * 0.7;

interface Message {
  text: string;
  sender: "user" | "bot";
}

const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [historyVisible, setHistoryVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const historyOffset = useSharedValue(-HISTORY_WIDTH);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const historyStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: historyOffset.value }],
  }));

  const toggleHistory = () => {
    historyOffset.value = withTiming(
      historyVisible ? -HISTORY_WIDTH : 0,
      { duration: 300 }
    );
    setHistoryVisible(!historyVisible);
  };

  const sendMessage = async () => {
    if (input.trim() === "" || loading) return;
    
    const userMessage: Message = { text: input, sender: "user" };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const botResponse = await getChatbotResponse(input);
      setMessages(prev => [...prev, { 
        text: botResponse, 
        sender: "bot" 
      }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { 
        text: "Sorry, I'm having trouble responding. Please try again.", 
        sender: "bot" 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    clearChatHistory();
    setMessages([]);
    toggleHistory();
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (historyVisible) {
          toggleHistory();
        } else {
          Keyboard.dismiss();
        }
      }}
    >
      <SafeAreaView className="flex-1 bg-[#EFDFBB]">
        {/* Sidebar (Chat History) */}
        <Animated.View
          style={[historyStyle, { width: HISTORY_WIDTH }]}
          className="absolute left-0 top-0 bottom-0 bg-[#EFDFBB] p-4 z-10 shadow-lg rounded-r-lg"
        >
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-[#F66345] text-lg font-semibold mt-10">Chat History</Text>
            <TouchableOpacity onPress={handleClearHistory}>
              <Text className="text-[#F66345] text-sm">Clear</Text>
            </TouchableOpacity>
          </View>
          <ScrollView className="space-y-2">
            {messages
              .filter((msg) => msg.sender === "user")
              .map((msg, index) => (
                <View
                  key={index}
                  className="bg-white p-2 rounded-md shadow-sm"
                >
                  <Text className="text-[#F66345] text-sm">{msg.text}</Text>
                </View>
              ))}
          </ScrollView>
        </Animated.View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 p-4 justify-between"
        >
          {/* Sidebar Toggle Button */}
          <TouchableOpacity
            onPress={toggleHistory}
            className="absolute left-2 top-4 bg-white p-2 rounded shadow-md z-20"
          >
            <Text className="text-[#F66345] text-lg">☰</Text>
          </TouchableOpacity>

          {/* Chat Messages */}
          <ScrollView
            ref={scrollViewRef}
            className="flex-1 mt-12 mb-2"
            onContentSizeChange={() => 
              scrollViewRef.current?.scrollToEnd({ animated: true })
            }
          >
            {messages.map((msg, index) => (
              <View
                key={index}
                className={`max-w-[75%] p-3 mb-2 rounded-lg ${
                  msg.sender === "user"
                    ? "bg-[#F66345] self-end"
                    : "bg-white self-start"
                }`}
              >
                <Text
                  className={msg.sender === "user" ? "text-white" : "text-[#F66345]"}
                >
                  {msg.text}
                </Text>
              </View>
            ))}
          </ScrollView>

          {/* Chat Input */}
          <View className="flex-row bg-[#F5E3BB] p-3 rounded-lg shadow-md mb-4">
            <TextInput
              className="flex-1 text-[#F66345] px-3"
              placeholder="Type a message..."
              placeholderTextColor="#F66345"
              value={input}
              onChangeText={setInput}
              onSubmitEditing={sendMessage}
              editable={!loading}
              returnKeyType="send"
            />
            <TouchableOpacity
              onPress={sendMessage}
              className="bg-[#F66345] p-3 rounded-lg"
              disabled={loading || input.trim() === ""}
            >
              <Text className="text-white text-lg">
                {loading ? "..." : "➤"}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default ChatScreen;