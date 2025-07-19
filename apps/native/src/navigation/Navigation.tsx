import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LoginScreen from "../screens/LoginScreen";
import PantryScreen from "../screens/PantryScreen";
import RecipesScreen from "../screens/RecipesScreen";
import MealPlannerScreen from "../screens/MealPlannerScreen";
import NutritionScreen from "../screens/NutritionScreen";
import FeedScreen from "../screens/FeedScreen";
import FriendsScreen from "../screens/FriendsScreen";
import React from "react";
import { Text, View } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import Ionicons from 'react-native-vector-icons/Ionicons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Pantry"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Pantry') iconName = focused ? 'basket' : 'basket-outline';
          else if (route.name === 'Recipes') iconName = focused ? 'book' : 'book-outline';
          else if (route.name === 'MealPlanner') iconName = focused ? 'calendar' : 'calendar-outline';
          else if (route.name === 'Nutrition') iconName = focused ? 'nutrition' : 'nutrition-outline';
          else if (route.name === 'Feed') iconName = focused ? 'people' : 'people-outline';
          else if (route.name === 'Friends') iconName = focused ? 'person-add' : 'person-add-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
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
    return <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text>Loading...</Text></View>;
  }

  return (
    <NavigationContainer>
      {isSignedIn ? (
        <MainTabs />
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default Navigation;
