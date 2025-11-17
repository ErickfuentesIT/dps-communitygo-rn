// Importa FlatList y Text para renderizar los posts
import { View } from "react-native";

import useHomeStyles from "./../../styles/home.styles";

import Header from "@/components/UI/Header";
import MyEventsScreen from "@/components/Views/MyEvents";

export default function Events() {
  const styles = useHomeStyles();

  return (
    <View style={styles.container}>
      <Header />
      <MyEventsScreen />
    </View>
  );
}
