import { GoogleGenerativeAI } from "@google/generative-ai";
// import * as Application from "expo-application";
import Constants from "expo-constants";

// Get API key securely
const API_KEY = Constants.expoConfig?.extra?.geminiApiKey;

if (!API_KEY) {
  throw new Error("Missing Gemini API Key configuration");
}

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(API_KEY);

// Define chat history structure
interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

// Store conversation history
let chatHistory: ChatMessage[] = [];

export const getChatbotResponse = async (userMessage: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        maxOutputTokens: 200,
      },
    });

    // Start chat with history
    const chat = model.startChat({
      history: chatHistory,
    });

    // Send message and get response
    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    const text = response.text();

    // Update history
    chatHistory.push({ role: "user", parts: [{ text: userMessage }] });
    chatHistory.push({ role: "model", parts: [{ text }] });

    // Limit response to 2-4 lines
    return text.split("\n").slice(0, 4).join("\n");
  } catch (error) {
    console.error("Error fetching chatbot response:", error);
    return "I'm having trouble responding right now. Could you try again?";
  }
};

export const clearChatHistory = (): void => {
  chatHistory = [];
};

// ✅ Add a default export
export default {
  getChatbotResponse,
  clearChatHistory,
};
