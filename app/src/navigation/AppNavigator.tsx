import { NavigationContainer } from "@react-navigation/native";

import { createNativeStackNavigator }
from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";

import ReportScreen from "../screens/ReportScreen";

import ReportsScreen from "../screens/ReportsScreen";

import ReportDetailsScreen from "../screens/ReportDetailsScreen";

import { colors } from "../theme";

const Stack =
  createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.textOnPrimary,
          headerTitleStyle: { fontWeight: "700" },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Report"
          component={ReportScreen}
          options={{ title: "Report Garbage" }}
        />

        <Stack.Screen
          name="Reports"
          component={ReportsScreen}
          options={{ title: "All Reports" }}
        />

        <Stack.Screen
          name="ReportDetails"
          component={ReportDetailsScreen}
          options={{ title: "Report Details" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}