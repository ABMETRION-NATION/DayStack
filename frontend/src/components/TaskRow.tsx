import Feather from "@expo/vector-icons/Feather";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";

import { useAppTheme } from "../context/ThemeContext";
import { Category } from "../lib/taskTypes";

type TaskRowProps = {
  category: Category;
  completed?: boolean;
  onDelete?: () => void;
  onPress?: () => void;
  onToggle?: () => void;
  showCheckbox?: boolean;
  subtitle?: string;
  testID: string;
  title: string;
  trailingText?: string;
};

export function TaskRow({
  category,
  completed = false,
  onDelete,
  onPress,
  onToggle,
  showCheckbox = true,
  subtitle,
  testID,
  title,
  trailingText,
}: TaskRowProps) {
  const { colors } = useAppTheme();
  const categoryColor = colors.categoryColors[category.toLowerCase() as keyof typeof colors.categoryColors];

  const rowContent = (
    <Pressable
      accessibilityLabel={title}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { borderBottomColor: colors.border, opacity: pressed ? 0.8 : 1 },
      ]}
      testID={`${testID}-row`}
    >
      {showCheckbox ? (
        <Pressable
          accessibilityLabel={`Toggle ${title}`}
          hitSlop={10}
          onPress={onToggle}
          style={styles.checkboxWrap}
          testID={`${testID}-toggle`}
        >
          <Feather
            color={completed ? colors.success : colors.textTertiary}
            name={completed ? "check-circle" : "circle"}
            size={22}
          />
        </Pressable>
      ) : null}

      <View style={styles.textWrap}>
        <Text
          numberOfLines={1}
          style={[
            styles.title,
            {
              color: completed ? colors.textTertiary : colors.textPrimary,
              textDecorationLine: completed ? "line-through" : "none",
            },
          ]}
        >
          {title}
        </Text>

        {subtitle ? (
          <Text numberOfLines={1} style={[styles.subtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View style={styles.rightSide}>
        {trailingText ? (
          <Text numberOfLines={1} style={[styles.trailingText, { color: colors.textSecondary }]}> 
            {trailingText}
          </Text>
        ) : null}
        <View style={[styles.categoryDot, { backgroundColor: categoryColor }]} />
      </View>
    </Pressable>
  );

  if (!onDelete) {
    return rowContent;
  }

  return (
    <Swipeable
      overshootRight={false}
      renderRightActions={() => (
        <Pressable
          accessibilityLabel={`Delete ${title}`}
          onPress={onDelete}
          style={[styles.deleteAction, { backgroundColor: colors.destructive }]}
          testID={`${testID}-delete`}
        >
          <Feather color="#FFFFFF" name="trash-2" size={18} />
        </Pressable>
      )}
    >
      {rowContent}
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: 14,
    minHeight: 72,
    paddingVertical: 14,
  },
  checkboxWrap: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  textWrap: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 13,
  },
  rightSide: {
    alignItems: "flex-end",
    gap: 10,
    minWidth: 74,
  },
  trailingText: {
    fontSize: 12,
    fontWeight: "500",
  },
  categoryDot: {
    borderRadius: 999,
    height: 8,
    width: 8,
  },
  deleteAction: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 84,
  },
});