  // RegisterScreen.js

  import React, {useState} from 'react';

  import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
  import {
    ScrollView,
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StatusBar,
    StyleSheet,
    Alert,
  } from 'react-native';



  import Header from '../components/Header';
import Footer from '../components/Footer';


  function RegisterScreen({navigation}) {

    const [name, setName] = useState('');

    const [mobile, setMobile] = useState('');

    const [email, setEmail] = useState('');

    const [password, setPassword] =
      useState('');

    const [confirmPassword, setConfirmPassword] =
      useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ================= REGISTER =================

    
  const handleRegister = async () => {
  
  // ================= VALIDATIONS =================
    // NAME VALIDATION
      if (name === '') {
        Alert.alert(
          'Error',
          'Please enter name',
        );
        return;
      }

  // MOBILE VALIDATION
  if (mobile === '') {
    Alert.alert('Error', 'Please enter mobile number');
    return;
  }

  if (mobile.length !== 10) {
    Alert.alert('Error', 'Mobile number must be 10 digits');
    return;
  }
 // EMAIL VALIDATION
  if (email != '')
  {
      if (!email.includes('@')) {

        Alert.alert(
          'Error',
          'Please enter valid email', 
        );
        return;
      }
    }

 // PASSWORD VALIDATION
      if (password === '') {
        Alert.alert(
          'Error',
          'Please enter password',
        );
        return;
      }

      if (password.length < 6) {
        Alert.alert(
          'Error',
          'Password must be minimum 6 characters',
        );
        return;
      }

      // CONFIRM PASSWORD
      if (confirmPassword === '') {
        Alert.alert(
          'Error',
          'Please confirm password',
        );
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert(
          'Error',
          'Passwords do not match',
        );
        return;
      }



  try {
    const response = await fetch(
      'https://savariyaproperty.in/api/Register',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          mobile: mobile,
          email: email,
          password: password,
        }),
      },
    );

    const result = await response.json();

    if (response.ok && result.success) {
      // Login Session
      await AsyncStorage.setItem('userLogin', 'true');
      await AsyncStorage.setItem('userId', result.userId.toString());
      await AsyncStorage.setItem('userName', name);
     // await AsyncStorage.setItem('userName', name);
      await AsyncStorage.setItem('userMobile', mobile);
      await AsyncStorage.setItem('userEmail', email);
      // SAVE LOGIN SESSION
      //Alert.alert('Success', result.message);
      Alert.alert(
        'Success',
        'Registration Successful',
      );

      navigation.replace('Home');
    } else {
      Alert.alert('Error', result.message);
    }
  } catch (error) {
    console.log(error);
    Alert.alert('Error', 'Server connection failed');
  }
      Alert.alert(
        'Success',
        'Registration Successful',
      );
      // GO TO HOME PAGE
      navigation.replace('Home');
    };
     return (
  <SafeAreaView style={styles.safeContainer} >

    <Header />

     <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 100}}>

      <View style={styles.registerCard}>
        <Text style={styles.heading}>Create Account</Text>

        <Text style={styles.subHeading}>
          Register yourself to explore properties and connect with property owners.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter Full Name"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Enter Mobile Number"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
          maxLength={10}
          value={mobile}
          onChangeText={setMobile}
        />

        <TextInput
          style={styles.input}
          placeholder="Enter Email Address"
          placeholderTextColor="#999"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

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

<View style={styles.passwordContainer}>
  <TextInput
    style={styles.passwordInput}
    placeholder="Confirm Password"
    placeholderTextColor="#999"
    secureTextEntry={!showConfirmPassword}
    value={confirmPassword}
    onChangeText={setConfirmPassword}
  />

  <TouchableOpacity
    onPress={() =>
      setShowConfirmPassword(!showConfirmPassword)
    }>
    <Icon
      name={
        showConfirmPassword
          ? 'eye-off'
          : 'eye'
      }
      size={22}
      color="#666"
    />
  </TouchableOpacity>
</View>


        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}>
          <Text style={styles.registerButtonText}>
            Create Account
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginContainer}
          onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>
            Already have an account?{' '}
            <Text style={styles.loginLink}>Login</Text>
          </Text>
        </TouchableOpacity>
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

  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },

  registerCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },

  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
    marginBottom: 10,
  },

  subHeading: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },

  input: {
    height: 55,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#222',
    marginBottom: 16,
  },

  registerButton: {
    height: 55,
    backgroundColor: '#0A8754',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
  },

  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  loginContainer: {
    marginTop: 25,
    alignItems: 'center',
  },

  loginText: {
    fontSize: 15,
    color: '#666',
  },

  loginLink: {
    color: '#0A8754',
    fontWeight: '700',
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

  export default RegisterScreen;