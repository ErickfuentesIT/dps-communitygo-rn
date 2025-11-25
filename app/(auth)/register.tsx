// app/(auth)/register.tsx
import CustomButton from "@/components/UI/CustomButtom";
import CustomText from "@/components/UI/CustomText";
import PasswordInput from "@/components/UI/PasswordInput";
import { useLogin } from "@/hooks/useLogin"; // Hook de Login (para el onSuccess de Google)
import { useRegister } from "@/hooks/useRegister";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, View } from "react-native";
import { TextInput } from "react-native-paper";
import { RegisterPayload, UserProfile } from "./../../types/User"; // Asumimos la interfaz del payload
import useLoginStyles from "./login.styles";
// Nuevos imports para Google Auth
import client from "@/utils/client";
import { tokenStorage } from "@/utils/tokenStorage";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

export default function RegisterScreen() {
  // 🟢 ESTADOS DE FORMULARIO
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Estados de seguridad (para el icono del ojo)
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [confirmSecureTextEntry, setConfirmSecureTextEntry] = useState(true);

  const styles = useLoginStyles();
  const router = useRouter();

  // 🟢 HOOKS DE MUTACIÓN
  const registerMutation = useRegister();
  const loginMutation = useLogin(); // Necesario para el onSuccess de Google

  // Llama a esto al inicio del componente por seguridad (Google Auth)
  WebBrowser.maybeCompleteAuthSession();

  // --- HANDLERS ---
  const handlePassword = (pass: string) => setPassword(pass);
  const handleSecureText = (secureText: boolean) =>
    setSecureTextEntry(secureText);
  const handleConfirmPassword = (pass: string) => setConfirmPassword(pass);
  // const handleConfirmSecureText = (secureText: boolean) => setConfirmSecureTextEntry(secureText); // Esta línea es redundante y se puede eliminar

  function goToLogin() {
    router.push("/login");
  }

  // 🟢 FUNCIÓN PRINCIPAL DE REGISTRO (CON VALIDACIÓN SIMPLE)
  function handleRegister() {
    // 1. Validación de campos vacíos
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      Alert.alert("Error", "Por favor, complete todos los campos.");
      return;
    }

    const payload: RegisterPayload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      password: password,
    };

    registerMutation.mutate(payload);
  }

  // 🟢 FUNCIÓN DE INICIO DE SESIÓN CON GOOGLE (NUEVO)
  const handleGoogleSignIn = async () => {
    const redirectUri = AuthSession.makeRedirectUri({
      useProxy: true,
      path: "auth/google/callback",
    });

    // Asumimos que el cliente Axios tiene la baseURL bien configurada
    const BACKEND_GOOGLE_LOGIN_URL = `${client.defaults.baseURL}/auth/google/login`;
    const authUrl = `${BACKEND_GOOGLE_LOGIN_URL}?redirect_uri=${encodeURIComponent(
      redirectUri
    )}`;
    console.log("URL de autenticación generada:", authUrl);
    const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

    if (result.type === "success" && result.url) {
      const url = new URL(result.url);
      const accessToken = url.searchParams.get("accessToken");
      const refreshToken = url.searchParams.get("refreshToken");

      if (accessToken && refreshToken) {
        // 🛑 LÓGICA CRUCIAL: Reemplazar loginMutation.onSuccess
        try {
          // 🛑 LÓGICA DE ON SUCCESS MANUAL (Igual que en useLogin)
          await tokenStorage.setTokens(accessToken, refreshToken);
          const profileResponse = await client.get<UserProfile>(
            "/users/profile"
          );
          setUser(profileResponse.data);
          router.replace("/(app)");
        } catch (error) {
          console.error("Falla al guardar tokens o perfil:", error);
          await tokenStorage.clearTokens(); // Limpiar si falló el perfil
          Alert.alert("Error", "No se pudo obtener el perfil del usuario.");
        }
        return;
      }
    }
    Alert.alert("Error", "Inicio de sesión con Google fallido.");
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <CustomText variant="displayMedium" style={styles.title}>
          Registrarse
        </CustomText>
      </View>
      <View style={styles.registerModal}>
        {/* CAMPOS DE NOMBRE Y APELLIDO (Usamos View para Flexbox) */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 10,
          }}
        ></View>

        {/* CONTRASEÑA */}
        <View>
          <CustomText variant="labelLarge" style={styles.modalText}>
            Nombre
          </CustomText>
          <TextInput
            mode="outlined"
            value={firstName}
            onChangeText={setFirstName}
            style={styles.input}
          />
          <CustomText variant="labelLarge" style={styles.modalText}>
            Apellido
          </CustomText>
          <TextInput
            mode="outlined"
            value={lastName}
            onChangeText={setLastName}
            style={styles.input}
          />
          <CustomText variant="labelLarge" style={styles.modalText}>
            Correo Electrónico
          </CustomText>
          <TextInput
            mode="outlined"
            placeholder="ej: john.doe@mail.com"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
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

        {/* 5. BOTÓN DE REGISTRO PRINCIPAL */}
        <View style={styles.btnContainer}>
          <CustomButton
            mode="contained"
            buttonColor={registerMutation.isPending ? "#ccc" : "#007BFF"}
            textColor="#fff"
            style={styles.btnGeneral}
            onPress={handleRegister} // 👈 Registro tradicional
            loading={registerMutation.isPending}
            disabled={registerMutation.isPending || loginMutation.isPending}
          >
            Registrarse
          </CustomButton>

          <CustomText variant="labelLarge" style={styles.modalText}>
            O
          </CustomText>

          {/* BOTÓN DE GOOGLE */}
          <CustomButton
            icon="google"
            mode="contained"
            buttonColor="#007BFF"
            textColor="#fff"
            style={styles.btnGeneral}
            onPress={handleGoogleSignIn} // 👈 Registro con Google
            loading={loginMutation.isPending}
            disabled={registerMutation.isPending || loginMutation.isPending}
          >
            Continuar con Google
          </CustomButton>
        </View>

        {/* 6. PIE DE PÁGINA */}
        <View style={styles.footerContainer}>
          <CustomText variant="bodySmall" style={styles.modalText}>
            ¿Ya tienes una cuenta?
          </CustomText>
          <CustomText
            variant="bodyLarge"
            style={styles.modalText}
            onPress={goToLogin}
          >
            Iniciar Sesión
          </CustomText>
        </View>
      </View>
    </View>
  );
}
function setUser(data: UserProfile) {
  throw new Error("Function not implemented.");
}
