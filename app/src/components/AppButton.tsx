import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { colors, radius, spacing } from "../theme";

type Variant = "primary" | "secondary" | "danger";

interface Props {
  title: string;
  onPress: () => void;
  variant?: Variant;
  icon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
}

export default function AppButton({
  title,
  onPress,
  variant = "primary",
  icon,
  loading = false,
  disabled = false,
}: Props) {
  const isPrimary = variant === "primary";
  const isDanger = variant === "danger";

  const bg = isPrimary
    ? colors.primary
    : isDanger
      ? colors.danger
      : colors.white;

  const fg = isPrimary || isDanger ? colors.white : colors.primary;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        { backgroundColor: bg },
        variant === "secondary" && styles.secondaryBorder,
        (disabled || loading) && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <View style={styles.row}>
          {icon ? (
            <Ionicons name={icon} size={18} color={fg} style={styles.icon} />
          ) : null}
          <Text style={[styles.label, { color: fg }]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  secondaryBorder: {
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  disabled: {
    opacity: 0.5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: spacing.sm,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
  },
});
