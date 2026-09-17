
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
  onForgotPassword,
}) => {
  // =====================================================
  // ANIMATION
  // =====================================================

  const scaleAnim = useRef(
    new Animated.Value(0.7),
  ).current;

  const opacityAnim = useRef(
    new Animated.Value(0),
  ).current;

  // =====================================================
  // LOGIN FORM
  // =====================================================

  const [showLoginForm, setShowLoginForm] =
    useState(false);

  const [mobile, setMobile] = useState('');

  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] =
    useState(false);

  // =====================================================
  // POPUP ANIMATION
  // =====================================================

  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0.7);
      opacityAnim.setValue(0);

      setShowLoginForm(false);

      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),

        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 7,
          tension: 70,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.7);
      opacityAnim.setValue(0);

      setShowLoginForm(false);
    }
  }, [visible, opacityAnim, scaleAnim]);

  // =====================================================
  // RESET POPUP
  // =====================================================

  const resetPopup = () => {
    setShowLoginForm(false);
    setMobile('');
    setPassword('');
    setShowPassword(false);
  };

  // =====================================================
  // CLOSE
  // =====================================================

  const handleClose = () => {
    resetPopup();

    if (onClose) {
      onClose();
    }
  };

  // =====================================================
  // OPEN LOGIN
  // =====================================================

  const handleOpenLogin = () => {
    setShowLoginForm(true);
  };

  // =====================================================
  // FORGOT PASSWORD
  // =====================================================

  const handleForgotPassword = () => {
    if (onForgotPassword) {
      onForgotPassword();
    }
  };

  // =====================================================
  // LOGIN API
  // =====================================================

  const handleLogin = async () => {
    const cleanMobile = mobile.replace(
      /[^0-9]/g,
      '',
    );

    // MOBILE VALIDATION
    if (cleanMobile === '') {
      Alert.alert(
        'Error',
        'Please enter mobile number',
      );
      return;
    }

    if (cleanMobile.length !== 10) {
      Alert.alert(
        'Error',
        'Please enter valid 10 digit mobile number',
      );
      return;
    }

    // PASSWORD VALIDATION
    if (password.trim() === '') {
      Alert.alert(
        'Error',
        'Please enter password',
      );
      return;
    }

    try {
      // =================================================
      // LOGIN API
      // =================================================

      const response = await fetch(
        'https://savariyaproperty.in/api/Login',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            mobile: cleanMobile,
            password: password,
          }),
        },
      );

      console.log(
        'LOGIN HTTP STATUS:',
        response.status,
      );

      // =================================================
      // RESPONSE
      // =================================================

      const result = await response.json();

      console.log(
        'LOGIN RESPONSE:',
        JSON.stringify(result, null, 2),
      );

      // =================================================
      // SUCCESS
      // =================================================

      if (
        response.ok &&
        result.success === true &&
        result.statusCode === 1 &&
        result.data
      ) {
        const user = result.data;

        console.log(
          'LOGIN USER:',
          JSON.stringify(user, null, 2),
        );

        // =================================================
        // SAVE LOGIN DATA
        // =================================================

        await AsyncStorage.setItem(
          'userLogin',
          'true',
        );

        // USER ID
        if (
          user.id !== undefined &&
          user.id !== null
        ) {
          await AsyncStorage.setItem(
            'userId',
            user.id.toString(),
          );
        }

        // NAME
        await AsyncStorage.setItem(
          'userName',
          user.name || '',
        );

        // MOBILE
        await AsyncStorage.setItem(
          'userMobile',
          user.mobile || cleanMobile,
        );

        // EMAIL
        await AsyncStorage.setItem(
          'userEmail',
          user.email || '',
        );

        // =================================================
        // ROLE
        // =================================================

        const actualRole =
          user.role ||
          user.roleType ||
          user.Role ||
          user.RoleType ||
          '';

        await AsyncStorage.setItem(
          'userRole',
          actualRole.toString(),
        );

        console.log(
          'LOGIN ROLE SAVED:',
          actualRole,
        );

        // =================================================
        // SUCCESS ALERT
        // =================================================

        Alert.alert(
          'Success',
          result.message ||
            'Login Successful',
          [
            {
              text: 'OK',

              onPress: () => {
                resetPopup();

                if (onLogin) {
                  onLogin(user);
                }
              },
            },
          ],
        );
      } else {
        // =================================================
        // LOGIN FAILED
        // =================================================

        Alert.alert(
          'Error',
          result.message ||
            'Invalid Mobile Number or Password',
        );
      }
    } catch (error) {
      // =================================================
      // API ERROR
      // =================================================

      console.log(
        'LOGIN ERROR:',
        error,
      );

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

        {/* =================================================
            TOP ACCENT
        ================================================= */}

        <View style={styles.topAccent} />

        {/* =================================================
            CLOSE
        ================================================= */}

        <TouchableOpacity
          style={styles.close}
          onPress={handleClose}
          activeOpacity={0.7}>

          <Text style={styles.closeText}>
            ×
          </Text>

        </TouchableOpacity>

        {/* =================================================
            LOGIN FORM
        ================================================= */}

        {showLoginForm ? (
          <>
            {/* USER ICON */}

            <View style={styles.logoCircle}>
              <Icon
                name="user"
                size={25}
                color="#012353"
              />
            </View>

            <Text style={styles.brand}>
              Savariya Property
            </Text>

            <Text style={styles.desc}>
              Login to continue to your account
            </Text>

            <View style={styles.smallDivider} />

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
                onChangeText={text =>
                  setMobile(
                    text.replace(
                      /[^0-9]/g,
                      '',
                    ),
                  )
                }
                keyboardType="numeric"
                maxLength={10}
                style={styles.input}
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
                  size={13}
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
              />

              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() =>
                  setShowPassword(
                    !showPassword,
                  )
                }
                activeOpacity={0.7}>

                <Icon
                  name={
                    showPassword
                      ? 'eye-slash'
                      : 'eye'
                  }
                  size={15}
                  color="#012353"
                />

              </TouchableOpacity>

            </View>

            {/* LOGIN */}

            <TouchableOpacity
              style={styles.loginBtn}
              onPress={handleLogin}
              activeOpacity={0.85}>

              <Icon
                name="sign-in-alt"
                size={15}
                color="#FFFFFF"
              />

              <Text style={styles.loginText}>
                Login
              </Text>

            </TouchableOpacity>

            {/* FORGOT PASSWORD */}

            <TouchableOpacity
              style={styles.forgotBtn}
              onPress={handleForgotPassword}
              activeOpacity={0.7}>

              <Text style={styles.forgotText}>
                Forgot Password?
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

            {/* BACK */}

            <TouchableOpacity
              style={styles.backBtn}
              onPress={() =>
                setShowLoginForm(false)
              }
              activeOpacity={0.7}>

              <Icon
                name="arrow-left"
                size={11}
                color="#777"
              />

              <Text style={styles.backText}>
                Back
              </Text>

            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* =================================================
                MAIN USP POPUP
            ================================================= */}

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
              India's growing property platform
              {'\n'}
              for Owners, Builders, Customers
              {' '}
              and Property Partners.
            </Text>

            <View style={styles.smallDivider} />

            {/* =================================================
                USP BOX
            ================================================= */}

            <View style={styles.featureBox}>

              {/* FIRST 100 */}

              <View style={styles.featureRow}>

                <View
                  style={
                    styles.featureIconCircle
                  }>
                  <Icon
                    name="home"
                    size={14}
                    color="#012353"
                  />
                </View>

                <View
                  style={styles.featureContent}>

                  <Text
                    style={
                      styles.featureTitle
                    }>
                    First 100 Property Listings
                    <Text
                      style={
                        styles.orangeText
                      }>
                      {' '}– FREE
                    </Text>
                  </Text>

                  <Text
                    style={
                      styles.featureSub
                    }>
                    List your property without any
                    listing charge.
                  </Text>

                </View>
              </View>

              {/* FREE POSTING */}

              <View style={styles.featureRow}>

                <View
                  style={
                    styles.featureIconCircle
                  }>
                  <Icon
                    name="bullhorn"
                    size={14}
                    color="#F58220"
                  />
                </View>

                <View
                  style={styles.featureContent}>

                  <Text
                    style={
                      styles.featureTitle
                    }>
                    Free Property Posting
                  </Text>

                  <Text
                    style={
                      styles.featureSub
                    }>
                    Owners & Builders can post
                    properties for FREE.
                  </Text>

                </View>
              </View>

              {/* FREE SEARCH */}

              <View style={styles.featureRow}>

                <View
                  style={
                    styles.featureIconCircle
                  }>
                  <Icon
                    name="search"
                    size={14}
                    color="#012353"
                  />
                </View>

                <View
                  style={styles.featureContent}>

                  <Text
                    style={
                      styles.featureTitle
                    }>
                    Free Property Search
                  </Text>

                  <Text
                    style={
                      styles.featureSub
                    }>
                    Customers / Seekers can search
                    properties FREE.
                  </Text>

                </View>
              </View>

              {/* PARTNER */}

              <View
                style={[
                  styles.featureRow,
                  styles.lastFeatureRow,
                ]}>

                <View
                  style={
                    styles.featureIconCircle
                  }>
                  <Icon
                    name="hand-holding-usd"
                    size={14}
                    color="#F58220"
                  />
                </View>

                <View
                  style={styles.featureContent}>

                  <Text
                    style={
                      styles.featureTitle
                    }>
                    Earn Money as Property Partner
                  </Text>

                  <Text
                    style={
                      styles.featureSub
                    }>
                    Connect property owners with
                    genuine customers and earn.
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
          </>
        )}
      </Animated.View>
    </Animated.View>
  );
};

