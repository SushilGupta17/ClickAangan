import React, {useEffect, useRef, useState} from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';

const {width, height} = Dimensions.get('window');

const LoginPopup = ({
  visible,
  onClose,
  onLogin,
  onRegister,
  onGuest,
}) => {
  // =====================================================
  // ANIMATION
  // =====================================================

  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // =====================================================
  // POPUP MODE
  // main -> Main popup
  // login -> Login form
  // =====================================================

  const [popupMode, setPopupMode] = useState('main');

  // =====================================================
  // LOGIN STATE
  // =====================================================

  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // =====================================================
  // OPEN POPUP
  // =====================================================

  useEffect(() => {
    if (!visible) {
      return;
    }

    setPopupMode('main');
    setMobile('');
    setPassword('');
    setShowPassword(false);
    setIsLoading(false);

    scaleAnim.setValue(0.7);
    opacityAnim.setValue(0);

    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),

      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, opacityAnim, scaleAnim]);

  // =====================================================
  // CLOSE
  // =====================================================

  const handleClose = () => {
    setPopupMode('main');
    setMobile('');
    setPassword('');
    setShowPassword(false);
    setIsLoading(false);

    if (onClose) {
      onClose();
    }
  };

  // =====================================================
  // OPEN LOGIN
  // =====================================================

  const handleOpenLogin = () => {
    setPopupMode('login');
    setMobile('');
    setPassword('');
    setShowPassword(false);
  };

  // =====================================================
  // BACK
  // =====================================================

  const handleBack = () => {
    setPopupMode('main');
    setMobile('');
    setPassword('');
    setShowPassword(false);
    setIsLoading(false);
  };

  // =====================================================
  // LOGIN
  // =====================================================

  const handleLogin = async () => {
    const cleanMobile = mobile.trim();
    const cleanPassword = password.trim();

    if (cleanMobile === '') {
      Alert.alert('Error', 'Please enter mobile number');
      return;
    }

    if (cleanMobile.length !== 10) {
      Alert.alert('Error', 'Please enter valid mobile number');
      return;
    }

    if (cleanPassword === '') {
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
            mobile: cleanMobile,
            password: cleanPassword,
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

        console.log('LOGIN USER:', user);

        // =================================================
        // SAVE USER DATA
        // =================================================

        await AsyncStorage.setItem('userLogin', 'true');

        await AsyncStorage.setItem(
          'userId',
          user.id != null ? user.id.toString() : '',
        );

        await AsyncStorage.setItem(
          'userName',
          user.name || '',
        );

        await AsyncStorage.setItem(
          'userMobile',
          user.mobile || cleanMobile,
        );

        await AsyncStorage.setItem(
          'userEmail',
          user.email || '',
        );

        await AsyncStorage.setItem(
          'userRole',
          user.role || user.Role || 'PROPERTY_SEEKER',
        );

        // =================================================
        // SUCCESS
        // =================================================

        Alert.alert(
          'Success',
          result.message || 'Login Successful',
          [
            {
              text: 'OK',

              onPress: () => {
                setIsLoading(false);
                setPopupMode('main');

                if (onLogin) {
                  onLogin(user);
                } else if (onClose) {
                  onClose();
                }
              },
            },
          ],
          {
            cancelable: false,
          },
        );
      } else {
        setIsLoading(false);

        Alert.alert(
          'Error',
          result.message ||
            'Invalid Mobile Number or Password',
        );
      }
    } catch (error) {
      console.log('LOGIN ERROR:', error);

      setIsLoading(false);

      Alert.alert(
        'Error',
        'Unable to connect server.',
      );
    }
  };

  // =====================================================
  // REGISTER
  // =====================================================

  const handleRegister = () => {
    if (onRegister) {
      onRegister();
    }
  };

  // =====================================================
  // GUEST
  // =====================================================

  const handleGuest = () => {
    if (onGuest) {
      onGuest();
    } else {
      handleClose();
    }
  };

  // =====================================================
  // HIDDEN
  // =====================================================

  if (!visible) {
    return null;
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          opacity: opacityAnim,
        },
      ]}>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }>

        <Animated.View
          style={[
            styles.card,
            {
              transform: [
                {
                  scale: scaleAnim,
                },
              ],
            },
          ]}>

          {/* TOP ORANGE ACCENT */}

          <View style={styles.topAccent} />

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">

            {/* ================================================= */}
            {/* CLOSE */}
            {/* ================================================= */}

            <TouchableOpacity
              style={styles.close}
              onPress={handleClose}
              activeOpacity={0.7}>

              <Text style={styles.closeText}>
                ×
              </Text>

            </TouchableOpacity>

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <View style={styles.logoCircle}>
              <Text style={styles.logo}>
                🏠
              </Text>
            </View>

            <Text style={styles.title}>
              Welcome to
            </Text>

            <Text style={styles.brand}>
              Savariya Property
            </Text>

            <Text style={styles.desc}>
              {popupMode === 'login'
                ? 'Login to continue to your account'
                : "India's growing property platform for Owners, Builders, Customers and Property Partners."}
            </Text>

            {/* ================================================= */}
            {/* MAIN POPUP */}
            {/* ================================================= */}

            {popupMode === 'main' && (
              <>
                {/* FEATURE BOX */}

                <View style={styles.featureBox}>

                  {/* FEATURE 1 */}

                  <View style={styles.featureRow}>

                    <View style={styles.featureIconCircle}>
                      <Text style={styles.featureIcon}>
                        🏠
                      </Text>
                    </View>

                    <View style={styles.featureContent}>

                      <Text style={styles.featureTitle}>
                        First 100 Property Listings
                        <Text style={styles.orangeText}>
                          {' '}– FREE
                        </Text>
                      </Text>

                      <Text style={styles.featureSub}>
                        List your property without any charge.
                      </Text>

                    </View>
                  </View>

                  {/* FEATURE 2 */}

                  <View style={styles.featureRow}>

                    <View style={styles.featureIconCircle}>
                      <Text style={styles.featureIcon}>
                        📝
                      </Text>
                    </View>

                    <View style={styles.featureContent}>

                      <Text style={styles.featureTitle}>
                        Free Property Posting
                      </Text>

                      <Text style={styles.featureSub}>
                        Owners & Builders can post properties free.
                      </Text>

                    </View>
                  </View>

                  {/* FEATURE 3 */}

                  <View style={styles.featureRow}>

                    <View style={styles.featureIconCircle}>
                      <Text style={styles.featureIcon}>
                        🔍
                      </Text>
                    </View>

                    <View style={styles.featureContent}>

                      <Text style={styles.featureTitle}>
                        Free Property Search
                      </Text>

                      <Text style={styles.featureSub}>
                        Customers / Seekers can search properties free.
                      </Text>

                    </View>
                  </View>

                  {/* FEATURE 4 */}

                  <View
                    style={[
                      styles.featureRow,
                      styles.lastFeatureRow,
                    ]}>

                    <View style={styles.featureIconCircle}>
                      <Text style={styles.featureIcon}>
                        💰
                      </Text>
                    </View>

                    <View style={styles.featureContent}>

                      <Text style={styles.featureTitle}>
                        Earn Money as Property Partner
                      </Text>

                      <Text style={styles.featureSub}>
                        Connect property owners with customers and earn.
                      </Text>

                    </View>
                  </View>

                </View>

                {/* LOGIN */}

                <TouchableOpacity
                  style={styles.loginBtn}
                  onPress={handleOpenLogin}
                  activeOpacity={0.8}>

                  <Icon
                    name="sign-in-alt"
                    size={15}
                    color="#FFFFFF"
                  />

                  <Text style={styles.loginText}>
                    Login
                  </Text>

                </TouchableOpacity>

                {/* REGISTER */}

                <TouchableOpacity
                  style={styles.registerBtn}
                  onPress={handleRegister}
                  activeOpacity={0.8}>

                  <Icon
                    name="user-plus"
                    size={13}
                    color="#F58220"
                  />

                  <Text style={styles.registerText}>
                    Create Account
                  </Text>

                </TouchableOpacity>

                {/* SECURITY */}

                <View style={styles.secureRow}>

                  <Icon
                    name="shield-alt"
                    size={11}
                    color="#777"
                  />

                  <Text style={styles.secureText}>
                    Your information is secure
                  </Text>

                </View>
              </>
            )}

            {/* ================================================= */}
            {/* LOGIN FORM */}
            {/* ================================================= */}

            {popupMode === 'login' && (
              <>

                {/* MOBILE */}

                <Text style={styles.label}>
                  Mobile Number
                </Text>

                <View style={styles.inputContainer}>

                  <View style={styles.inputIconCircle}>
                    <Icon
                      name="mobile-alt"
                      size={14}
                      color="#012353"
                    />
                  </View>

                  <TextInput
                    placeholder="Enter mobile number"
                    placeholderTextColor="#999"
                    value={mobile}
                    onChangeText={text => {
                      setMobile(
                        text.replace(/[^0-9]/g, ''),
                      );
                    }}
                    keyboardType="numeric"
                    maxLength={10}
                    style={styles.input}
                    returnKeyType="next"
                  />

                </View>

                {/* PASSWORD */}

                <Text style={styles.label}>
                  Password
                </Text>

                <View style={styles.passwordContainer}>

                  <View style={styles.inputIconCircle}>
                    <Icon
                      name="lock"
                      size={14}
                      color="#012353"
                    />
                  </View>

                  <TextInput
                    placeholder="Enter password"
                    placeholderTextColor="#999"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    style={styles.passwordInput}
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                  />

                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() =>
                      setShowPassword(!showPassword)
                    }
                    activeOpacity={0.7}>

                    <Icon
                      name={
                        showPassword
                          ? 'eye-slash'
                          : 'eye'
                      }
                      size={16}
                      color="#666"
                    />

                  </TouchableOpacity>

                </View>

                {/* LOGIN BUTTON */}

                <TouchableOpacity
                  style={[
                    styles.loginBtn,
                    isLoading &&
                      styles.loginBtnDisabled,
                  ]}
                  onPress={handleLogin}
                  activeOpacity={0.8}
                  disabled={isLoading}>

                  <Icon
                    name="sign-in-alt"
                    size={15}
                    color="#FFFFFF"
                  />

                  <Text style={styles.loginText}>
                    {isLoading
                      ? 'Logging in...'
                      : 'Login'}
                  </Text>

                </TouchableOpacity>

                {/* CREATE ACCOUNT */}

                <TouchableOpacity
                  style={styles.registerBtn}
                  onPress={handleRegister}
                  activeOpacity={0.8}>

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
                  activeOpacity={0.7}>

                  <Icon
                    name="arrow-left"
                    size={12}
                    color="#666"
                  />

                  <Text style={styles.backText}>
                    Back
                  </Text>

                </TouchableOpacity>

                {/* SECURITY */}

                <View style={styles.secureRow}>

                  <Icon
                    name="shield-alt"
                    size={11}
                    color="#777"
                  />

                  <Text style={styles.secureText}>
                    Your information is secure
                  </Text>

                </View>

              </>
            )}

          </ScrollView>

        </Animated.View>

      </KeyboardAvoidingView>

    </Animated.View>
  );
};

