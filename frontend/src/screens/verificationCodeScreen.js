import React, { useState, useRef } from "react";
import { View, Text, TextInput,
  TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import { API_BASE_URL } from '@env';

const VerificationCodeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params;
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);

  const handleContinue = async () => {
    const verificationCode = code.join("");
  
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          email,
          code: verificationCode,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.detail || "Código inválido o expirado.");
        return;
      }
  
      const data = await response.json();
      const token = data.token;
  
      navigation.navigate("Password", { email, token });
    } catch (error) {
      console.error("Error:", error);
      alert("Error al verificar el código.");
    }
  };

  const handleInputChange = (text, index) => {
    if (/^\d*$/.test(text)) {
      let newCode = [...code];
      newCode[index] = text;
      setCode(newCode);

      if (text && index < 5) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      let newCode = [...code];
      newCode[index - 1] = "";
      setCode(newCode);
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ingresa el código</Text>
      <Text style={styles.subtitle}>Enviado a {email}</Text>

      <View style={styles.codeContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputsRef.current[index] = ref)}
            style={styles.input}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleInputChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
          />
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          code.join("").length < 6 && styles.buttonDisabled,
        ]}
        onPress={handleContinue}
        disabled={code.join("").length < 6}
      >
        <Text style={styles.buttonText}>CONTINUAR</Text>
      </TouchableOpacity>

      <Text style={styles.infoText}>
        Si no tienes tu correo institucional habilitado, contacta a{" "}
        <Text style={styles.highlight}>Telemática</Text>.
      </Text>
    </View>
  );
};

export default VerificationCodeScreen;

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
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b6b6b",
    marginBottom: 20,
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  input: {
    width: 45,
    height: 55,
    borderBottomWidth: 2,
    borderBottomColor: "#FF804C",
    fontSize: 20,
    textAlign: "center",
    marginHorizontal: 6,
    color: "#333",
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
  buttonDisabled: {
    backgroundColor: "#F2F2F2",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  infoText: {
    fontSize: 14,
    color: "#6b6b6b",
    textAlign: "center",
    marginTop: 20,
    paddingHorizontal: 10,
  },
  highlight: {
    color: "#FF804C",
    fontWeight: "bold",
  },
});
