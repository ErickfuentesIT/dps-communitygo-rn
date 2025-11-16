import { Dimensions, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

const { width: screenWidth } = Dimensions.get("window");

export default function useIndexStyles() {
  const theme = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background,
      paddingTop: screenWidth * 0.3,
    },
    titleContainer: {
      flex: 0.5,
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      color: theme.colors.onBackground,
    },
    logo: { aspectRatio: 16 / 9, width: screenWidth * 1, height: "auto" },
    btnContainer: {
      flex: 1,
      gap: 20,
    },
    btnGeneral: {
      width: screenWidth * 0.8,
    },
  });
}
