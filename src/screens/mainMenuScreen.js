import React from 'react';
import { useNavigation } from '@react-navigation/native';

import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const RegisterScreen = () => {
  const navigation = useNavigation();

  return (
    <LinearGradient
    colors={['#ff804c', '#ffcab0']}
    start={{ x: 1, y: 0 }}
    end={{ x: 0, y: 1 }}
    style={styles.background}
    >
      <View style={styles.container}>
        {/* <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" /> */}

        <Text style={styles.title}>uTherapy</Text>
        <Text style={styles.subtitle}>Tu espacio seguro</Text>
      </View>

      <View style={styles.options}>
        <Text style={styles.terms}>
          Al hacer clic en “INGRESA”, aceptas nuestros Términos. 
          Obtén más información sobre cómo procesamos tus datos en nuestra Política de privacidad y Política de cookies.
        </Text>

        <TouchableOpacity style={[styles.button, styles.emailButton]} onPress={() => navigation.navigate('Register')}>
          <MaterialIcons name="email" size={24} color="white" />
          <Text style={styles.buttonText}>Regístrate con tu email</Text>
        </TouchableOpacity>

        {/* Enlace para iniciar sesión si ya tiene cuenta */}
        <TouchableOpacity onPress={() => navigation.navigate('MainChat')}>
          <Text style={styles.loginText}>
            ¿Ya tienes cuenta? <Text style={styles.loginLink}>INGRESA</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  options: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 90,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  terms: {
    fontSize: 14,
    fontWeight: 'light',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 25,
    width: '90%',
    justifyContent: 'center',
    marginVertical: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  emailButton: {
    backgroundColor: '#fa722d',
  },
  loginText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  loginLink: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;
