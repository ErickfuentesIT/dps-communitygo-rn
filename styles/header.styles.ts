import { Dimensions, StyleSheet } from "react-native";
const { width: screenWidth } = Dimensions.get("window");

export default function useHeaderStyles() {
  return StyleSheet.create({
    logo: {
      aspectRatio: 16 / 9,
      width: screenWidth * 0.25,
      height: "auto",
      margin: 3,
    },
    headerContainer: {
      flexDirection: "row", // Pone los elementos en fila
      alignItems: "center",
      justifyContent: "space-between",
    },
  });
}
