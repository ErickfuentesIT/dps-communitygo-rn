import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import CustomButton from "@/components/UI/CustomButtom";

export default function WelcomeScreen() {
  const router = useRouter();

  function goToLogin() {
    router.push("/login");
  }

  function goToRegister() {
    router.push("/register");
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1E2A38",
      }}
    >
      {/* <Text></Text> */}
      <View
        style={{
          flex: 1,
          gap: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CustomButton
          mode="contained"
          buttonColor="#007BFF"
          textColor="#fff"
          style={styles.general}
          onPress={goToLogin}
        >
          Iniciar Sesión
        </CustomButton>
        <CustomButton
          mode="contained"
          buttonColor="#fff"
          textColor="#000"
          style={styles.general}
          onPress={goToRegister}
        >
          Registrarse
        </CustomButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  general: {
    width: 300,
  },
});
