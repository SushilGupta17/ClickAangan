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
}) => {
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
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),

        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();

      // Every time popup opens,
      // show main USP screen first
      setShowLoginForm(false);
    }
  }, [visible, opacityAnim, scaleAnim]);

  // =====================================================
  // RESET
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
  // OPEN LOGIN FORM
  // =====================================================

  const handleOpenLogin = () => {
    setShowLoginForm(true);
  };

  // =====================================================
  // LOGIN API
  // =====================================================

  const handleLogin = async () => {
    if (mobile === '') {
      Alert.alert(
        'Error',
        'Please enter mobile number',
      );
      return;
    }

    if (mobile.length !== 10) {
      Alert.alert(
        'Error',
        'Please enter valid mobile number',
      );
      return;
    }

    if (password === '') {
      Alert.alert(
        'Error',
        'Please enter password',
      );
      return;
    }

    try {
      const response = await fetch(
        'https://savariyaproperty.in/api/Login',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            mobile,
            password,
          }),
        },
      );

      const result = await response.json();

      console.log(
        'LOGIN RESPONSE:',
        result,
      );

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

        await AsyncStorage.setItem(
          'userId',
          user.id.toString(),
        );

        await AsyncStorage.setItem(
          'userName',
          user.name || '',
        );

        await AsyncStorage.setItem(
          'userMobile',
          user.mobile || '',
        );

        await AsyncStorage.setItem(
          'userEmail',
          user.email || '',
        );

        await AsyncStorage.setItem(
          'userRole',
          'Builder',
        );

        Alert.alert(
          'Success',
          result.message ||
            'Login Successful',
          [
            {
              text: 'OK',
              onPress: () => {
                resetPopup();

                /*
                 * IMPORTANT:
                 * Parent ka onLogin callback call hoga.
                 *
                 * Agar parent me:
                 * onLogin={() => navigation.replace('Home')}
                 * hai to Home open ho jayega.
                 */
                if (onLogin) {
                  onLogin();
                }
              },
            },
          ],
        );
      } else {
        Alert.alert(
          'Error',
          result.message ||
            'Invalid Mobile Number or Password',
        );
      }
    } catch (error) {
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

        {/* ================================================= */}
        {/* CLOSE BUTTON */}
        {/* ================================================= */}

        <TouchableOpacity
          style={styles.close}
          onPress={handleClose}
          activeOpacity={0.7}>

          <Text style={styles.closeText}>
            ✕
          </Text>

        </TouchableOpacity>

        {/* ================================================= */}
        {/* LOGIN FORM */}
        {/* ================================================= */}

        {showLoginForm ? (
          <>

            {/* USER ICON */}

            <View style={styles.logoCircle}>
              <Icon
                name="user"
                size={26}
                color="#012353"
              />
            </View>

            <Text style={styles.title}>
              Welcome Back
            </Text>

            <Text style={styles.brand}>
              Savariya Property
            </Text>

            <Text style={styles.desc}>
              Login to continue to your account
            </Text>

            {/* MOBILE */}

            <Text style={styles.label}>
              Mobile Number
            </Text>

            <View
              style={styles.inputContainer}>

              <Icon
                name="mobile-alt"
                size={16}
                color="#012353"
                style={styles.inputIcon}
              />

              <TextInput
                placeholder="Enter mobile number"
                placeholderTextColor="#999"
                value={mobile}
                onChangeText={setMobile}
                keyboardType="numeric"
                maxLength={10}
                style={styles.input}
              />

            </View>

            {/* PASSWORD */}

            <Text style={styles.label}>
              Password
            </Text>

            <View
              style={styles.passwordContainer}>

              <Icon
                name="lock"
                size={15}
                color="#012353"
                style={styles.inputIcon}
              />

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
                }>

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

            {/* LOGIN */}

            <TouchableOpacity
              style={styles.loginBtn}
              onPress={handleLogin}
              activeOpacity={0.8}>

              <Icon
                name="sign-in-alt"
                size={15}
                color="#fff"
              />

              <Text
                style={styles.loginText}>
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

              <Text
                style={styles.registerText}>
                Create Account
              </Text>

            </TouchableOpacity>

            {/* BACK */}

            <TouchableOpacity
              style={styles.backBtn}
              onPress={() =>
                setShowLoginForm(false)
              }>

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

          /* ================================================= */
          /* MAIN USP POPUP */
          /* ================================================= */

          <>

            {/* LOGO */}

            <View style={styles.logoCircle}>
              <Text style={styles.logo}>
                🏠
              </Text>
            </View>

            {/* TITLE */}

            <Text style={styles.title}>
              Welcome to
            </Text>

            <Text style={styles.brand}>
              Savariya Property
            </Text>

            <Text style={styles.desc}>
              India's growing property platform
              for Owners, Builders, Customers
              and Property Executives.
            </Text>

            {/* USP BOX */}

            <View
              style={styles.featureBox}>

              <View
                style={styles.featureRow}>

                <Text
                  style={styles.featureIcon}>
                  🏠
                </Text>

                <View
                  style={styles.featureContent}>

                  <Text
                    style={styles.featureTitle}>
                    First 100 Property Listings –
                    FREE
                  </Text>

                  <Text
                    style={styles.featureSub}>
                    List your property without any
                    listing charge.
                  </Text>

                </View>
              </View>

              <View
                style={styles.featureRow}>

                <Text
                  style={styles.featureIcon}>
                  📢
                </Text>

                <View
                  style={styles.featureContent}>

                  <Text
                    style={styles.featureTitle}>
                    Free Property Posting
                  </Text>

                  <Text
                    style={styles.featureSub}>
                    Owners & Builders can post
                    properties for FREE.
                  </Text>

                </View>
              </View>

              <View
                style={styles.featureRow}>

                <Text
                  style={styles.featureIcon}>
                  🔍
                </Text>

                <View
                  style={styles.featureContent}>

                  <Text
                    style={styles.featureTitle}>
                    Free Property Search
                  </Text>

                  <Text
                    style={styles.featureSub}>
                    Customers / Seekers can search
                    properties FREE.
                  </Text>

                </View>
              </View>

              <View
                style={styles.featureRow}>

                <Text
                  style={styles.featureIcon}>
                  💰
                </Text>

                <View
                  style={styles.featureContent}>

                  <Text
                    style={styles.featureTitle}>
                    Earn Money as Property
                    Executive
                  </Text>

                  <Text
                    style={styles.featureSub}>
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

              <Text
                style={styles.loginText}>
                Login
              </Text>

            </TouchableOpacity>

            {/* REGISTER */}

            <TouchableOpacity
              style={styles.registerBtn}
              onPress={handleRegister}
              activeOpacity={0.8}>

              <Text
                style={styles.registerText}>
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
      'rgba(0,0,0,0.60)',

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
    paddingTop: 14,
    paddingBottom: 14,

    alignItems: 'center',

    elevation: 10,

    maxHeight: '86%',
  },

  // =====================================================
  // CLOSE
  // =====================================================

  close: {
    position: 'absolute',

    right: 10,
    top: 8,

    width: 32,
    height: 32,

    justifyContent: 'center',
    alignItems: 'center',

    zIndex: 10,
  },

  closeText: {
    fontSize: 20,

    color: '#777',

    fontWeight: '600',
  },

  // =====================================================
  // LOGO
  // =====================================================

  logoCircle: {
    width: 58,
    height: 58,

    borderRadius: 29,

    backgroundColor: '#EAF4FF',

    justifyContent: 'center',
    alignItems: 'center',

    marginBottom: 7,
  },

  logo: {
    fontSize: 29,
  },

  // =====================================================
  // TITLE
  // =====================================================

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
    marginTop: 6,

    marginHorizontal: 5,

    textAlign: 'center',

    color: '#666',

    lineHeight: 17,

    fontSize: 12.5,
  },

  // =====================================================
  // USP BOX
  // =====================================================

  featureBox: {
    marginTop: 11,

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

  // =====================================================
  // LABEL
  // =====================================================

  label: {
    width: '100%',

    fontSize: 11.5,

    color: '#012353',

    fontWeight: '700',

    marginTop: 3,

    marginBottom: 4,
  },

  // =====================================================
  // INPUT
  // =====================================================

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

  // =====================================================
  // PASSWORD
  // =====================================================

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
    marginTop: 12,

    width: '100%',

    height: 43,

    borderRadius: 10,

    backgroundColor: '#012353',

    justifyContent: 'center',
    alignItems: 'center',

    flexDirection: 'row',

    elevation: 3,
  },

  loginText: {
    color: '#FFFFFF',

    fontSize: 16,

    fontWeight: 'bold',

    marginLeft: 6,
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

    backgroundColor: '#FFFFFF',
  },

  registerText: {
    color: '#F58220',

    fontWeight: 'bold',

    fontSize: 15,

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
