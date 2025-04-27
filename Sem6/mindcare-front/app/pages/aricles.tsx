import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { Stack } from "expo-router";  
import { TouchableOpacity } from 'react-native';
import { useRouter } from "expo-router";

const AnxietyDepressionData = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    const url = 'https://anxiety-depression1.p.rapidapi.com/state?limit=500&orderBy=asc&index=0&value=0';
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '1b1a42f6e6mshf7be1b119798ff4p14751cjsn96fee50234ff',
        'x-rapidapi-host': 'anxiety-depression1.p.rapidapi.com'
      }
    };
  
    try {
      const response = await fetch(url, options);
      const result = await response.json();
      console.log('API Response:', result); // 🟢 Debugging: Check what the API returns
      setData(result);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <ActivityIndicator className="flex-1 justify-center" size="large" color="#007bff" />;
  if (error) return <Text className="text-red-500 text-center mt-5">{error}</Text>;

  return (
    <View className="flex-1 p-5 bg-gray-100">
            <Stack.Screen options={{ headerShown: false }} />
            {/* Header */}
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={{ fontSize: 20, fontWeight: "bold", color: "#333" }}>←</Text>
            </TouchableOpacity>
      
      <Text className="text-xl font-bold mb-4 text-gray-800">Anxiety & Depression Data</Text>
      {/* <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View className="p-4 mb-2 bg-white rounded-lg shadow">
            <Text className="text-lg font-semibold text-gray-700">State: {item.state}</Text>
            <Text className="text-md text-gray-600">Value: {item.value}</Text>
          </View>
        )}
      /> */}
      <View className='h-full'>
        <Text className="text-gray-500 text-center justify-center align-middle mt-5">Comming Soon</Text>
      </View>
    </View>
  );
};

export default AnxietyDepressionData;
