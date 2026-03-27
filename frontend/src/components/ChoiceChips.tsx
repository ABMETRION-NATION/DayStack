import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "../context/ThemeContext";

export type ChipOption = {
  color?: string;
  label: string;
  value: string;
};

type ChoiceChipsProps = {
  onChange?: (value: string) => void;
  onToggleValue?: (value: string) => void;
  options: ChipOption[];
  size?: "compact" | "regular";
  testIDPrefix: string;
  value?: string;
  values?: string[];
};

export function ChoiceChips({
  onChange,
  onToggleValue,
  options,
  size = "regular",
  testIDPrefix,
  value,
  values,
}: ChoiceChipsProps) {
  const { colors } = useAppTheme();
  const isMulti = Array.isArray(values);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {options.map((option) => {
        const isSelected = isMulti ? values.includes(option.value) : value === option.value;

        return (
          <Pressable
            key={option.value}
            accessibilityLabel={option.label}
            onPress={() => {
              if (isMulti) {
                onToggleValue?.(option.value);
              } else {
                onChange?.(option.value);
              }
            }}
            style={({ pressed }) => [
              styles.chip,
              size === "compact" ? styles.compactChip : styles.regularChip,
              {
                backgroundColor: isSelected ? colors.accentPrimary : colors.surface,
                borderColor: isSelected ? colors.accentPrimary : colors.border,
                opacity: pressed ? 0.78 : 1,
              },
            ]}
            testID={`${testIDPrefix}-${option.value}`}
          >
            <View
              style={[
                styles.dot,
                option.color ? { backgroundColor: option.color } : styles.hiddenDot,
              ]}
            />
            <Text
              style={[
                styles.label,
                size === "compact" ? styles.compactLabel : styles.regularLabel,
                { color: isSelected ? colors.accentText : colors.textSecondary },
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 10,
  },
  chip: {
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    minHeight: 44,
    paddingHorizontal: 14,
  },
  compactChip: {
    minHeight: 38,
    paddingHorizontal: 12,
  },
  regularChip: {
    paddingVertical: 10,
  },
  dot: {
    borderRadius: 999,
    height: 8,
    marginRight: 8,
    width: 8,
  },
  hiddenDot: {
    backgroundColor: "transparent",
    marginRight: 0,
    width: 0,
  },
  label: {
    fontWeight: "600",
  },
  compactLabel: {
    fontSize: 13,
  },
  regularLabel: {
    fontSize: 14,
  },
});