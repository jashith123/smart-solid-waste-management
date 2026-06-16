import { useState } from "react";

import { View, Button, Text, Alert } from "react-native";

import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";

import { detectGarbage } from "../services/detectionService";

export default function ReportScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (permission.status !== "granted") {
      Alert.alert("Error", "Camera permission denied");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const submitReport = async () => {
    if (!imageUri) {
      Alert.alert("Error", "Please select an image");
      return;
    }

    const permission = await Location.requestForegroundPermissionsAsync();

    if (permission.status !== "granted") {
      Alert.alert("Error", "Location permission denied");
      return;
    }

    setLoading(true);

    try {
      const location = await Location.getCurrentPositionAsync({});

      const response = await detectGarbage(
        imageUri,
        location.coords.latitude,
        location.coords.longitude,
      );

      Alert.alert(
        "Detection Complete",
        `Garbage Found: ${response.garbage_detected ? "Yes" : "No"}

Garbage Count: ${response.garbage_count}

Confidence: ${(response.highest_confidence * 100).toFixed(1)}%`,
      );

      setImageUri(null);
    } catch (error) {
      console.log(error);

      Alert.alert("Error", "Detection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 20,
      }}
    >
      <Button title="Take Photo" onPress={takePhoto} />

      <View style={{ height: 10 }} />

      <Button title="Select From Gallery" onPress={pickImage} />

      <View style={{ height: 20 }} />

      <Text>{imageUri ? "Image Selected" : "No Image Selected"}</Text>

      <View style={{ height: 20 }} />

      <Button
        title={loading ? "Uploading..." : "Submit Report"}
        disabled={loading}
        onPress={submitReport}
      />
    </View>
  );
}
