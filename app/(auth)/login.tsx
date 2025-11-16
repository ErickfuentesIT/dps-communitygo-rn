import CustomButton from "@/components/UI/CustomButtom";
import CustomText from "@/components/UI/CustomText";
import PasswordInput from "@/components/UI/PasswordInput";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { TextInput } from "react-native-paper";
import useLoginStyles from "./login.styles";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPasword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const styles = useLoginStyles();
  const router = useRouter();

  function goToHome() {
    router.push("/(app)/home");
  }

  function goToRegister() {
    router.push("/register");
  }

  function handlePassword(pass: string) {
    setPasword(pass);
  }

  function handleSecureText(secureText: boolean) {
    setSecureTextEntry(secureText);
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <CustomText variant="displayMedium" style={styles.title}>
          Iniciar Sesión
        </CustomText>
      </View>
      <View style={styles.modal}>
        <View>
          <CustomText variant="labelLarge" style={styles.modalText}>
            Correo Electrónico
          </CustomText>
          <TextInput
            mode="outlined"
            placeholder="ej: john.doe@mail.com"
            value={email}
            onChangeText={(email) => setEmail(email)}
            style={styles.input}
          />
        </View>

        <View>
          <CustomText variant="labelLarge" style={styles.modalText}>
            Contraseña
          </CustomText>
          <PasswordInput
            password={password}
            onPassword={handlePassword}
            secureTextEntry={secureTextEntry}
            onSecureTextEntry={handleSecureText}
          />
        </View>
        <View style={styles.btnContainer}>
          <CustomButton
            mode="outlined"
            textColor="#000"
            style={styles.btnGeneral}
            onPress={goToHome}
          >
            Iniciar Sesión
          </CustomButton>
          <CustomText variant="labelLarge" style={styles.modalText}>
            O
          </CustomText>
          <CustomButton
            icon="google"
            mode="contained"
            buttonColor="#007BFF"
            textColor="#fff"
            style={styles.btnGeneral}
            onPress={goToHome}
          >
            Continuar con Google
          </CustomButton>
        </View>

        <View style={styles.footerContainer}>
          <CustomText variant="bodySmall" style={styles.modalText}>
            ¿No tienes un cuenta?
          </CustomText>
          <CustomText
            variant="bodyLarge"
            style={styles.modalText}
            onPress={goToRegister}
          >
            Registrate
          </CustomText>
        </View>
      </View>
    </View>
  );
}
