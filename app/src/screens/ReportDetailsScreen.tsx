import { useState } from "react";

import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  ActivityIndicator,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { BASE_URL } from "../config/api";
import { updateReportStatus } from "../services/reportService";

import StatusBadge from "../components/StatusBadge";
import ConfidenceBar from "../components/ConfidenceBar";
import { colors, radius, shadow, spacing, statusStyle } from "../theme";

const STATUS_OPTIONS = [
  { key: "PENDING", label: "Pending" },
  { key: "IN_PROGRESS", label: "In Progress" },
  { key: "RESOLVED", label: "Resolved" },
  { key: "REJECTED", label: "Rejected" },
];

export default function ReportDetailsScreen({ route }: any) {
  const { report } = route.params;

  const [view, setView] = useState<"annotated" | "original">("annotated");
  const [status, setStatus] = useState<string>(report.status);
  const [updating, setUpdating] = useState<string | null>(null);

  const imageUrl =
    view === "annotated" ? report.annotated_image_url : report.original_image_url;

  const changeStatus = async (next: string) => {
    if (next === status || updating) return;
    setUpdating(next);
    try {
      const updated = await updateReportStatus(report.id, next);
      setStatus(updated.status);
    } catch (e) {
      console.log(e);
      Alert.alert("Update failed", "Could not update the status. Try again.");
    } finally {
      setUpdating(null);
    }
  };

  const openMap = () => {
    const url = `https://www.google.com/maps?q=${report.latitude},${report.longitude}`;
    Linking.openURL(url).catch(() =>
      Alert.alert("Cannot open maps", "No map app available."),
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.body}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Report #{report.id}</Text>
        <StatusBadge status={status} />
      </View>

      <View style={styles.toggle}>
        <ToggleTab
          label="AI Detection"
          icon="scan"
          active={view === "annotated"}
          onPress={() => setView("annotated")}
        />
        <ToggleTab
          label="Original"
          icon="image"
          active={view === "original"}
          onPress={() => setView("original")}
        />
      </View>

      <View style={styles.imageCard}>
        {imageUrl ? (
          <Image source={{ uri: BASE_URL + imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.imageMissing}>
            <Ionicons name="image-outline" size={40} color={colors.textMuted} />
            <Text style={styles.imageMissingText}>Image not available</Text>
          </View>
        )}
      </View>

      <View style={styles.detectionCard}>
        <ConfidenceBar value={report.highest_confidence} />
        <Text style={styles.explainer}>
          How sure the AI is that garbage is present — not how severe the issue is.
        </Text>

        <View style={styles.divider} />

        <View style={styles.statRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{report.garbage_count}</Text>
            <Text style={styles.statLabel}>Items detected</Text>
          </View>
          <View style={styles.statSep} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>
              {report.garbage_detected ? "Yes" : "No"}
            </Text>
            <Text style={styles.statLabel}>Garbage found</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionLabel}>UPDATE STATUS</Text>
      <View style={styles.statusGrid}>
        {STATUS_OPTIONS.map((opt) => {
          const active = status === opt.key;
          const s = statusStyle(opt.key);
          const isBusy = updating === opt.key;
          return (
            <TouchableOpacity
              key={opt.key}
              activeOpacity={0.85}
              disabled={!!updating}
              onPress={() => changeStatus(opt.key)}
              style={[
                styles.statusOption,
                { borderColor: active ? s.fg : colors.border },
                active && { backgroundColor: s.bg },
              ]}
            >
              {isBusy ? (
                <ActivityIndicator size="small" color={s.fg} />
              ) : (
                <>
                  <Ionicons name={s.icon} size={18} color={s.fg} />
                  <Text
                    style={[
                      styles.statusOptionText,
                      { color: active ? s.fg : colors.textMuted },
                    ]}
                  >
                    {opt.label}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.sectionLabel}>LOCATION & DETAILS</Text>
      <View style={styles.infoCard}>
        <InfoRow
          icon="navigate"
          label="Coordinates"
          value={`${report.latitude.toFixed(5)}, ${report.longitude.toFixed(5)}`}
        />
        <View style={styles.divider} />
        <InfoRow
          icon="time"
          label="Reported"
          value={new Date(report.created_at).toLocaleString()}
        />
      </View>

      <TouchableOpacity style={styles.mapButton} activeOpacity={0.85} onPress={openMap}>
        <Ionicons name="map" size={18} color={colors.primary} />
        <Text style={styles.mapButtonText}>View location on map</Text>
        <Ionicons name="open-outline" size={16} color={colors.primary} />
      </TouchableOpacity>
    </ScrollView>
  );
}

function ToggleTab({
  label,
  icon,
  active,
  onPress,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.tab, active && styles.tabActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons
        name={icon}
        size={15}
        color={active ? colors.white : colors.primaryDark}
      />
      <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoLabelWrap}>
        <Ionicons name={icon} size={16} color={colors.textMuted} />
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
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
    flexDirection: "row",
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primaryDark,
    marginLeft: spacing.xs + 2,
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
    marginTop: spacing.sm,
  },
  detectionCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.lg,
    ...shadow.card,
  },
  explainer: {
    fontSize: 12.5,
    color: colors.textMuted,
    marginTop: spacing.md,
    lineHeight: 18,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.xs,
  },
  stat: {
    flex: 1,
    alignItems: "center",
  },
  statSep: {
    width: 1,
    height: 36,
    backgroundColor: colors.border,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.primaryDark,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textMuted,
    letterSpacing: 0.6,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  statusGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statusOption: {
    width: "48.5%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1.5,
    backgroundColor: colors.card,
    marginBottom: spacing.md,
  },
  statusOptionText: {
    fontSize: 14,
    fontWeight: "700",
    marginLeft: spacing.sm,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow.card,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  infoLabelWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: "600",
    marginLeft: spacing.sm,
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
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    marginTop: spacing.md,
  },
  mapButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.primary,
    marginHorizontal: spacing.sm,
  },
});
