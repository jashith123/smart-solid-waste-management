import { useEffect, useMemo, useState } from "react";

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Report } from "../types/report";
import { getReports } from "../services/reportService";
import { BASE_URL } from "../config/api";

import StatusBadge from "../components/StatusBadge";
import ConfidenceBar from "../components/ConfidenceBar";
import { colors, radius, shadow, spacing } from "../theme";

const FILTERS = [
  { key: "ALL", label: "All" },
  { key: "PENDING", label: "Pending" },
  { key: "IN_PROGRESS", label: "In Progress" },
  { key: "RESOLVED", label: "Resolved" },
];

export default function ReportsScreen({ navigation }: any) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadReports);
    return unsubscribe;
  }, [navigation]);

  const loadReports = async () => {
    try {
      const data = await getReports();
      setReports(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReports();
  };

  const stats = useMemo(
    () => ({
      total: reports.length,
      pending: reports.filter((r) => r.status === "PENDING").length,
      resolved: reports.filter((r) => r.status === "RESOLVED").length,
    }),
    [reports],
  );

  const filtered = useMemo(
    () => (filter === "ALL" ? reports : reports.filter((r) => r.status === filter)),
    [reports, filter],
  );

  if (loading) {
    return (
      <View style={styles.list}>
        {[0, 1, 2, 3].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </View>
    );
  }

  const Header = (
    <View>
      <View style={styles.statsRow}>
        <StatCard value={stats.total} label="Total" tint={colors.text} />
        <StatCard value={stats.pending} label="Pending" tint={colors.pending} />
        <StatCard value={stats.resolved} label="Resolved" tint={colors.resolved} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}
      >
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <TouchableOpacity
              key={f.key}
              activeOpacity={0.8}
              onPress={() => setFilter(f.key)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  return (
    <FlatList
      data={filtered}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.list}
      ListHeaderComponent={Header}
      ListEmptyComponent={
        <View style={styles.emptyInline}>
          <Ionicons
            name={reports.length === 0 ? "file-tray-outline" : "search-outline"}
            size={56}
            color={colors.textMuted}
          />
          <Text style={styles.emptyTitle}>
            {reports.length === 0 ? "No reports yet" : "No matching reports"}
          </Text>
          <Text style={styles.emptyText}>
            {reports.length === 0
              ? "Submit your first garbage report from the Home screen."
              : "Try a different filter."}
          </Text>
        </View>
      }
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate("ReportDetails", { report: item })}
          style={styles.card}
        >
          <View style={styles.cardTop}>
            <Image
              source={{ uri: BASE_URL + item.original_image_url }}
              style={styles.thumb}
            />

            <View style={styles.cardBody}>
              <View style={styles.cardTopRow}>
                <Text style={styles.reportId}>Report #{item.id}</Text>
                <StatusBadge status={item.status} />
              </View>

              <View style={styles.metaRow}>
                <Ionicons name="trash-outline" size={14} color={colors.textMuted} />
                <Text style={styles.metaText}>{item.garbage_count} items detected</Text>
              </View>

              <View style={styles.metaRow}>
                <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
                <Text style={styles.metaText}>
                  {new Date(item.created_at).toLocaleDateString()}{"  "}
                  {new Date(item.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            </View>

            <Ionicons name="chevron-forward" size={22} color={colors.textMuted} />
          </View>

          <View style={styles.cardConfidence}>
            <ConfidenceBar value={item.highest_confidence} />
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

function StatCard({
  value,
  label,
  tint,
}: {
  value: number;
  label: string;
  tint: string;
}) {
  return (
    <View style={styles.statCard}>
      <Text style={[styles.statValue, { color: tint }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function SkeletonCard() {
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={[styles.thumb, styles.skel]} />
        <View style={styles.cardBody}>
          <View style={[styles.skel, styles.skelLineWide]} />
          <View style={[styles.skel, styles.skelLine]} />
          <View style={[styles.skel, styles.skelLineSm]} />
        </View>
      </View>
      <View style={[styles.skel, styles.skelBar]} />
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: spacing.lg,
    flexGrow: 1,
  },
  statsRow: {
    flexDirection: "row",
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginHorizontal: spacing.xs,
    ...shadow.card,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
  },
  statLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  chipsRow: {
    paddingVertical: spacing.sm,
    paddingRight: spacing.lg,
  },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textMuted,
  },
  chipTextActive: {
    color: colors.white,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadow.card,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: radius.md,
    backgroundColor: colors.border,
  },
  cardBody: {
    flex: 1,
    marginLeft: spacing.md,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  reportId: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.sm,
  },
  metaText: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: "600",
    marginLeft: spacing.xs + 2,
  },
  chevron: {
    marginLeft: spacing.xs,
  },
  cardConfidence: {
    marginTop: spacing.md,
  },
  emptyInline: {
    alignItems: "center",
    paddingVertical: spacing.xxl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
    marginTop: spacing.md,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.xs,
  },
  skel: {
    backgroundColor: colors.border,
    opacity: 0.6,
  },
  skelLineWide: {
    height: 14,
    borderRadius: 4,
    width: "60%",
  },
  skelLine: {
    height: 12,
    borderRadius: 4,
    width: "85%",
    marginTop: spacing.sm,
  },
  skelLineSm: {
    height: 12,
    borderRadius: 4,
    width: "45%",
    marginTop: spacing.sm,
  },
  skelBar: {
    height: 8,
    borderRadius: radius.pill,
    marginTop: spacing.md,
  },
});
