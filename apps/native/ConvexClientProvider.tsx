import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useEffect } from "react";

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  throw new Error("EXPO_PUBLIC_CONVEX_URL is not defined");
}
const convex = new ConvexReactClient(convexUrl);

export default function ConvexClientProvider({ children }) {
  useEffect(() => {
    console.log("ConvexClientProvider mounted");
  }, []);

  try {
    return (
      <ClerkProvider publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          {children}
        </ConvexProviderWithClerk>
      </ClerkProvider>
    );
  } catch (error) {
    console.error("Error in ConvexClientProvider:", error);
    throw error; // Rethrow to make the error visible in the dev console
  }
}