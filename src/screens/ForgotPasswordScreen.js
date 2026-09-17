import React, {useEffect, useRef, useState} from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const {width} = Dimensions.get('window');

const FIXED_OTP = '123456';

const ForgotPasswordScreen = ({navigation}) => {
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [otpTimer, setOtpTimer] = useState(30);
  const [loading, setLoading] = useState(false);

  // =========================================================
  // POPUP ANIMATION
  // =========================================================

  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
        tension: 70,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacityAnim, scaleAnim]);

  // =========================================================
  // OTP TIMER
  // =========================================================

  useEffect(() => {
    let interval = null;

    if (step === 2 && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [step, otpTimer]);

  // =========================================================
  // SEND OTP
  // =========================================================

  const handleSendOTP = async () => {
  Keyboard.dismiss();

  const cleanMobile = mobile.replace(/\D/g, '');

  if (cleanMobile.length !== 10) {
    Alert.alert(
      'Invalid Mobile',
      'Please enter a valid 10 digit mobile number.',
    );
    return;
  }

  setLoading(true);

  try {
    console.log('CHECK MOBILE:', cleanMobile);

    const response = await fetch(
      'https://savariyaproperty.in/api/Login/CheckMobile',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile: cleanMobile,
        }),
      },
    );

    const result = await response.json();

    console.log(
      'CHECK MOBILE RESPONSE:',
      JSON.stringify(result, null, 2),
    );

    // =========================================
    // MOBILE NOT REGISTERED
    // =========================================
    if (
      result?.registered === false ||
      result?.statusCode === 0
    ) {
      setLoading(false);

     Alert.alert(
    'Mobile Not Registered',
    'This mobile number is not registered with Savariya Property.'
  );


      return;
    }

    // =========================================
    // MOBILE REGISTERED
    // =========================================
    if (
      result?.registered === true ||
      result?.success === true ||
      result?.statusCode === 1
    ) {
      console.log('MOBILE REGISTERED');

      console.log('TEMPORARY OTP:', FIXED_OTP);

      setLoading(false);
      setOtp('');
      setOtpTimer(30);
      setStep(2);

      Alert.alert(
        'OTP Sent',
        `Testing OTP: ${FIXED_OTP}`,
      );

      return;
    }

    // =========================================
    // UNKNOWN API RESPONSE
    // =========================================
    setLoading(false);

    Alert.alert(
      'Unable to Verify',
      result?.message ||
        result?.Message ||
        'Unable to verify mobile number. Please try again.',
    );
  } catch (error) {
    console.log(
      'CHECK MOBILE API ERROR:',
      error,
    );

    setLoading(false);

    Alert.alert(
      'Connection Error',
      'Unable to connect to server. Please try again.',
    );
  }
};


  // =========================================================
  // VERIFY OTP
  // =========================================================

  const handleVerifyOTP = () => {
    Keyboard.dismiss();

    if (otp.trim().length !== 6) {
      Alert.alert(
        'Invalid OTP',
        'Please enter 6 digit OTP.',
      );
      return;
    }

    if (otp.trim() !== FIXED_OTP) {
      Alert.alert(
        'Invalid OTP',
        'Please enter the correct OTP.',
      );
      return;
    }

    setStep(3);
  };

  // =========================================================
  // RESEND OTP
  // =========================================================

  const handleResendOTP = () => {
    if (otpTimer > 0) {
      return;
    }

    setOtp('');
    setOtpTimer(30);

    console.log('RESEND OTP TO:', mobile);
    console.log('TEMPORARY OTP:', FIXED_OTP);

    Alert.alert(
      'OTP Resent',
      `Testing OTP: ${FIXED_OTP}`,
    );
  };

  // =========================================================
  // CHANGE PASSWORD
  // =========================================================

    // =========================================================
  // CHANGE PASSWORD
  // =========================================================

  const handleChangePassword = async () => {
    Keyboard.dismiss();

    if (!newPassword.trim()) {
      Alert.alert(
        'Password Required',
        'Please enter new password.',
      );
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert(
        'Weak Password',
        'Password must be at least 6 characters.',
      );
      return;
    }

    if (!confirmPassword.trim()) {
      Alert.alert(
        'Confirm Password',
        'Please confirm your password.',
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(
        'Password Mismatch',
        'New password and confirm password must be same.',
      );
      return;
    }

    setLoading(true);

    try {
      console.log(
        'CHANGE PASSWORD MOBILE:',
        mobile,
      );

      console.log(
        'NEW PASSWORD:',
        newPassword,
      );

      // =====================================================
      // CHANGE PASSWORD API
      // =====================================================
      const response = await fetch(
        'https://savariyaproperty.in/api/login/ChangePassword',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mobile: mobile,
            newPassword: newPassword,
          }),
        },
      );

      const result = await response.json();

      console.log(
        'CHANGE PASSWORD API RESPONSE:',
        result,
      );

      // =====================================================
      // SUCCESS
      // =====================================================

      if (
        result?.success === true ||
        result?.statusCode === 1
      ) {
        setLoading(false);
        setStep(4);
        return;
      }

      // =====================================================
      // API ERROR
      // =====================================================

      setLoading(false);

      Alert.alert(
        'Change Password Failed',
        result?.message ||
          result?.Message ||
          'Unable to change password. Please try again.',
      );

    } catch (error) {
      console.log(
        'CHANGE PASSWORD API ERROR:',
        error,
      );

      setLoading(false);

      Alert.alert(
        'Error',
        'Unable to connect to server. Please try again.',
      );
    }
  };

  // =========================================================
  // BACK
  // =========================================================

  const handleBack = () => {
    Keyboard.dismiss();

    if (step === 2) {
      setStep(1);
      return;
    }

    if (step === 3) {
      setStep(2);
      return;
    }

    navigation.goBack();
  };

  // =========================================================
  // LOGIN
  // =========================================================

 const handleGoToLogin = () => {
  Keyboard.dismiss();

  navigation.reset({
    index: 0,
    routes: [{name: 'Home'}],
  });
};



  // =========================================================
  // RENDER
  // =========================================================

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <KeyboardAvoidingView
        style={styles.fullScreen}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : 'height'
        }
        keyboardVerticalOffset={
          Platform.OS === 'ios' ? 20 : 0
        }>

        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}>

          <View style={styles.fullScreen}>

            {/* =================================================
                NAVY TRANSPARENT OVERLAY
            ================================================= */}

            <View style={styles.overlay} />

            {/* =================================================
                POPUP
            ================================================= */}

            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>

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
                ]}>

                {/* =================================================
                    TOP ORANGE ACCENT
                ================================================= */}

                <View style={styles.topAccent} />

                {/* =================================================
                    BACK BUTTON
                ================================================= */}

                <TouchableOpacity
                  style={styles.backButton}
                  onPress={handleBack}
                  activeOpacity={0.7}>

                  <Icon
                    name="arrow-left"
                    size={17}
                    color="#012353"
                  />

                </TouchableOpacity>

                {/* =================================================
                    CLOSE BUTTON
                ================================================= */}

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => navigation.goBack()}
                  activeOpacity={0.7}>

                  <Text style={styles.closeText}>
                    ×
                  </Text>

                </TouchableOpacity>

                {/* =================================================
                    ICON
                ================================================= */}

                {step === 4 ? (
                  <View style={styles.successCircle}>
                    <Icon
                      name="check"
                      size={30}
                      color="#FFFFFF"
                    />
                  </View>
                ) : (
                  <View style={styles.iconCircle}>
                  <Icon
                    name={
                      step === 2
                        ? 'shield-check'
                        : step === 3
                        ? 'lock'
                        : 'lock-alert'
                    }
                    size={29}
                    color="#012353"
                  />
                  </View>
                )}

                {/* =================================================
                    STEP 1
                ================================================= */}

                {step === 1 && (
                  <>
                    <Text style={styles.title}>
                      Forgot Password?
                    </Text>

                    <Text style={styles.subtitle}>
                      Enter your registered mobile number
                      to reset your password.
                    </Text>

                    <Text style={styles.label}>
                      Mobile Number
                    </Text>

                    <View style={styles.inputContainer}>

                      <View style={styles.inputIconCircle}>
                        <Icon
                          name="phone-outline"
                          size={15}
                          color="#012353"
                        />
                      </View>

                      <TextInput
                        style={styles.input}
                        value={mobile}
                        onChangeText={text => {
                          const clean = text
                            .replace(/\D/g, '')
                            .slice(0, 10);

                          setMobile(clean);
                        }}
                        placeholder="Enter mobile number"
                        placeholderTextColor="#999"
                        keyboardType="phone-pad"
                        maxLength={10}
                        returnKeyType="done"
                        onSubmitEditing={handleSendOTP}
                      />

                    </View>

                    <TouchableOpacity
                      style={[
                        styles.primaryButton,
                        loading &&
                          styles.disabledButton,
                      ]}
                      onPress={handleSendOTP}
                      disabled={loading}
                      activeOpacity={0.8}>

                      <Text style={styles.buttonText}>
                        {loading
                          ? 'Please Wait...'
                          : 'Send OTP'}
                      </Text>

                      {!loading && (
                        <Icon
                          name="arrow-right"
                          size={17}
                          color="#FFFFFF"
                        />
                      )}

                    </TouchableOpacity>
                  </>
                )}

                {/* =================================================
                    STEP 2
                ================================================= */}

                {step === 2 && (
                  <>
                    <Text style={styles.title}>
                      Verify OTP
                    </Text>

                    <Text style={styles.subtitle}>
                      Enter the 6 digit OTP sent to
                    </Text>

                    <Text style={styles.mobileText}>
                      +91 {mobile}
                    </Text>

                    <Text style={styles.label}>
                      OTP
                    </Text>

                    <View style={styles.inputContainer}>

                      <View style={styles.inputIconCircle}>
                        <Icon
                          name="shield-key-outline"
                          size={15}
                          color="#012353"
                        />
                      </View>

                      <TextInput
                        style={[
                          styles.input,
                          styles.otpInput,
                        ]}
                        value={otp}
                        onChangeText={text => {
                          const clean = text
                            .replace(/\D/g, '')
                            .slice(0, 6);

                          setOtp(clean);
                        }}
                        placeholder="Enter OTP"
                        placeholderTextColor="#999"
                        keyboardType="number-pad"
                        maxLength={6}
                        returnKeyType="done"
                        onSubmitEditing={handleVerifyOTP}
                      />

                    </View>

                    {/* TESTING OTP */}

                    <View style={styles.testingOtpBox}>

                      <Icon
                        name="information-outline"
                        size={14}
                        color="#012353"
                      />

                      <Text style={styles.testingOtpText}>
                        Testing OTP: {FIXED_OTP}
                      </Text>

                    </View>

                    <TouchableOpacity
                      style={styles.primaryButton}
                      onPress={handleVerifyOTP}
                      activeOpacity={0.8}>

                      <Text style={styles.buttonText}>
                        Verify OTP
                      </Text>

                      <Icon
                        name="check"
                        size={17}
                        color="#FFFFFF"
                      />

                    </TouchableOpacity>

                    <View style={styles.resendContainer}>

                      <Text style={styles.resendText}>
                        Didn't receive OTP?
                      </Text>

                      <TouchableOpacity
                        onPress={handleResendOTP}
                        disabled={otpTimer > 0}>

                        <Text
                          style={[
                            styles.resendButton,
                            otpTimer > 0 &&
                              styles.resendDisabled,
                          ]}>

                          {otpTimer > 0
                            ? ` Resend in ${otpTimer}s`
                            : ' Resend OTP'}

                        </Text>

                      </TouchableOpacity>

                    </View>
                  </>
                )}

                {/* =================================================
                    STEP 3
                ================================================= */}

                {step === 3 && (
                  <>
                    <Text style={styles.title}>
                      Create New Password
                    </Text>

                    <Text style={styles.subtitle}>
                      Enter a new password for your account.
                    </Text>

                    <Text style={styles.label}>
                      New Password
                    </Text>

                    <View style={styles.inputContainer}>

                      <View style={styles.inputIconCircle}>
                        <Icon
                          name="lock-outline"
                          size={15}
                          color="#012353"
                        />
                      </View>

                      <TextInput
                        style={styles.input}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder="Enter new password"
                        placeholderTextColor="#999"
                        secureTextEntry={!showNewPassword}
                        returnKeyType="next"
                      />

                      <TouchableOpacity
                        style={styles.eyeButton}
                        onPress={() =>
                          setShowNewPassword(
                            !showNewPassword,
                          )
                        }>

                        <Icon
                          name={
                            showNewPassword
                              ? 'eye-off-outline'
                              : 'eye-outline'
                          }
                          size={17}
                          color="#777"
                        />

                      </TouchableOpacity>

                    </View>

                    <Text style={styles.passwordHint}>
                      Password must be at least 6 characters.
                    </Text>

                    <Text style={styles.label}>
                      Confirm Password
                    </Text>

                    <View style={styles.inputContainer}>

                      <View style={styles.inputIconCircle}>
                        <Icon
                          name="lock-check-outline"
                          size={15}
                          color="#012353"
                        />
                      </View>

                      <TextInput
                        style={styles.input}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Confirm new password"
                        placeholderTextColor="#999"
                        secureTextEntry={
                          !showConfirmPassword
                        }
                        returnKeyType="done"
                        onSubmitEditing={
                          handleChangePassword
                        }
                      />

                      <TouchableOpacity
                        style={styles.eyeButton}
                        onPress={() =>
                          setShowConfirmPassword(
                            !showConfirmPassword,
                          )
                        }>

                        <Icon
                          name={
                            showConfirmPassword
                              ? 'eye-off-outline'
                              : 'eye-outline'
                          }
                          size={17}
                          color="#777"
                        />

                      </TouchableOpacity>

                    </View>

                    <TouchableOpacity
                      style={[
                        styles.primaryButton,
                        loading &&
                          styles.disabledButton,
                      ]}
                      onPress={handleChangePassword}
                      disabled={loading}
                      activeOpacity={0.8}>

                      <Text style={styles.buttonText}>
                        {loading
                          ? 'Please Wait...'
                          : 'Change Password'}
                      </Text>

                      {!loading && (
                        <Icon
                          name="lock-reset"
                          size={17}
                          color="#FFFFFF"
                        />
                      )}

                    </TouchableOpacity>
                  </>
                )}

                {/* =================================================
                    STEP 4
                ================================================= */}

                {step === 4 && (
                  <>
                    <Text style={styles.title}>
                      Password Changed!
                    </Text>

                    <Text style={styles.subtitle}>
                      Your password has been changed
                      successfully.
                    </Text>

                    <Text style={styles.successMessage}>
                      You can now login using your new
                      password.
                    </Text>

               <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleGoToLogin}
                  activeOpacity={0.8}>
                  <Text style={styles.buttonText}>Go to Login</Text>
                  <Icon name="login" size={17} color="#FFFFFF" />
                </TouchableOpacity>


                  </>
                )}

                {/* =================================================
                    SECURITY
                ================================================= */}

                <View style={styles.secureRow}>

                  <Icon
                    name="shield-check-outline"
                    size={13}
                    color="#777"
                  />

                  <Text style={styles.secureText}>
                    Your information is secure
                  </Text>

                </View>

              </Animated.View>

            </ScrollView>

          </View>

        </TouchableWithoutFeedback>

      </KeyboardAvoidingView>
    </>
  );
};

