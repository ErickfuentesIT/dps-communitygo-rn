import React from "react";
import { TextInput } from "react-native-paper";
import useLoginStyles from "./../../app/login.styles";

interface IPasswordInput {
  password: string;
  onPassword: (newPassword: string) => void;
  onSecureTextEntry: (visibility: boolean) => void;
  secureTextEntry: boolean;
}

export default function PasswordInput({
  password,
  onPassword,
  secureTextEntry,
  onSecureTextEntry,
}: IPasswordInput) {
  const styles = useLoginStyles();

  return (
    <TextInput
      mode="outlined"
      placeholder="*****"
      value={password}
      onChangeText={(pass) => onPassword(pass)}
      secureTextEntry={secureTextEntry}
      right={
        <TextInput.Icon
          icon={secureTextEntry ? "eye-off" : "eye"}
          onPress={() => onSecureTextEntry(!secureTextEntry)}
        />
      }
      style={styles.input}
    />
  );
}
