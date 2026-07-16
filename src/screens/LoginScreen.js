// LoginScreen.js

import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Icon from 'react-native-vector-icons/FontAwesome5';


import {
  View,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Alert,
} from 'react-native';

function LoginScreen({navigation}) {

  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] =
        useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ================= LOGIN =================

  const handleLogin = async () => {

    const savedMobile =
      await AsyncStorage.getItem('userMobile');

    const savedPassword =
      await AsyncStorage.getItem('userPassword');

    const savedName =
      await AsyncStorage.getItem('userName');

    // VALIDATION

    if (mobile === '') {
      Alert.alert('Error', 'Please enter mobile number');
      return;
    }

    if (mobile.length !== 10) {
      Alert.alert('Error', 'Please enter valid 10 digit mobile number');
      return;
    }

    if (password === '') {
      Alert.alert('Error', 'Please enter password');
      return;
    }

    // CHECK LOGIN

    if (
      mobile !== savedMobile ||
      password !== savedPassword
    ) {
      Alert.alert('Error', 'Invalid Mobile Number or Password');
      return;
    }

    // SAVE LOGIN SESSION
    await AsyncStorage.setItem('userLogin', 'true');

    // 🔥 THIS IS MISSING (IMPORTANT FIX)
    await AsyncStorage.setItem('registeredName', savedName || 'User');

    Alert.alert('Success', 'Login Successful');

    navigation.replace('Home');
  };

return (
  <SafeAreaView style={styles.safeContainer} >
<Header/>
  <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 100}}>
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Login Account</Text>

      <View style={styles.card}>
        {/* Avatar */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👤</Text>
        </View>

        <Text style={styles.welcomeText}>Welcome Back</Text>
        <Text style={styles.subText}>
          Login to continue to your account
        </Text>

        {/* Mobile */}
        <Text style={styles.label}>Mobile Number</Text>

        <TextInput
          placeholder="Enter your mobile number"
          placeholderTextColor="#999"
          value={mobile}
          onChangeText={setMobile}
          keyboardType="numeric"
          maxLength={10}
          style={styles.input}
        />

        {/* Password */}
        <Text style={styles.label}>Password</Text>

        <View style={styles.passwordContainer}>
   <TextInput
      style={styles.passwordInput}
      placeholder="Enter Password"
      placeholderTextColor="#999"
      secureTextEntry={!showPassword}
      value={password}
      onChangeText={setPassword}
    />
  
    <TouchableOpacity
      onPress={() => setShowPassword(!showPassword)}>
      <Icon
        name={showPassword ? 'eye-off' : 'eye'}
        size={22}
        color="#666"
      />
    </TouchableOpacity>
</View>

        {/* Login Button */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        {/* Register */}
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerText}>
            Create New Account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
    </ScrollView>
    <Footer />
  </SafeAreaView>
);
}
const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },

  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },

  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
    marginBottom: 30,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },

  avatar: {
    width: 85,
    height: 85,
    borderRadius: 45,
    backgroundColor: '#0A84FF',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },

  avatarText: {
    fontSize: 38,
  },

  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
  },

  subText: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 30,
  },

  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '600',
  },

  input: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
    fontSize: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },

  showHideBtn: {
    alignSelf: 'flex-end',
    marginTop: -10,
    marginBottom: 20,
  },

  showHideText: {
    color: '#0A84FF',
    fontWeight: '600',
  },

  loginButton: {
    backgroundColor: '#28A745',
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    marginTop: 5,
  },

  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  registerButton: {
    marginTop: 25,
    alignItems: 'center',
  },

  registerText: {
    color: '#0A84FF',
    fontSize: 15,
    fontWeight: '600',
  },

  backButton: {
    marginTop: 15,
    alignItems: 'center',
  },

  backText: {
    color: '#777',
    fontSize: 15,
    fontWeight: '600',
  },
  passwordContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#FAFAFA',
  borderWidth: 1,
  borderColor: '#E5E7EB',
  borderRadius: 12,
  paddingHorizontal: 16,
  height: 55,
  marginBottom: 16,
},

passwordInput: {
  flex: 1,
  fontSize: 16,
  color: '#222',
},
});

export default LoginScreen;