export default LoginPopup;

// =====================================================
// STYLES
// =====================================================

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

    backgroundColor:
      'rgba(1,35,83,0.58)',

    justifyContent: 'center',
    alignItems: 'center',

    zIndex: 999,
  },

  // =====================================================
  // CARD
  // =====================================================

  card: {
    width: width - 32,

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

    maxHeight: '88%',

    overflow: 'hidden',
  },

  // =====================================================
  // TOP ACCENT
  // =====================================================

  topAccent: {
    position: 'absolute',

    top: 0,
    left: 0,
    right: 0,

    height: 4,

    backgroundColor: '#F58220',
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
    fontSize: 28,
  },

  // =====================================================
  // TITLE
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
  // DIVIDER
  // =====================================================

  smallDivider: {
    width: 42,

    height: 3,

    borderRadius: 2,

    backgroundColor: '#F58220',

    marginTop: 9,
    marginBottom: 5,
  },

  // =====================================================
  // USP BOX
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

  loginText: {
    color: '#FFFFFF',

    fontSize: 15.5,

    fontWeight: 'bold',

    marginLeft: 7,
  },

  // =====================================================
  // FORGOT PASSWORD
  // =====================================================

  forgotBtn: {
    width: '100%',

    alignItems: 'center',

    marginTop: 9,
  },

  forgotText: {
    color: '#012353',

    fontSize: 12.5,

    fontWeight: '600',
  },

  // =====================================================
  // REGISTER
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
});
