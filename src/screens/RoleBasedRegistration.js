import React, {useEffect, useRef, useState} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';

const {width} = Dimensions.get('window');

const LoginPopup = ({
  visible,
  onClose,
  onLogin,
  onRegister,
  onGuest,
}) => {
  // =========================================================
  // ANIMATION
  // =========================================================

  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // =========================================================
// REGISTRATION - SCREEN 2
// =========================================================

const [companyName, setCompanyName] = useState('');
const [businessType, setBusinessType] = useState('');
const [city, setCity] = useState('');
const [experience, setExperience] = useState('');
const [workingArea, setWorkingArea] = useState('');

const [propertyType, setPropertyType] = useState('');
const [propertyLocation, setPropertyLocation] = useState('');
const [purpose, setPurpose] = useState('');

const [lookingFor, setLookingFor] = useState('');
const [preferredLocation, setPreferredLocation] = useState('');
const [budget, setBudget] = useState('');


  // =========================================================
  // POPUP MODE
  // =========================================================
  // main
  // login
  // roles
  // register

  const [popupMode, setPopupMode] = useState('main');

  // =========================================================
  // LOGIN
  // =========================================================

  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // =========================================================
  // REGISTRATION
  // =========================================================

  const [selectedRole, setSelectedRole] = useState('');

  const [name, setName] = useState('');
  const [registerMobile, setRegisterMobile] = useState('');
  const [email, setEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showRegisterPassword, setShowRegisterPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  // =========================================================
  // LOADING
  // =========================================================

  const [isLoading, setIsLoading] = useState(false);

  // =========================================================
  // OPEN POPUP
  // =========================================================

  useEffect(() => {
    if (visible) {
      resetPopup();

      scaleAnim.setValue(0.7);
      opacityAnim.setValue(0);

      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),

        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 7,
          tension: 70,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  // =========================================================
  // RESET
  // =========================================================

  const resetPopup = () => {
    setPopupMode('main');

    // Login
    setMobile('');
    setPassword('');
    setShowPassword(false);

    // Registration
    setSelectedRole('');
    setName('');
    setRegisterMobile('');
    setEmail('');
    setRegisterPassword('');
    setConfirmPassword('');

    setCompanyName('');
    setBusinessType('');
    setCity('');
    setExperience('');
    setWorkingArea('');
    setPropertyType('');
    setPropertyLocation('');
    setPurpose('');
    setLookingFor('');
    setPreferredLocation('');
    setBudget('');

    setShowRegisterPassword(false);
    setShowConfirmPassword(false);

    setIsLoading(false);
  };

  // =========================================================
  // CLOSE
  // =========================================================

  const handleClose = () => {
    if (isLoading) {
      return;
    }

    resetPopup();

    if (onClose) {
      onClose();
    }
  };

  // =========================================================
  // OPEN LOGIN
  // =========================================================

  const handleOpenLogin = () => {
    if (isLoading) {
      return;
    }

    setPopupMode('login');
  };

  // =========================================================
  // OPEN ROLE SELECTION
  // =========================================================

  const handleOpenRoles = () => {
    if (isLoading) {
      return;
    }

    setPopupMode('roles');
  };

  // =========================================================
  // SELECT ROLE
  // =========================================================

  const handleSelectRole = role => {
    setSelectedRole(role);

    setPopupMode('register');
  };

  // =========================================================
  // BACK
  // =========================================================

  const handleBack = () => {
    if (isLoading) {
      return;
    }

    if (popupMode === 'login') {
      setPopupMode('main');
      return;
    }

    if (popupMode === 'roles') {
      setPopupMode('main');
      return;
    }

    if (popupMode === 'register') {
      setPopupMode('roles');
      return;
    }
  };

  // =========================================================
  // LOGIN
  // =========================================================

  const handleLogin = async () => {
    if (mobile.trim() === '') {
      Alert.alert('Error', 'Please enter mobile number');
      return;
    }

    if (mobile.length !== 10) {
      Alert.alert('Error', 'Mobile number must be 10 digits');
      return;
    }

    if (password === '') {
      Alert.alert('Error', 'Please enter password');
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(
        'https://savariyaproperty.in/api/Login',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            mobile: mobile.trim(),
            password: password,
          }),
        },
      );

      const result = await response.json();

      console.log('LOGIN RESPONSE:', result);

      if (
        response.ok &&
        result.success === true &&
        result.statusCode === 1 &&
        result.data
      ) {
        const user = result.data;

        await AsyncStorage.setItem(
          'userLogin',
          'true',
        );

        const userId =
          user.id ??
          user.userId ??
          user.ID;

        if (
          userId !== undefined &&
          userId !== null
        ) {
          await AsyncStorage.setItem(
            'userId',
            userId.toString(),
          );
        }

        await AsyncStorage.setItem(
          'userName',
          user.name ||
            user.fullName ||
            '',
        );

        await AsyncStorage.setItem(
          'userMobile',
          user.mobile ||
            user.phone ||
            mobile.trim(),
        );

        await AsyncStorage.setItem(
          'userEmail',
          user.email || '',
        );

        await AsyncStorage.setItem(
          'userRole',
          user.role ||
            user.userRole ||
            'Property Seeker',
        );

        setIsLoading(false);

        Alert.alert(
          'Login Successful',
          'Welcome to ClickAangan',
          [
            {
              text: 'OK',
              onPress: () => {
                resetPopup();

                if (onLogin) {
                  onLogin();
                }
              },
            },
          ],
        );
      } else {
        setIsLoading(false);

        Alert.alert(
          'Login Failed',
          result.message ||
            'Invalid mobile number or password',
        );
      }
    } catch (error) {
      console.log('LOGIN ERROR:', error);

      setIsLoading(false);

      Alert.alert(
        'Error',
        'Unable to connect to server. Please try again.',
      );
    }
  };

  // =========================================================
  // REGISTRATION
  // =========================================================

  const handleRegister = async () => {
  // =========================================================
  // ROLE
  // =========================================================
  if (selectedRole === '') {
    Alert.alert('Error', 'Please select registration role');
    return;
  }

  // =========================================================
  // NAME
  // =========================================================
  if (name.trim() === '') {
    Alert.alert('Error', 'Please enter full name');
    return;
  }

  // =========================================================
  // MOBILE
  // =========================================================
  if (registerMobile.trim() === '') {
    Alert.alert('Error', 'Please enter mobile number');
    return;
  }

  if (registerMobile.length !== 10) {
    Alert.alert('Error', 'Mobile number must be 10 digits');
    return;
  }

  // =========================================================
  // EMAIL
  // =========================================================
  if (email.trim() !== '' && !email.includes('@')) {
    Alert.alert('Error', 'Please enter valid email');
    return;
  }

  // =========================================================
  // PASSWORD
  // =========================================================
  if (registerPassword === '') {
    Alert.alert('Error', 'Please enter password');
    return;
  }

  if (registerPassword.length < 6) {
    Alert.alert(
      'Error',
      'Password must be minimum 6 characters',
    );
    return;
  }

  // =========================================================
  // CONFIRM PASSWORD
  // =========================================================
  if (confirmPassword === '') {
    Alert.alert(
      'Error',
      'Please confirm password',
    );
    return;
  }

  if (registerPassword !== confirmPassword) {
    Alert.alert(
      'Error',
      'Passwords do not match',
    );
    return;
  }

  try {

    alert('1');
    setIsLoading(true);
alert('2');
    Alert.alert(
  'REGISTER API START',
  `ROLE: ${selectedRole}
NAME: ${name}
MOBILE: ${registerMobile}
EMAIL: ${email}`,
);

   const response = await fetch(
  'https://savariyaproperty.in/api/Register',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
        body: JSON.stringify({
          name: name.trim(),
          mobile: registerMobile.trim(),
          email: email.trim(),
          password: registerPassword,

          // IMPORTANT
          role: selectedRole,
        }),
      },
    );

alert('4');
    console.log('REGISTER HTTP STATUS:', response.status);

    const result = await response.json();

    console.log(
      'REGISTER RESPONSE:',
      JSON.stringify(result, null, 2),
    );
alert('5');
    if (
      response.ok &&
      result.success
    ) {
      alert('6');
      const userId =
        result.userId ??
        result.data?.id ??
        result.data?.userId ??
        result.data?.ID;

      const userRole =
        result.role ||
        result.userRole ||
        result.data?.role ||
        result.data?.userRole ||
        selectedRole;

      await AsyncStorage.setItem(
        'userLogin',
        'true',
      );

      if (
        userId !== undefined &&
        userId !== null
      ) {
        await AsyncStorage.setItem(
          'userId',
          userId.toString(),
        );
      }

      await AsyncStorage.setItem(
        'userName',
        name.trim(),
      );

      await AsyncStorage.setItem(
        'userMobile',
        registerMobile.trim(),
      );

      await AsyncStorage.setItem(
        'userEmail',
        email.trim(),
      );

      await AsyncStorage.setItem(
        'userRole',
        userRole,
      );

      setIsLoading(false);
alert('10');
      Alert.alert(
        'Registration Successful',
        `Welcome to ClickAangan, ${name.trim()}!`,
        [
          {
            text: 'Continue',
            onPress: () => {
              resetPopup();

              if (onLogin) {
                onLogin();
              } else if (onClose) {
                onClose();
              }
            },
          },
        ],
      );
    } else {
      setIsLoading(false);

      Alert.alert(
        'Registration Failed',
        result.message ||
          result.responseMessage ||
          'Unable to create account',
      );
    }
  } catch (error) {
    console.log(
      '====================================',
    );
    console.log(
      'REGISTER ERROR:',
      error,
    );
    console.log(
      '====================================');

    setIsLoading(false);

    Alert.alert(
      'Error',
      'Server connection failed. Please try again.',
    );
  }
};


  // =========================================================
  // HEADER DESCRIPTION
  // =========================================================

  const getDescription = () => {
    if (popupMode === 'login') {
      return 'Login to continue to your account';
    }

    if (popupMode === 'roles') {
      return 'Select your role to create your account';
    }

    if (popupMode === 'register') {
      return `Create your ${selectedRole} account`;
    }

    return "India's growing property platform for Owners, Builders, Customers and Property Partners.";
  };

  // =========================================================
  // ROLE DESCRIPTION
  // =========================================================

  const getRoleDescription = role => {
    switch (role) {
      case 'Property Seeker':
        return 'Buy or rent properties easily';

      case 'Property Owner':
        return 'Post and manage your properties';

      case 'Builder / Investor':
        return 'Promote projects and properties';

      case 'Property Partner':
        return 'Connect customers and earn money';

      default:
        return '';
    }
  };

  // =========================================================
  // ROLE ICON
  // =========================================================

  const getRoleIcon = role => {
    switch (role) {
      case 'Property Seeker':
        return 'search';

      case 'Property Owner':
        return 'home';

      case 'Builder / Investor':
        return 'building';

      case 'Property Partner':
        return 'briefcase';

      default:
        return 'user';
    }
  };

  // =========================================================
  // NOT VISIBLE
  // =========================================================

  if (!visible) {
    return null;
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <View style={styles.overlay}>

      <Animated.View
        style={[
          styles.card,
          {
            opacity: opacityAnim,

            transform: [
              {
                scale: scaleAnim,
              },
            ],
          },
        ]}
      >

        {/* ================================================= */}
        {/* CLOSE */}
        {/* ================================================= */}

        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleClose}
          disabled={isLoading}
        >
          <Text style={styles.closeText}>
            ✕
          </Text>
        </TouchableOpacity>

        <KeyboardAvoidingView
          behavior={
            Platform.OS === 'ios'
              ? 'padding'
              : undefined
          }
          style={{width: '100%'}}
        >

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingBottom: 3,
            }}
          >

            {/* ================================================= */}
            {/* COMMON HEADER */}
            {/* ================================================= */}

            <View style={styles.header}>

              <View style={styles.logoCircle}>
                <Text style={styles.logo}>
                  🏠
                </Text>
              </View>

              <Text style={styles.title}>
                Welcome to
              </Text>

              <Text style={styles.brand}>
                ClickAangan
              </Text>

              <Text style={styles.desc}>
                {getDescription()}
              </Text>

            </View>

            {/* ================================================= */}
            {/* MAIN */}
            {/* ================================================= */}

            {popupMode === 'main' && (
              <>

                <View style={styles.featureBox}>

                  {/* FIRST 100 */}

                  <View style={styles.featureRow}>

                    <Text style={styles.featureIcon}>
                      🎁
                    </Text>

                    <View style={styles.featureContent}>

                      <Text style={styles.featureTitle}>
                        First 100 Property Listings – FREE
                      </Text>

                      <Text style={styles.featureSub}>
                        List your property at no cost.
                      </Text>

                    </View>

                  </View>

                  {/* OWNER BUILDER */}

                  <View style={styles.featureRow}>

                    <Text style={styles.featureIcon}>
                      🏠
                    </Text>

                    <View style={styles.featureContent}>

                      <Text style={styles.featureTitle}>
                        Free Property Posting
                      </Text>

                      <Text style={styles.featureSub}>
                        Owners & Builders can post free.
                      </Text>

                    </View>

                  </View>

                  {/* SEARCH */}

                  <View style={styles.featureRow}>

                    <Text style={styles.featureIcon}>
                      🔍
                    </Text>

                    <View style={styles.featureContent}>

                      <Text style={styles.featureTitle}>
                        Free Property Search
                      </Text>

                      <Text style={styles.featureSub}>
                        Search free as Customer / Seeker.
                      </Text>

                    </View>

                  </View>

                  {/* PARTNER */}

                  <View style={styles.featureRow}>

                    <Text style={styles.featureIcon}>
                      💰
                    </Text>

                    <View style={styles.featureContent}>

                      <Text style={styles.featureTitle}>
                        Earn Money as Property Partners
                      </Text>

                      <Text style={styles.featureSub}>
                        Connect customers with properties and earn.
                      </Text>

                    </View>

                  </View>

                </View>

                {/* LOGIN */}

                <TouchableOpacity
                  style={styles.loginBtn}
                  onPress={handleOpenLogin}
                  disabled={isLoading}
                >

                  <Icon
                    name="sign-in-alt"
                    size={14}
                    color="#FFFFFF"
                  />

                  <Text style={styles.loginText}>
                    Login
                  </Text>

                </TouchableOpacity>

                {/* CREATE ACCOUNT */}

                <TouchableOpacity
                  style={styles.registerBtn}
                  onPress={handleOpenRoles}
                  disabled={isLoading}
                >

                  <Icon
                    name="user-plus"
                    size={13}
                    color="#F58220"
                  />

                  <Text style={styles.registerText}>
                    Create Account
                  </Text>

                </TouchableOpacity>

                <View style={styles.secureRow}>

                  <Icon
                    name="shield-alt"
                    size={11}
                    color="#888"
                  />

                  <Text style={styles.secureText}>
                    Your information is safe and secure
                  </Text>

                </View>

              </>
            )}

            {/* ================================================= */}
            {/* ROLE SELECTION */}
            {/* ================================================= */}

            {popupMode === 'roles' && (
              <View style={styles.formContainer}>

                <Text style={styles.sectionTitle}>
                  I am a
                </Text>

                {/* SEEKER */}

                <TouchableOpacity
                  style={styles.roleCard}
                  onPress={() =>
                    handleSelectRole(
                      'Property Seeker',
                    )
                  }
                >

                  <View style={styles.roleIconCircle}>
                    <Icon
                      name="search"
                      size={17}
                      color="#012353"
                    />
                  </View>

                  <View style={styles.roleContent}>

                    <Text style={styles.roleTitle}>
                      Property Seeker
                    </Text>

                    <Text style={styles.roleSub}>
                      Buy or rent properties easily
                    </Text>

                  </View>

                  <Icon
                    name="chevron-right"
                    size={13}
                    color="#999"
                  />

                </TouchableOpacity>

                {/* OWNER */}

                <TouchableOpacity
                  style={styles.roleCard}
                  onPress={() =>
                    handleSelectRole(
                      'Property Owner',
                    )
                  }
                >

                  <View style={styles.roleIconCircle}>
                    <Icon
                      name="home"
                      size={17}
                      color="#012353"
                    />
                  </View>

                  <View style={styles.roleContent}>

                    <Text style={styles.roleTitle}>
                      Property Owner
                    </Text>

                    <Text style={styles.roleSub}>
                      Post and manage your properties
                    </Text>

                  </View>

                  <Icon
                    name="chevron-right"
                    size={13}
                    color="#999"
                  />

                </TouchableOpacity>

                {/* BUILDER */}

                <TouchableOpacity
                  style={styles.roleCard}
                  onPress={() =>
                    handleSelectRole(
                      'Builder / Investor',
                    )
                  }
                >

                  <View style={styles.roleIconCircle}>
                    <Icon
                      name="building"
                      size={17}
                      color="#012353"
                    />
                  </View>

                  <View style={styles.roleContent}>

                    <Text style={styles.roleTitle}>
                      Builder / Investor
                    </Text>

                    <Text style={styles.roleSub}>
                      Promote projects and properties
                    </Text>

                  </View>

                  <Icon
                    name="chevron-right"
                    size={13}
                    color="#999"
                  />

                </TouchableOpacity>

                {/* PARTNER */}

                <TouchableOpacity
                  style={styles.roleCard}
                  onPress={() =>
                    handleSelectRole(
                      'Property Partner',
                    )
                  }
                >

                  <View style={styles.roleIconCircle}>
                    <Icon
                      name="briefcase"
                      size={17}
                      color="#012353"
                    />
                  </View>

                  <View style={styles.roleContent}>

                    <Text style={styles.roleTitle}>
                      Property Partner
                    </Text>

                    <Text style={styles.roleSub}>
                      Connect customers and earn money
                    </Text>

                  </View>

                  <Icon
                    name="chevron-right"
                    size={13}
                    color="#999"
                  />

                </TouchableOpacity>

                {/* BACK */}

                <TouchableOpacity
                  style={styles.backBtn}
                  onPress={handleBack}
                >

                  <Icon
                    name="arrow-left"
                    size={11}
                    color="#666"
                  />

                  <Text style={styles.backText}>
                    Back
                  </Text>

                </TouchableOpacity>

              </View>
            )}

            {/* ================================================= */}
            {/* LOGIN FORM */}
            {/* ================================================= */}

            {popupMode === 'login' && (
              <View style={styles.formContainer}>

                {/* MOBILE */}

                <Text style={styles.label}>
                  Mobile Number
                </Text>

                <View style={styles.inputContainer}>

                  <Icon
                    name="mobile-alt"
                    size={14}
                    color="#012353"
                    style={styles.inputIcon}
                  />

                  <TextInput
                    value={mobile}
                    onChangeText={text =>
                      setMobile(
                        text
                          .replace(/[^0-9]/g, '')
                          .slice(0, 10),
                      )
                    }
                    placeholder="Enter 10 digit mobile number"
                    placeholderTextColor="#999"
                    keyboardType="number-pad"
                    maxLength={10}
                    style={styles.input}
                  />

                </View>

                {/* PASSWORD */}

                <Text style={styles.label}>
                  Password
                </Text>

                <View style={styles.passwordContainer}>

                  <Icon
                    name="lock"
                    size={14}
                    color="#012353"
                    style={styles.inputIcon}
                  />

                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter password"
                    placeholderTextColor="#999"
                    secureTextEntry={!showPassword}
                    style={styles.passwordInput}
                  />

                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() =>
                      setShowPassword(
                        !showPassword,
                      )
                    }
                  >

                    <Icon
                      name={
                        showPassword
                          ? 'eye-slash'
                          : 'eye'
                      }
                      size={14}
                      color="#777"
                    />

                  </TouchableOpacity>

                </View>

                {/* LOGIN BUTTON */}

                <TouchableOpacity
                  style={styles.loginBtn}
                  onPress={handleLogin}
                  disabled={isLoading}
                >

                  {isLoading ? (
                    <ActivityIndicator
                      size="small"
                      color="#FFFFFF"
                    />
                  ) : (
                    <>
                      <Icon
                        name="sign-in-alt"
                        size={14}
                        color="#FFFFFF"
                      />

                      <Text style={styles.loginText}>
                        Login
                      </Text>
                    </>
                  )}

                </TouchableOpacity>

                {/* REGISTER */}

                <TouchableOpacity
                  style={styles.registerBtn}
                  onPress={handleOpenRoles}
                  disabled={isLoading}
                >

                  <Icon
                    name="user-plus"
                    size={13}
                    color="#F58220"
                  />

                  <Text style={styles.registerText}>
                    Create New Account
                  </Text>

                </TouchableOpacity>

                {/* BACK */}

                <TouchableOpacity
                  style={styles.backBtn}
                  onPress={handleBack}
                  disabled={isLoading}
                >

                  <Icon
                    name="arrow-left"
                    size={11}
                    color="#666"
                  />

                  <Text style={styles.backText}>
                    Back
                  </Text>

                </TouchableOpacity>

              </View>
            )}

            {/* ================================================= */}
            {/* REGISTER FORM */}
            {/* ================================================= */}

            {popupMode === 'register' && (
              <View style={styles.formContainer}>

                {/* SELECTED ROLE */}

                <View style={styles.selectedRoleBox}>

                  <View style={styles.selectedRoleIcon}>

                    <Icon
                      name={getRoleIcon(selectedRole)}
                      size={15}
                      color="#012353"
                    />

                  </View>

                  <View style={{flex: 1}}>

                    <Text style={styles.selectedRoleLabel}>
                      Registering as
                    </Text>

                    <Text style={styles.selectedRoleText}>
                      {selectedRole}
                    </Text>

                  </View>

                  <TouchableOpacity
                    onPress={() =>
                      setPopupMode('roles')
                    }
                  >
                    <Text style={styles.changeRole}>
                      Change
                    </Text>
                  </TouchableOpacity>

                </View>

                {/* NAME */}

                <Text style={styles.label}>
                  Full Name
                </Text>

                <View style={styles.inputContainer}>

                  <Icon
                    name="user"
                    size={13}
                    color="#012353"
                    style={styles.inputIcon}
                  />

                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your full name"
                    placeholderTextColor="#999"
                    style={styles.input}
                  />

                </View>

                {/* MOBILE */}

                <Text style={styles.label}>
                  Mobile Number
                </Text>

                <View style={styles.inputContainer}>

                  <Icon
                    name="mobile-alt"
                    size={14}
                    color="#012353"
                    style={styles.inputIcon}
                  />

                  <TextInput
                    value={registerMobile}
                    onChangeText={text =>
                      setRegisterMobile(
                        text
                          .replace(/[^0-9]/g, '')
                          .slice(0, 10),
                      )
                    }
                    placeholder="Enter 10 digit mobile number"
                    placeholderTextColor="#999"
                    keyboardType="number-pad"
                    maxLength={10}
                    style={styles.input}
                  />

                </View>

                {/* EMAIL */}

                <Text style={styles.label}>
                  Email Address
                </Text>

                <View style={styles.inputContainer}>

                  <Icon
                    name="envelope"
                    size={13}
                    color="#012353"
                    style={styles.inputIcon}
                  />

                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter email address"
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                  />

                </View>

                {/* PASSWORD */}

                <Text style={styles.label}>
                  Password
                </Text>

                <View style={styles.passwordContainer}>

                  <Icon
                    name="lock"
                    size={14}
                    color="#012353"
                    style={styles.inputIcon}
                  />

                  <TextInput
                    value={registerPassword}
                    onChangeText={setRegisterPassword}
                    placeholder="Minimum 6 characters"
                    placeholderTextColor="#999"
                    secureTextEntry={
                      !showRegisterPassword
                    }
                    style={styles.passwordInput}
                  />

                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() =>
                      setShowRegisterPassword(
                        !showRegisterPassword,
                      )
                    }
                  >

                    <Icon
                      name={
                        showRegisterPassword
                          ? 'eye-slash'
                          : 'eye'
                      }
                      size={14}
                      color="#777"
                    />

                  </TouchableOpacity>

                </View>

                {/* CONFIRM */}

                <Text style={styles.label}>
                  Confirm Password
                </Text>

                <View style={styles.passwordContainer}>

                  <Icon
                    name="lock"
                    size={14}
                    color="#012353"
                    style={styles.inputIcon}
                  />

                  <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Re-enter password"
                    placeholderTextColor="#999"
                    secureTextEntry={
                      !showConfirmPassword
                    }
                    style={styles.passwordInput}
                  />

                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword,
                      )
                    }
                  >

                    <Icon
                      name={
                        showConfirmPassword
                          ? 'eye-slash'
                          : 'eye'
                      }
                      size={14}
                      color="#777"
                    />

                  </TouchableOpacity>

                </View>

                {/* CREATE ACCOUNT */}

              <TouchableOpacity
  style={styles.loginBtn}
  onPress={() => {
    Alert.alert('BUTTON TEST', 'Create Account button clicked');
    handleRegister();
  }}
  disabled={isLoading}