// =========================================================
// STYLES
// =========================================================

const styles = StyleSheet.create({

  // =========================================================
  // FULL SCREEN
  // =========================================================

  fullScreen: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  // =========================================================
  // BACKGROUND OVERLAY
  // =========================================================

  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(1,35,83,0.58)',
    zIndex: 0,
  },

  // =========================================================
  // SCROLL
  // =========================================================

  scrollView: {
    flex: 1,
    zIndex: 1,
  },

  scrollContent: {
  flexGrow: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 12,
  paddingTop: 10,
  paddingBottom: 90,
},

  // =========================================================
  // CARD
  // =========================================================

  card: {
    width: width - 1,
    maxWidth: 450,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,

    paddingHorizontal: 18,
    paddingTop: 10,
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

  // =========================================================
  // ORANGE TOP LINE
  // =========================================================

  topAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,

    height: 4,

    backgroundColor: '#F58220',

    zIndex: 20,
  },

  // =========================================================
  // BACK BUTTON
  // =========================================================

  backButton: {
    position: 'absolute',

    left: 10,
    top: 10,

    width: 28,
    height: 28,

    borderRadius: 14,

    backgroundColor: '#F4F7FB',

    alignItems: 'center',
    justifyContent: 'center',

    zIndex: 10,
  },

  // =========================================================
  // CLOSE
  // =========================================================

  closeButton: {
    position: 'absolute',

    right: 10,
    top: 10,

    width: 28,
    height: 28,

    borderRadius: 14,

    backgroundColor: '#F4F7FB',

    alignItems: 'center',
    justifyContent: 'center',

    zIndex: 10,
  },

  closeText: {
    fontSize: 21,
    lineHeight: 22,
    color: '#012353',
    fontWeight: '500',
  },

  // =========================================================
  // ICON
  // =========================================================

  iconCircle: {
    width: 54,
    height: 54,

    borderRadius: 27,

    backgroundColor: '#EAF4FF',

    borderWidth: 1,
    borderColor: '#D7E8F8',

    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: 8,
  },

  // =========================================================
  // SUCCESS
  // =========================================================

  successCircle: {
    width: 58,
    height: 58,

    borderRadius: 29,

    backgroundColor: '#22A447',

    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: 9,
  },

  // =========================================================
  // TEXT
  // =========================================================

  title: {
    color: '#012353',
    fontSize: 19,
    fontWeight: '800',

    textAlign: 'center',

    marginBottom: 5,

    lineHeight: 24,
  },

  subtitle: {
    color: '#666',

    fontSize: 11.8,
    lineHeight: 17,

    textAlign: 'center',

    marginHorizontal: 8,
    marginBottom: 13,
  },

  mobileText: {
    color: '#012353',

    fontSize: 13,
    fontWeight: '700',

    textAlign: 'center',

    marginTop: -7,
    marginBottom: 13,
  },

  // =========================================================
  // LABEL
  // =========================================================

  label: {
    width: '100%',

    color: '#012353',

    fontSize: 11.2,
    fontWeight: '700',

    marginBottom: 4,
    marginTop: 2,
  },

  // =========================================================
  // INPUT
  // =========================================================

  inputContainer: {
    width: '100%',
    height: 41,

    borderWidth: 1,
    borderColor: '#DCE5EF',

    borderRadius: 9,

    backgroundColor: '#FAFCFF',

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 7,

    marginBottom: 8,
  },

  inputIconCircle: {
    width: 27,
    height: 27,

    borderRadius: 14,

    backgroundColor: '#EAF4FF',

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 7,
  },

  input: {
    flex: 1,

    color: '#222',

    fontSize: 12.8,

    paddingVertical: 0,

    height: 40,
  },

  otpInput: {
    letterSpacing: 4,
    fontWeight: '700',
  },

  eyeButton: {
    width: 30,
    height: 38,

    alignItems: 'center',
    justifyContent: 'center',
  },

  // =========================================================
  // PASSWORD HINT
  // =========================================================

  passwordHint: {
    width: '100%',

    color: '#888',

    fontSize: 9.8,

    marginTop: -5,
    marginBottom: 10,
  },

  // =========================================================
  // TESTING OTP
  // =========================================================

  testingOtpBox: {
    width: '100%',

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#F7FAFE',

    borderWidth: 1,
    borderColor: '#E3ECF5',

    borderRadius: 8,

    paddingHorizontal: 9,
    paddingVertical: 7,

    marginBottom: 10,
  },

  testingOtpText: {
    color: '#012353',

    fontSize: 10.5,
    fontWeight: '700',

    marginLeft: 6,
  },

  // =========================================================
  // PRIMARY BUTTON
  // =========================================================

  primaryButton: {
    width: '100%',
    height: 42,

    backgroundColor: '#012353',

    borderRadius: 9,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 15,

    marginTop: 3,

    elevation: 3,

    shadowColor: '#012353',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.18,
    shadowRadius: 4,
  },

  disabledButton: {
    opacity: 0.60,
  },

  buttonText: {
    color: '#FFFFFF',

    fontSize: 13.2,
    fontWeight: '700',

    marginRight: 7,
  },

  // =========================================================
  // RESEND
  // =========================================================

  resendContainer: {
    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',

    marginTop: 10,

    flexWrap: 'wrap',
  },

  resendText: {
    color: '#777',
    fontSize: 10.5,
  },

  resendButton: {
    color: '#012353',

    fontSize: 10.5,
    fontWeight: '800',
  },

  resendDisabled: {
    color: '#999',
  },

  // =========================================================
  // SUCCESS MESSAGE
  // =========================================================

  successMessage: {
    color: '#666',

    fontSize: 11.5,
    lineHeight: 17,

    textAlign: 'center',

    marginBottom: 12,
  },

  // =========================================================
  // SECURITY
  // =========================================================

  secureRow: {
    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',

    marginTop: 10,
  },

  secureText: {
    color: '#888',

    fontSize: 9.5,

    marginLeft: 4,
  },
});

export default ForgotPasswordScreen;