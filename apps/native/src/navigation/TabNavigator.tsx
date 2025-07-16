import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PantryScreen from '../screens/PantryScreen';
import RecipesScreen from '../screens/RecipesScreen';
import CalendarScreen from '../screens/CalendarScreen';
import NutritionGoalsScreen from '../screens/NutritionGoalsScreen';
import FriendsScreen from '../screens/FriendsScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home';
          if (route.name === 'Pantry') iconName = 'food-apple';
          if (route.name === 'Recipes') iconName = 'book-open-page-variant';
          if (route.name === 'Calendar') iconName = 'calendar-month';
          if (route.name === 'Nutrition Goals') iconName = 'chart-bar';
          if (route.name === 'Friends') iconName = 'account-group';
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Pantry" component={PantryScreen} />
      <Tab.Screen name="Recipes" component={RecipesScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Nutrition Goals" component={NutritionGoalsScreen} />
      <Tab.Screen name="Friends" component={FriendsScreen} />
    </Tab.Navigator>
  );
} 