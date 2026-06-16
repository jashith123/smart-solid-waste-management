import { NavigationContainer } from "@react-navigation/native";

import { createNativeStackNavigator }
from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";

import ReportScreen from "../screens/ReportScreen";

import ReportsScreen from "../screens/ReportsScreen";

import ReportDetailsScreen from "../screens/ReportDetailsScreen";

const Stack =
  createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />

        <Stack.Screen
          name="Report"
          component={ReportScreen}
        />

        <Stack.Screen
          name="Reports"
          component={ReportsScreen}
        />

        <Stack.Screen
          name="ReportDetails"
          component={ReportDetailsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}