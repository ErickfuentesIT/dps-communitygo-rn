import * as React from "react";
import { BottomNavigation, Text } from "react-native-paper";

const MyEventsRoute = () => <Text>Eventos</Text>;

const HomeRoute = () => <Text>Inicio</Text>;

const AccountRoute = () => <Text>Cuenta</Text>;

function NavigationBar() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: "events",
      title: "Mis Eventos",
      focusedIcon: "bookmark",
      unfocusedIcon: "bookmark-outline",
    },
    {
      key: "home",
      title: "Inicio",
      focusedIcon: "home",
      unfocusedIcon: "home-outline",
    },
    {
      key: "account",
      title: "Cuenta",
      focusedIcon: "account-circle",
      unfocusedIcon: "account-circle-outline",
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    events: MyEventsRoute,
    home: HomeRoute,
    account: AccountRoute,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
}

export default NavigationBar;
