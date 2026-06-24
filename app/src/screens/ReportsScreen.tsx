import { useEffect, useState } from "react";

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
  StyleSheet,
} from "react-native";

import { Report } from "../types/report";
import { getReports } from "../services/reportService";
import { BASE_URL } from "../config/api";

import StatusBadge from "../components/StatusBadge";
import { colors, radius, shadow, spacing } from "../theme";

export default function ReportsScreen({ navigation }: any) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.centeredText}>Loading reports…</Text>
      </View>
    );
  }

  if (reports.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyEmoji}>📭</Text>
        <Text style={styles.emptyTitle}>No reports yet</Text>
        <Text style={styles.emptyText}>
          Submit your first garbage report from the Home screen.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={reports}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.list}
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
              <Text style={styles.metaText}>🗑 {item.garbage_count} items</Text>
              <Text style={styles.metaDot}>•</Text>
              <Text style={styles.metaText}>
                {(item.highest_confidence * 100).toFixed(0)}%
              </Text>
            </View>

            <Text style={styles.date}>
              📅 {new Date(item.created_at).toLocaleDateString()}{"  "}
              {new Date(item.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>

          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  centeredText: {
    marginTop: spacing.md,
    color: colors.textMuted,
  },
  emptyEmoji: {
    fontSize: 56,
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
  list: {
    padding: spacing.lg,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadow.card,
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
  },
  metaDot: {
    color: colors.textMuted,
    marginHorizontal: spacing.sm,
  },
  date: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  chevron: {
    fontSize: 26,
    color: colors.textMuted,
    marginLeft: spacing.xs,
  },
});
