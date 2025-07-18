import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CreateNoteScreen from "../screens/CreateNoteScreen";
import InsideNoteScreen from "../screens/InsideNoteScreen";
import LoginScreen from "../screens/LoginScreen";
import NotesDashboardScreen from "../screens/NotesDashboardScreen";
import PantryScreen from "../screens/PantryScreen";
import React from "react";
import { Text, View } from "react-native";
import { useAuth } from "@clerk/clerk-expo";

// Placeholder screens for new features
const RecipesScreen = () => <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text>Recipes</Text></View>;
const NutritionScreen = () => <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text>Nutrition</Text></View>;
const FeedScreen = () => <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text>Feed</Text></View>;
const FriendsScreen = () => <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text>Friends</Text></View>;
const MealPlannerScreen = () => <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text>Meal Planner</Text></View>;

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator initialRouteName="Pantry" screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Pantry" component={PantryScreen} />
      <Tab.Screen name="Recipes" component={RecipesScreen} />
      <Tab.Screen name="MealPlanner" component={MealPlannerScreen} options={{ title: 'Meal Planner' }} />
      <Tab.Screen name="Nutrition" component={NutritionScreen} />
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Friends" component={FriendsScreen} />
    </Tab.Navigator>
  );
}

const Navigation = () => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    // Optionally show a splash/loading screen
    return <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text>Loading...</Text></View>;
  }

  return (
    <NavigationContainer>
      {isSignedIn ? (
        <MainTabs />
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          {/* Legacy/unused screens below */}
          <Stack.Screen name="NotesDashboardScreen" component={NotesDashboardScreen} />
          <Stack.Screen name="InsideNoteScreen" component={InsideNoteScreen} />
          <Stack.Screen name="CreateNoteScreen" component={CreateNoteScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default Navigation;
