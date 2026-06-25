import { View, Text, StyleSheet } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { radius, spacing, statusStyle } from "../theme";

export default function StatusBadge({ status }: { status: string }) {
  const s = statusStyle(status);

  return (
    <View style={[styles.badge, { backgroundColor: s.bg }]}>
      <Ionicons name={s.icon} size={13} color={s.fg} style={styles.icon} />
      <Text style={[styles.text, { color: s.fg }]}>{s.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  icon: {
    marginRight: spacing.xs + 1,
  },
  text: {
    fontSize: 12,
    fontWeight: "700",
  },
});
