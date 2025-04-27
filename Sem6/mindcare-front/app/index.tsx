// import { useAuth } from "@clerk/clerk-expo";
// import { Redirect } from "expo-router";

// const Page = () => {
//   const { isSignedIn } = useAuth();

//   if (isSignedIn) return <Redirect href="/(root)/(tabs)/home" />;

//   return <Redirect href="/(auth)/welcome" />;
// };

// export default Page;



import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const IndexPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Retrieve the token from AsyncStorage
        const token = await AsyncStorage.getItem("auth_token");

        // If token exists, set authenticated to true
        if (token) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  if (loading) {
    return null; // Can be replaced with a loading spinner
  }

  return isAuthenticated ? (
    <Redirect href="/(root)/(tabs)/home" />
  ) : (
    <Redirect href="/(auth)/welcome" />
  );
};

export default IndexPage;

