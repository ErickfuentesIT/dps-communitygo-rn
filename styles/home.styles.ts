import { Dimensions, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
const { width: screenWidth } = Dimensions.get("window");

export default function useHomeStyles() {
  const theme = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
    },
    listContent: {
      padding: 0,
      gap: 10,
    },
    logo: {
      aspectRatio: 16 / 9,
      width: screenWidth * 0.25,
      height: "auto",
      margin: 3,
    },
    fabStyle: {
      position: "absolute",
      margin: 32,
      right: 0,
      bottom: 50,
      backgroundColor: theme.colors.primary,
    },
  });
}
