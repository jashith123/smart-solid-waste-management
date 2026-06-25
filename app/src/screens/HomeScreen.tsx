import { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { getReports } from "../services/reportService";
import { colors, radius, shadow, spacing } from "../theme";

export default function HomeScreen({ navigation }: any) {
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0 });

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      try {
        const data = await getReports();
        setStats({
          total: data.length,
          pending: data.filter((r: any) => r.status === "PENDING").length,
          resolved: data.filter((r: any) => r.status === "RESOLVED").length,
        });
      } catch {
        // offline / backend down — leave stats at zero
      }
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.root}>
      <View style={styles.hero}>
        <SafeAreaView edges={["top"]}>
          <View style={styles.heroInner}>
            <View style={styles.brandRow}>
              <View style={styles.logoCircle}>
                <Ionicons name="leaf" size={22} color={colors.white} />
              </View>
              <View style={{ marginLeft: spacing.md }}>
                <Text style={styles.heroTitle}>CleanCity</Text>
                <Text style={styles.heroSubtitle}>AI garbage detection</Text>
              </View>
            </View>

            <View style={styles.statStrip}>
              <HeroStat value={stats.total} label="Reports" />
              <View style={styles.statDivider} />
              <HeroStat value={stats.pending} label="Pending" />
              <View style={styles.statDivider} />
              <HeroStat value={stats.resolved} label="Resolved" />
            </View>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.sectionLabel}>QUICK ACTIONS</Text>

        <ActionCard
          icon="camera"
          tint={colors.primary}
          tintSoft={colors.primarySoft}
          title="Report Garbage"
          desc="Capture or upload a photo and let AI detect waste."
          onPress={() => navigation.navigate("Report")}
        />

        <ActionCard
          icon="list"
          tint={colors.inProgress}
          tintSoft={colors.inProgressSoft}
          title="View Reports"
          desc="Browse submitted reports and detection results."
          onPress={() => navigation.navigate("Reports")}
        />

        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>How it works</Text>
          <TipStep icon="camera-outline" text="Take a photo of accumulated garbage" />
          <TipStep icon="location-outline" text="We tag it with your GPS location" />
          <TipStep icon="scan-outline" text="AI detects & marks the waste" />
          <TipStep icon="checkmark-done-outline" text="Track the report to resolution" />
        </View>
      </ScrollView>
    </View>
  );
}

function HeroStat({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.heroStat}>
      <Text style={styles.heroStatValue}>{value}</Text>
      <Text style={styles.heroStatLabel}>{label}</Text>
    </View>
  );
}

function ActionCard({
  icon,
  tint,
  tintSoft,
  title,
  desc,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  tint: string;
  tintSoft: string;
  title: string;
  desc: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.actionCard} onPress={onPress}>
      <View style={[styles.actionIcon, { backgroundColor: tintSoft }]}>
        <Ionicons name={icon} size={24} color={tint} />
      </View>
      <View style={styles.actionTextWrap}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionDesc}>{desc}</Text>
      </View>
      <Ionicons name="chevron-forward" size={22} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

function TipStep({
  icon,
  text,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
}) {
  return (
    <View style={styles.tipStep}>
      <Ionicons name={icon} size={18} color={colors.primaryDark} />
      <Text style={styles.tipStepText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  hero: {
    backgroundColor: colors.primary,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
  },
  heroInner: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoCircle: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.white,
  },
  heroSubtitle: {
    fontSize: 13,
    color: colors.primarySoft,
    marginTop: 1,
  },
  statStrip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    marginTop: spacing.xl,
  },
  heroStat: {
    flex: 1,
    alignItems: "center",
  },
  heroStatValue: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.white,
  },
  heroStatLabel: {
    fontSize: 11,
    color: colors.primarySoft,
    marginTop: 1,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  body: {
    padding: spacing.lg,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textMuted,
    letterSpacing: 0.6,
    marginBottom: spacing.md,
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadow.card,
  },
  actionIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  actionTextWrap: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  actionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
  },
  actionDesc: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  tipCard: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.sm,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.primaryDark,
    marginBottom: spacing.md,
  },
  tipStep: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.sm,
  },
  tipStepText: {
    fontSize: 13.5,
    color: colors.primaryDark,
    marginLeft: spacing.sm,
  },
});
