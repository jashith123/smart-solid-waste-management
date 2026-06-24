import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { colors, radius, shadow, spacing } from "../theme";

export default function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.root}>
      <View style={styles.hero}>
        <SafeAreaView edges={["top"]}>
          <View style={styles.heroInner}>
            <Text style={styles.heroEmoji}>♻️</Text>
            <Text style={styles.heroTitle}>CleanCity</Text>
            <Text style={styles.heroSubtitle}>
              AI-powered garbage detection & reporting
            </Text>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.sectionLabel}>What would you like to do?</Text>

        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.actionCard}
          onPress={() => navigation.navigate("Report")}
        >
          <View style={[styles.actionIcon, { backgroundColor: colors.primarySoft }]}>
            <Text style={styles.actionEmoji}>📷</Text>
          </View>
          <View style={styles.actionTextWrap}>
            <Text style={styles.actionTitle}>Report Garbage</Text>
            <Text style={styles.actionDesc}>
              Capture or upload a photo and let AI detect waste.
            </Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.actionCard}
          onPress={() => navigation.navigate("Reports")}
        >
          <View style={[styles.actionIcon, { backgroundColor: colors.inProgressSoft }]}>
            <Text style={styles.actionEmoji}>📋</Text>
          </View>
          <View style={styles.actionTextWrap}>
            <Text style={styles.actionTitle}>View Reports</Text>
            <Text style={styles.actionDesc}>
              Browse submitted reports and their detection results.
            </Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>How it works</Text>
          <Text style={styles.tipStep}>1.  Take a photo of accumulated garbage</Text>
          <Text style={styles.tipStep}>2.  We tag it with your GPS location</Text>
          <Text style={styles.tipStep}>3.  AI detects & marks the waste</Text>
          <Text style={styles.tipStep}>4.  Track the report status to resolution</Text>
        </View>
      </ScrollView>
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
    paddingBottom: spacing.xxl,
  },
  heroEmoji: {
    fontSize: 40,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.white,
    marginTop: spacing.sm,
  },
  heroSubtitle: {
    fontSize: 14,
    color: colors.primarySoft,
    marginTop: spacing.xs,
  },
  body: {
    padding: spacing.lg,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
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
  actionEmoji: {
    fontSize: 24,
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
  chevron: {
    fontSize: 28,
    color: colors.textMuted,
    marginLeft: spacing.sm,
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
    marginBottom: spacing.sm,
  },
  tipStep: {
    fontSize: 13.5,
    color: colors.primaryDark,
    marginTop: spacing.xs,
  },
});
