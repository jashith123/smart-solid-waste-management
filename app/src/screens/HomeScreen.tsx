import { View, Text, Button } from "react-native";

export default function HomeScreen({
  navigation,
}: any) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 20,
      }}
    >
      <Text
        style={{
          fontSize: 24,
          textAlign: "center",
          marginBottom: 30,
        }}
      >
        Garbage Detection System
      </Text>

      <Button
        title="Report Garbage"
        onPress={() =>
          navigation.navigate("Report")
        }
      />

      <View
        style={{
          height: 20,
        }}
      />

      <Button
        title="View Reports"
        onPress={() =>
          navigation.navigate("Reports")
        }
      />
    </View>
  );
}