import { useState } from "react";

import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { BASE_URL } from "../config/api";

import StatusBadge from "../components/StatusBadge";
import { colors, radius, shadow, spacing } from "../theme";

export default function ReportDetailsScreen({ route }: any) {
  const { report } = route.params;

  const [view, setView] = useState<"annotated" | "original">("annotated");

  const imageUrl =
    view === "annotated"
      ? report.annotated_image_url
      : report.original_image_url;

  return (
    <ScrollView contentContainerStyle={styles.body}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Report #{report.id}</Text>
        <StatusBadge status={report.status} />
      </View>

      <View style={styles.toggle}>
        <ToggleTab
          label="AI Detection"
          active={view === "annotated"}
          onPress={() => setView("annotated")}
        />
        <ToggleTab
          label="Original"
          active={view === "original"}
          onPress={() => setView("original")}
        />
      </View>

      <View style={styles.imageCard}>
        {imageUrl ? (
          <Image source={{ uri: BASE_URL + imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.imageMissing}>
            <Text style={styles.imageMissingText}>Image not available</Text>
          </View>
        )}
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{report.garbage_count}</Text>
          <Text style={styles.metricLabel}>Items</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>
            {(report.highest_confidence * 100).toFixed(0)}%
          </Text>
          <Text style={styles.metricLabel}>Confidence</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>
            {report.garbage_detected ? "Yes" : "No"}
          </Text>
          <Text style={styles.metricLabel}>Detected</Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <InfoRow label="📍 Latitude" value={String(report.latitude)} />
        <View style={styles.divider} />
        <InfoRow label="📍 Longitude" value={String(report.longitude)} />
        <View style={styles.divider} />
        <InfoRow
          label="🕑 Reported"
          value={new Date(report.created_at).toLocaleString()}
        />
      </View>
    </ScrollView>
  );
}

function ToggleTab({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.tab, active && styles.tabActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    padding: spacing.lg,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
  },
  toggle: {
    flexDirection: "row",
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
    padding: 4,
    marginBottom: spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.sm,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primaryDark,
  },
  tabTextActive: {
    color: colors.white,
  },
  imageCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    overflow: "hidden",
    ...shadow.card,
  },
  image: {
    width: "100%",
    height: 300,
  },
  imageMissing: {
    height: 300,
    alignItems: "center",
    justifyContent: "center",
  },
  imageMissingText: {
    color: colors.textMuted,
  },
  metricsRow: {
    flexDirection: "row",
    marginTop: spacing.lg,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: "center",
    marginHorizontal: spacing.xs,
    ...shadow.card,
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
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.lg,
    ...shadow.card,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: "600",
  },
  infoValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "700",
    flexShrink: 1,
    textAlign: "right",
    marginLeft: spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
});
