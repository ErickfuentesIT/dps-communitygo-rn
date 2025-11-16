import { Dimensions, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
const { width: screenWidth } = Dimensions.get("window");

export default function useLoginStyles() {
  const theme = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background,
    },
    titleContainer: {
      flex: 0.3,
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      color: theme.colors.onBackground,
    },
    modal: {
      flex: 1,
      gap: 50,
      width: "100%",
      borderTopRightRadius: 50,
      borderTopLeftRadius: 50,
      backgroundColor: theme.colors.onSecondary,
      justifyContent: "center",
      alignItems: "center",
    },
    registerModal: {
      flex: 1,
      gap: 30,
      width: "100%",
      borderTopRightRadius: 50,
      borderTopLeftRadius: 50,
      backgroundColor: theme.colors.onSecondary,
      justifyContent: "center",
      alignItems: "center",
    },
    modalText: {
      color: theme.colors.onTertiary,
    },
    btnContainer: {
      gap: 10,
      color: theme.colors.onTertiary,
      alignItems: "center",
      justifyContent: "center",
    },

    btnGeneral: {
      width: screenWidth * 0.8,
    },
    input: {
      width: screenWidth * 0.8,
    },
    footerContainer: {
      width: "100%",
      alignItems: "flex-end",
      paddingRight: screenWidth * 0.12,
    },
  });
}
