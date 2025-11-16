import { Dimensions, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
const { width: screenWidth } = Dimensions.get("window");

export default function useHomeStyles() {
  const theme = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.onSecondary,
    },
  });
}
