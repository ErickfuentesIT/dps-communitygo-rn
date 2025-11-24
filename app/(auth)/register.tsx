import CustomButton from "@/components/UI/CustomButtom";
import CustomText from "@/components/UI/CustomText";
import PasswordInput from "@/components/UI/PasswordInput";
import { useRegister } from "@/hooks/useRegister"; // 👈 Importamos el nuevo hook
import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { TextInput } from "react-native-paper";
import { RegisterPayload } from "./../../types/User"; // 👈 Importamos la interfaz del payload
import useLoginStyles from "./login.styles";

export default function RegisterScreen() {
  // Renombré a RegisterScreen para claridad
  // 🟢 ESTADOS ADICIONALES REQUERIDOS POR LA API
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // 🟢 ESTADOS EXISTENTES
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Corregido el nombre de la variable
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState(""); // Corregido
  const [confirmSecureTextEntry, setConfirmSecureTextEntry] = useState(true);

  const styles = useLoginStyles();
  const router = useRouter();

  // 🟢 HOOK DE MUTACIÓN
  const registerMutation = useRegister();

  // --- HANDLERS (Simplificados) ---
  const handlePassword = (pass: string) => setPassword(pass);
  const handleSecureText = (secureText: boolean) =>
    setSecureTextEntry(secureText);
  const handleConfirmPassword = (pass: string) => setConfirmPassword(pass);
  const handleConfirmSecureText = (secureText: boolean) =>
    setConfirmSecureTextEntry(secureText);

  function goToLogin() {
    router.push("/login");
  }

  // 🟢 FUNCIÓN PRINCIPAL DE REGISTRO
  function handleRegister() {
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }
    // Añadir más validación (email vacío, etc.)
    if (!firstName || !lastName || !email || !password) {
      alert("Por favor, complete todos los campos.");
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

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <CustomText variant="displayMedium" style={styles.title}>
          Registrarse
        </CustomText>
      </View>
      <View style={styles.registerModal}>
        {/* 1. CAMPOS DE NOMBRE (NUEVOS REQUERIDOS POR LA API) */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <View style={{ flex: 1 }}>
            <CustomText variant="labelLarge" style={styles.modalText}>
              Nombre
            </CustomText>
            <TextInput
              mode="outlined"
              value={firstName}
              onChangeText={setFirstName}
              style={styles.input}
            />
          </View>
          <View style={{ flex: 1 }}>
            <CustomText variant="labelLarge" style={styles.modalText}>
              Apellido
            </CustomText>
            <TextInput
              mode="outlined"
              value={lastName}
              onChangeText={setLastName}
              style={styles.input}
            />
          </View>
        </View>

        {/* 2. CORREO ELECTRÓNICO */}
        <View>
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
        </View>

        {/* 3. CONTRASEÑA */}
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

        {/* 4. CONFIRMAR CONTRASEÑA */}
        <View>
          <CustomText variant="labelLarge" style={styles.modalText}>
            Confirmar Contraseña
          </CustomText>
          <PasswordInput
            password={confirmPassword}
            onPassword={handleConfirmPassword}
            secureTextEntry={confirmSecureTextEntry}
            onSecureTextEntry={handleConfirmSecureText}
          />
        </View>

        {/* 5. BOTÓN DE REGISTRO PRINCIPAL */}
        <View style={styles.btnContainer}>
          <CustomButton
            mode="contained"
            buttonColor={registerMutation.isPending ? "#ccc" : "#007BFF"}
            textColor="#fff"
            style={styles.btnGeneral}
            onPress={handleRegister} // 👈 Llamada a la mutación
            loading={registerMutation.isPending}
            disabled={registerMutation.isPending}
          >
            Registrarse
          </CustomButton>

          {/* ... Separador y Botón de Google ... */}
          <CustomText variant="labelLarge" style={styles.modalText}>
            O
          </CustomText>
          <CustomButton
            icon="google"
            mode="contained"
            buttonColor="#007BFF"
            textColor="#fff"
            style={styles.btnGeneral}
            onPress={() => console.log("Google Auth")}
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