>

                  {isLoading ? (
                    <ActivityIndicator
                      size="small"
                      color="#FFFFFF"
                    />
                  ) : (
                    <>
                      <Icon
                        name="user-plus"
                        size={13}
                        color="#FFFFFF"
                      />

                      <Text style={styles.loginText}>
                        Create Account
                      </Text>
                    </>
                  )}

                </TouchableOpacity>

                {/* LOGIN */}

                <TouchableOpacity
                  style={styles.registerBtn}
                  onPress={handleOpenLogin}
                  disabled={isLoading}
                >

                  <Icon
                    name="sign-in-alt"
                    size={13}
                    color="#F58220"
                  />

                  <Text style={styles.registerText}>
                    Already have an account? Login
                  </Text>

                </TouchableOpacity>

                {/* BACK */}

                <TouchableOpacity
                  style={styles.backBtn}
                  onPress={handleBack}
                  disabled={isLoading}
                >

                  <Icon
                    name="arrow-left"
                    size={11}
                    color="#666"
                  />

                  <Text style={styles.backText}>
                    Change Registration Role
                  </Text>

                </TouchableOpacity>

              </View>
            )}

          </ScrollView>

        </KeyboardAvoidingView>

      </Animated.View>

    </View>
  );
};

// =============================================================
// STYLES
// =============================================================

