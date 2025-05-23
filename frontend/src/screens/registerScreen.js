import React, { useState } from "react";
import { View, Text, TextInput,
  TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { API_BASE_URL } from '@env';

const EmailLoginScreen = () => {
  const [email, setEmail] = useState("");
  const navigation = useNavigation();

  const handleSendOTP = async () => {
    if (!email.endsWith("@unmsm.edu.pe")) {
      Alert.alert("Error", "Solo se permiten correos de @unmsm.edu.pe");
      return;
    }
  
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
  
      if (!response.ok) {
        let errorMessage = "Error al registrar.";
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.detail || errorMessage;
          } else {
            const text = await response.text(); // en caso sea texto plano
            if (text) errorMessage = text;
          }
        } catch (parseError) {
          errorMessage = "Error inesperado del servidor.";
        }

        Alert.alert("Error", errorMessage);
        return;
      }
  
      Alert.alert("Código enviado", "Revisa tu correo electrónico.");
  
      setTimeout(() => {
        navigation.navigate("VerificationCode", { email });
      }, 1000);
  
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "No se pudo conectar con el servidor.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrate con tu correo institucional</Text>

      <View style={styles.emailInputContainer}>
        <TextInput
          style={styles.input}
          placeholder="tucorreo@unmsm.edu.pe"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#999"
        />
      </View>

      <Text style={styles.infoText}>
        El correo ingresado debe tener el dominio <Text style={styles.highlight}>@unmsm.edu.pe</Text>.{"\n"}
        Si no tienes tu correo institucional habilitado, contacta a Telemática.
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleSendOTP}>
        <Text style={styles.buttonText}>ENVIAR CÓDIGO</Text>
      </TouchableOpacity>

    </View>
  );
};

export default EmailLoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F0",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FF804C",
    marginBottom: 20,
    textAlign: "left",
  },
  emailInputContainer: {
    borderWidth: 1,
    borderColor: "#FF804C",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  input: {
    fontSize: 16,
    color: "#333",
  },
  infoText: {
    fontSize: 14,
    color: "#6b6b6b",
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
