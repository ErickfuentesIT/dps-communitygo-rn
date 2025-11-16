import NavigationBar from "@/components/UI/NavigationBar";
import { Text, View } from "react-native";
import useHomeStyles from "./../styles/home.styles";

export default function Home() {
  const styles = useHomeStyles();

  return (
    <View style={styles.container}>
      <Text>Edit app/home.tsx to edit this screen.</Text>
      <NavigationBar />
    </View>
  );
}