const styles = StyleSheet.create({

  overlay: {
    position: 'absolute',

    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    backgroundColor: 'rgba(0,0,0,0.60)',

    justifyContent: 'center',
    alignItems: 'center',

    zIndex: 9999,
    elevation: 9999,
  },

  card: {
    width: width - 32,

    maxHeight: '88%',

    backgroundColor: '#FFFFFF',

    borderRadius: 20,

    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 14,

    elevation: 10,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 5,
    },

    shadowOpacity: 0.25,

    shadowRadius: 8,
  },

  closeButton: {
    position: 'absolute',

    right: 10,
    top: 8,

    width: 30,
    height: 30,

    borderRadius: 15,

    justifyContent: 'center',
    alignItems: 'center',

    zIndex: 20,
  },

  closeText: {
    fontSize: 17,
    color: '#777',
    fontWeight: '600',
  },

  // ===========================================================
  // HEADER
  // ===========================================================

  header: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 1,
  },

  logoCircle: {
    width: 58,
    height: 58,

    borderRadius: 29,

    backgroundColor: '#EAF4FF',

    justifyContent: 'center',
    alignItems: 'center',

    marginBottom: 7,

    borderWidth: 1,
    borderColor: '#D9E8F7',
  },

  logo: {
    fontSize: 29,
  },

  title: {
    fontSize: 15,

    color: '#555',

    fontWeight: '500',

    lineHeight: 18,
  },

  brand: {
    fontSize: 23,

    fontWeight: 'bold',

    color: '#012353',

    marginTop: 1,

    textAlign: 'center',

    lineHeight: 28,
  },

  desc: {
    marginTop: 5,

    marginHorizontal: 5,

    textAlign: 'center',

    color: '#666',

    lineHeight: 17,

    fontSize: 12.5,

    marginBottom: 10,
  },

  // ===========================================================
  // MAIN FEATURES
  // ===========================================================

  featureBox: {
    marginTop: 1,

    width: '100%',

    backgroundColor: '#F6F8FC',

    borderRadius: 12,

    paddingHorizontal: 9,

    paddingVertical: 4,
  },

  featureRow: {
    flexDirection: 'row',

    alignItems: 'center',

    paddingVertical: 5,
  },

  featureIcon: {
    width: 29,

    fontSize: 17,

    textAlign: 'center',

    marginRight: 6,
  },

  featureContent: {
    flex: 1,
  },

  featureTitle: {
    fontSize: 12.8,

    fontWeight: '700',

    color: '#012353',

    lineHeight: 17,
  },

  featureSub: {
    fontSize: 10.8,

    color: '#666',

    marginTop: 0,

    lineHeight: 14,
  },

  // ===========================================================
  // BUTTONS
  // ===========================================================

  loginBtn: {
    width: '100%',

    minHeight: 43,

    borderRadius: 10,

    backgroundColor: '#012353',

    justifyContent: 'center',
    alignItems: 'center',

    flexDirection: 'row',

    elevation: 3,

    marginTop: 8,

    paddingHorizontal: 10,
  },

  loginText: {
    color: '#FFFFFF',

    fontSize: 15,

    fontWeight: '700',

    marginLeft: 7,
  },

  registerBtn: {
    width: '100%',

    minHeight: 42,

    borderRadius: 10,

    borderWidth: 1.5,

    borderColor: '#F58220',

    justifyContent: 'center',
    alignItems: 'center',

    flexDirection: 'row',

    marginTop: 7,

    backgroundColor: '#FFFFFF',

    paddingHorizontal: 8,
  },

  registerText: {
    color: '#F58220',

    fontWeight: '700',

    fontSize: 13.5,

    marginLeft: 7,

    textAlign: 'center',
  },

  // ===========================================================
  // SECURITY
  // ===========================================================

  secureRow: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    marginTop: 9,
  },

  secureText: {
    color: '#888',

    fontSize: 10.5,

    marginLeft: 5,
  },

  // ===========================================================
  // FORM
  // ===========================================================

  formContainer: {
    width: '100%',
  },

  sectionTitle: {
    fontSize: 14,

    fontWeight: '700',

    color: '#012353',

    marginBottom: 8,

    textAlign: 'left',
  },

  label: {
    width: '100%',

    fontSize: 11.5,

    fontWeight: '700',

    color: '#012353',

    marginBottom: 4,

    marginTop: 3,
  },

  inputContainer: {
    width: '100%',

    height: 42,

    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: '#FAFBFD',

    borderWidth: 1,

    borderColor: '#E2E6EC',

    borderRadius: 9,

    paddingHorizontal: 10,

    marginBottom: 7,
  },

  inputIcon: {
    width: 22,

    textAlign: 'center',

    marginRight: 5,
  },

  input: {
    flex: 1,

    height: 42,

    fontSize: 13.5,

    color: '#222',

    paddingVertical: 0,
  },

  passwordContainer: {
    width: '100%',

    height: 42,

    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: '#FAFBFD',

    borderWidth: 1,

    borderColor: '#E2E6EC',

    borderRadius: 9,

    paddingHorizontal: 10,

    marginBottom: 7,
  },

  passwordInput: {
    flex: 1,

    height: 42,

    fontSize: 13.5,

    color: '#222',

    paddingVertical: 0,
  },

  eyeButton: {
    width: 32,

    height: 40,

    justifyContent: 'center',

    alignItems: 'center',
  },

  // ===========================================================
  // ROLE CARD
  // ===========================================================

  roleCard: {
    width: '100%',

    minHeight: 58,

    borderWidth: 1,

    borderColor: '#E2E6EC',

    borderRadius: 11,

    backgroundColor: '#FAFBFD',

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 10,

    marginBottom: 7,
  },

  roleIconCircle: {
    width: 38,

    height: 38,

    borderRadius: 19,

    backgroundColor: '#EAF4FF',

    justifyContent: 'center',

    alignItems: 'center',

    marginRight: 10,
  },

  roleContent: {
    flex: 1,
  },

  roleTitle: {
    fontSize: 13.5,

    fontWeight: '700',

    color: '#012353',
  },

  roleSub: {
    fontSize: 10.5,

    color: '#777',

    marginTop: 2,
  },

  // ===========================================================
  // SELECTED ROLE
  // ===========================================================

  selectedRoleBox: {
    width: '100%',

    minHeight: 52,

    backgroundColor: '#F6F8FC',

    borderRadius: 10,

    borderWidth: 1,

    borderColor: '#DDE6F0',

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 9,

    marginBottom: 7,
  },

  selectedRoleIcon: {
    width: 34,

    height: 34,

    borderRadius: 17,

    backgroundColor: '#EAF4FF',

    justifyContent: 'center',

    alignItems: 'center',

    marginRight: 8,
  },

  selectedRoleLabel: {
    fontSize: 9.5,

    color: '#777',
  },

  selectedRoleText: {
    fontSize: 12.5,

    color: '#012353',

    fontWeight: '700',

    marginTop: 1,
  },

  changeRole: {
    color: '#F58220',

    fontSize: 11,

    fontWeight: '700',
  },

  // ===========================================================
  // BACK
  // ===========================================================

  backBtn: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    marginTop: 9,

    paddingVertical: 3,
  },

  backText: {
    color: '#666',

    fontSize: 11.5,

    fontWeight: '600',

    marginLeft: 5,
  },
});

export default LoginPopup;
