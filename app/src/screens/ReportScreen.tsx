import { useState } from "react";

import {
  View,
  Text,
  Alert,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";

import { detectGarbage } from "../services/detectionService";
import { DetectionResponse } from "../types/detection";

import AppButton from "../components/AppButton";
import ConfidenceBar from "../components/ConfidenceBar";
import { colors, radius, shadow, spacing } from "../theme";

export default function ReportScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DetectionResponse | null>(null);

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!res.canceled) {
      setImageUri(res.assets[0].uri);
      setResult(null);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (permission.status !== "granted") {
      Alert.alert("Permission needed", "Camera permission denied");
      return;
    }

    const res = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!res.canceled) {
      setImageUri(res.assets[0].uri);
      setResult(null);
    }
  };

  const submitReport = async () => {
    if (!imageUri) {
      Alert.alert("No image", "Please select or capture an image first");
      return;
    }

    const permission = await Location.requestForegroundPermissionsAsync();

    if (permission.status !== "granted") {
      Alert.alert("Permission needed", "Location permission denied");
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

      setResult(response);
    } catch (error) {
      console.log(error);
      Alert.alert("Detection failed", "Could not reach the server. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImageUri(null);
    setResult(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.body}>
      <View style={styles.previewCard}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.preview} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="image-outline" size={56} color={colors.textMuted} />
            <Text style={styles.placeholderText}>No image selected</Text>
            <Text style={styles.placeholderHint}>
              Take a photo or choose one from your gallery
            </Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <View style={styles.actionHalf}>
          <AppButton title="Camera" icon="camera" onPress={takePhoto} />
        </View>
        <View style={styles.gap} />
        <View style={styles.actionHalf}>
          <AppButton
            title="Gallery"
            icon="images"
            variant="secondary"
            onPress={pickImage}
          />
        </View>
      </View>

      <View style={styles.submitWrap}>
        <AppButton
          title={loading ? "Analyzing…" : "Submit & Detect"}
          icon={loading ? undefined : "scan"}
          loading={loading}
          disabled={!imageUri}
          onPress={submitReport}
        />
      </View>

      {result && (
        <View
          style={[
            styles.resultCard,
            {
              backgroundColor: result.garbage_detected
                ? colors.resolvedSoft
                : colors.pendingSoft,
            },
          ]}
        >
          <View style={styles.resultTitleRow}>
            <Ionicons
              name={result.garbage_detected ? "checkmark-circle" : "alert-circle"}
              size={24}
              color={result.garbage_detected ? colors.resolved : colors.pending}
            />
            <Text style={styles.resultTitle}>
              {result.garbage_detected ? "Garbage Detected" : "No Garbage Detected"}
            </Text>
          </View>

          <View style={styles.resultRow}>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>{result.garbage_count}</Text>
              <Text style={styles.metricLabel}>Items</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>#{result.report_id}</Text>
              <Text style={styles.metricLabel}>Report ID</Text>
            </View>
          </View>

          <View style={styles.confidenceWrap}>
            <ConfidenceBar value={result.highest_confidence} />
          </View>

          <Text style={styles.savedNote}>
            Saved to reports. View it in the Reports list to see the annotated image.
          </Text>

          <View style={{ marginTop: spacing.md }}>
            <AppButton title="Report Another" variant="secondary" onPress={reset} />
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  body: {
    padding: spacing.lg,
  },
  previewCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    overflow: "hidden",
    ...shadow.card,
  },
  preview: {
    width: "100%",
    height: 280,
  },
  placeholder: {
    height: 280,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginTop: spacing.md,
  },
  placeholderHint: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: spacing.xs,
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    marginTop: spacing.lg,
  },
  actionHalf: {
    flex: 1,
  },
  gap: {
    width: spacing.md,
  },
  submitWrap: {
    marginTop: spacing.md,
  },
  resultCard: {
    marginTop: spacing.xl,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  resultTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
    marginLeft: spacing.sm,
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.lg,
  },
  metric: {
    flex: 1,
    alignItems: "center",
  },
  metricValue: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.primaryDark,
  },
  metricLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  confidenceWrap: {
    marginTop: spacing.lg,
  },
  savedNote: {
    fontSize: 12.5,
    color: colors.textMuted,
    marginTop: spacing.lg,
  },
});
