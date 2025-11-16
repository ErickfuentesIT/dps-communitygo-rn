import CustomButton from "@/components/UI/CustomButtom";
import CustomText from "@/components/UI/CustomText";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { View } from "react-native";
import useIndexStyles from "./index.styles";

export default function WelcomeScreen() {
  const styles = useIndexStyles();
  const router = useRouter();

  function goToLogin() {
    router.push("/login");
  }

  function goToRegister() {
    router.push("/register");
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/ComunityGo.png")}
        style={styles.logo}
        contentFit="contain"
      />
      <View style={styles.titleContainer}>
        <CustomText variant="displayMedium" style={styles.title}>
          Bienvenido
        </CustomText>
      </View>
      <View style={styles.btnContainer}>
        <CustomButton
          mode="contained"
          buttonColor="#007BFF"
          textColor="#fff"
          style={styles.btnGeneral}
          onPress={goToLogin}
        >
          INICIAR SESIÓN
        </CustomButton>
        <CustomButton
          mode="contained"
          buttonColor="#fff"
          textColor="#000"
          style={styles.btnGeneral}
          onPress={goToRegister}
        >
          REGISTRARSE
        </CustomButton>
      </View>
    </View>
  );
}
