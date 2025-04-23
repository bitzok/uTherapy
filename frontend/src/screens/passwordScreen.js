import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

const PasswordScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const email = route?.params?.email || "correo@unmsm.edu.pe";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    if (password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    // Simulación de registro exitoso
    Alert.alert("Registro exitoso", "Tu cuenta ha sido creada correctamente.");
    navigation.navigate("MainChat", { email });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crea tu contraseña</Text>

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#999"
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar contraseña"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholderTextColor="#999"
      />

      <Text style={styles.infoText}>
        Esta contraseña será la que uses para iniciar sesión en <Text style={styles.highlight}>uSoul</Text>.
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>REGISTRARSE</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F0",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FF804C",
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    fontSize: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#FF804C",
    marginBottom: 25,
    color: "#333",
  },
  infoText: {
    fontSize: 14,
    color: "#6b6b6b",
    width: "100%",
    textAlign: "left",
    marginBottom: 30,
  },
  highlight: {
    color: "#FF804C",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#FF804C",
    paddingVertical: 15,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
    shadowColor: "#FF804C",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