// =========================================================
// STYLES
// =========================================================

const styles = StyleSheet.create({

  // =====================================================
  // OVERLAY
  // =====================================================

  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,

    backgroundColor: 'rgba(1,35,83,0.58)',

    justifyContent: 'center',
    alignItems: 'center',

    zIndex: 9999,
    elevation: 9999,
  },

  keyboardContainer: {
    width: '100%',
    height: '100%',

    alignItems: 'center',
    justifyContent: 'center',
  },

  // =====================================================
  // CARD
  // =====================================================

  card: {
    width: width - 32,

    maxHeight: height * 0.88,

    backgroundColor: '#FFFFFF',

    borderRadius: 20,

    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 15,

    alignItems: 'center',

    elevation: 12,

    shadowColor: '#012353',

    shadowOffset: {
      width: 0,
      height: 5,
    },

    shadowOpacity: 0.22,
    shadowRadius: 10,

    overflow: 'hidden',
  },

  topAccent: {
    position: 'absolute',

    top: 0,
    left: 0,
    right: 0,

    height: 4,

    backgroundColor: '#F58220',
  },

  scrollView: {
    width: '100%',
  },

  scrollContent: {
    alignItems: 'center',
    paddingBottom: 4,
  },

  // =====================================================
  // CLOSE
  // =====================================================

  close: {
    position: 'absolute',

    right: 11,
    top: 11,

    width: 30,
    height: 30,

    borderRadius: 15,

    backgroundColor: '#F4F7FB',

    justifyContent: 'center',
    alignItems: 'center',

    zIndex: 10,
  },

  closeText: {
    fontSize: 22,
    lineHeight: 23,

    color: '#012353',

    fontWeight: '500',
  },

  // =====================================================
  // LOGO
  // =====================================================

  logoCircle: {
    width: 60,
    height: 60,

    borderRadius: 30,

    backgroundColor: '#EAF4FF',

    borderWidth: 1,
    borderColor: '#D6E9FA',

    justifyContent: 'center',
    alignItems: 'center',

    marginBottom: 7,

    shadowColor: '#012353',

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.08,
    shadowRadius: 4,

    elevation: 2,
  },

  logo: {
    fontSize: 29,
  },

  // =====================================================
  // HEADER
  // =====================================================

  title: {
    fontSize: 15,

    color: '#666',

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
    marginTop: 6,

    marginHorizontal: 7,

    textAlign: 'center',

    color: '#666',

    lineHeight: 17,

    fontSize: 12.3,
  },

  // =====================================================
  // FEATURE BOX
  // =====================================================

  featureBox: {
    marginTop: 9,

    width: '100%',

    backgroundColor: '#F7FAFE',

    borderRadius: 13,

    borderWidth: 1,
    borderColor: '#E5EDF6',

    paddingHorizontal: 9,
    paddingVertical: 4,
  },

  featureRow: {
    flexDirection: 'row',

    alignItems: 'center',

    paddingVertical: 6,

    borderBottomWidth: 1,

    borderBottomColor: '#E9EEF5',
  },

  lastFeatureRow: {
    borderBottomWidth: 0,
  },

  featureIconCircle: {
    width: 31,
    height: 31,

    borderRadius: 16,

    backgroundColor: '#EAF4FF',

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 8,
  },

  featureIcon: {
    fontSize: 15,
  },

  featureContent: {
    flex: 1,
  },

  featureTitle: {
    fontSize: 12.6,

    fontWeight: '700',

    color: '#012353',

    lineHeight: 17,
  },

  orangeText: {
    color: '#F58220',
  },

  featureSub: {
    fontSize: 10.7,

    color: '#666',

    marginTop: 0,

    lineHeight: 14,
  },

  // =====================================================
  // LABEL
  // =====================================================

  label: {
    width: '100%',

    fontSize: 11.5,

    color: '#012353',

    fontWeight: '700',

    marginTop: 4,
    marginBottom: 4,
  },

  // =====================================================
  // INPUT
  // =====================================================

  inputContainer: {
    width: '100%',

    height: 43,

    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: '#FAFCFF',

    borderWidth: 1,

    borderColor: '#DCE5EF',

    borderRadius: 10,

    paddingHorizontal: 8,

    marginBottom: 7,
  },

  inputIconCircle: {
    width: 27,
    height: 27,

    borderRadius: 14,

    backgroundColor: '#EAF4FF',

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 7,
  },

  input: {
    flex: 1,

    height: 42,

    fontSize: 13.5,

    color: '#222',

    paddingVertical: 0,
  },

  // =====================================================
  // PASSWORD
  // =====================================================

  passwordContainer: {
    width: '100%',

    height: 43,

    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: '#FAFCFF',

    borderWidth: 1,

    borderColor: '#DCE5EF',

    borderRadius: 10,

    paddingHorizontal: 8,

    marginBottom: 10,
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

  // =====================================================
  // LOGIN BUTTON
  // =====================================================

  loginBtn: {
    marginTop: 11,

    width: '100%',

    height: 44,

    borderRadius: 10,

    backgroundColor: '#012353',

    justifyContent: 'center',
    alignItems: 'center',

    flexDirection: 'row',

    elevation: 4,

    shadowColor: '#012353',

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.18,

    shadowRadius: 4,
  },

  loginBtnDisabled: {
    opacity: 0.65,
  },

  loginText: {
    color: '#FFFFFF',

    fontSize: 15.5,

    fontWeight: 'bold',

    marginLeft: 7,
  },

  // =====================================================
  // REGISTER BUTTON
  // =====================================================

  registerBtn: {
    width: '100%',

    height: 43,

    borderRadius: 10,

    borderWidth: 1.5,

    borderColor: '#F58220',

    justifyContent: 'center',
    alignItems: 'center',

    flexDirection: 'row',

    marginTop: 7,

    backgroundColor: '#FFF',

    elevation: 1,
  },

  registerText: {
    color: '#F58220',

    fontWeight: 'bold',

    fontSize: 14.5,

    marginLeft: 6,
  },

  // =====================================================
  // BACK
  // =====================================================

  backBtn: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    marginTop: 10,
  },

  backText: {
    color: '#777',

    fontSize: 11.5,

    fontWeight: '600',

    marginLeft: 5,
  },

  // =====================================================
  // SECURITY
  // =====================================================

  secureRow: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    marginTop: 9,
  },

  secureText: {
    color: '#777',

    fontSize: 10.5,

    marginLeft: 5,
  },
});

export default LoginPopup;