import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';

function OTPScreen({navigation, route}) {
  const {role, name, mobile, email} = route?.params || {};

  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);

  const otpInputRef = useRef(null);

  // Countdown
  useEffect(() => {
    if (timer === 0) {
      return;
    }

    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

const handleVerify = async () => {
  if (otp.length !== 6) {
    Alert.alert(
      'Invalid OTP',
      'Please enter the 6 digit OTP',
    );
    return;
  }

  try {
    const response = await axios.post(
      'https://savariyaproperty.in/api/auth/VerifyOTP',
      {
        mobile: mobile,
        otp: otp,
      },
    );

    console.log('Verify OTP response:', response.data);

    if (response.data.success) {
      Alert.alert(
        'Success',
        'OTP verified successfully',
        [
          {
            text: 'Continue',
            onPress: () => {
              navigation.navigate('Login');
            },
          },
        ],
      );
    } else {
      Alert.alert(
        'Invalid OTP',
        response.data.message || 'Invalid OTP',
      );
    }
  } catch (error) {
    console.log(
      'Verify OTP error:',
      error.response?.data || error.message,
    );

    Alert.alert(
      'Error',
      error.response?.data?.message ||
        'Unable to verify OTP',
    );
  }
};


const handleResend = async () => {
  if (timer > 0) return;
  
  alert(mobile);

  try {
    const response = await axios.post(
      'https://savariyaproperty.in/api/auth/SendOTP',
      {
        mobile: mobile,
      },
    );

    console.log('Resend OTP response:', response.data);

    if (response.data.success) {
      setOtp('');
      setTimer(30);

      Alert.alert(
        'OTP Sent',
        __DEV__
          ? `Testing OTP: ${response.data.debugOtp}`
          : `A new OTP has been sent to +91 ${mobile}`,
      );
    } else {
      Alert.alert(
        'Error',
        response.data.message || 'Failed to send OTP',
      );
    }
  } catch (error) {
    console.log(
      'Resend OTP error:',
      error.response?.data || error.message,
    );

    Alert.alert(
      'Error',
      error.response?.data?.message ||
        'Unable to connect to server',
    );
  }
};


  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F5F7FA"
      />

      <Header />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>

          {/* Header */}
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Icon
                name="shield-key-outline"
                size={42}
                color="#FFFFFF"
              />
            </View>
          </View>

          <Text style={styles.title}>
            Verify Your Mobile
          </Text>

          <Text style={styles.subtitle}>
            We have sent a 6 digit verification code to
          </Text>

          <Text style={styles.mobileText}>
            +91 {mobile || 'XXXXXXXXXX'}
          </Text>

          {/* OTP Card */}
          <View style={styles.card}>

            <Text style={styles.cardTitle}>
              Enter OTP
            </Text>

            <Text style={styles.cardSubtitle}>
              Please enter the OTP received on your mobile number.
            </Text>

            {/* OTP Input */}
            <TextInput
              ref={otpInputRef}
              style={styles.otpInput}
              value={otp}
              onChangeText={text =>
                setOtp(text.replace(/[^0-9]/g, ''))
              }
              keyboardType="number-pad"
              maxLength={6}
              placeholder="------"
              placeholderTextColor="#CBD5E1"
              textAlign="center"
              autoFocus
            />

            {/* Verify Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.verifyButton}
              onPress={handleVerify}>

              <Text style={styles.verifyText}>
                Verify OTP
              </Text>

              <Icon
                name="arrow-right"
                size={22}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            {/* Resend */}
            <View style={styles.resendContainer}>
              <Text style={styles.resendLabel}>
                Didn't receive the OTP?
              </Text>

              {timer > 0 ? (
                <Text style={styles.timerText}>
                  Resend in {timer}s
                </Text>
              ) : (
                <TouchableOpacity onPress={handleResend}>
                  <Text style={styles.resendLink}>
                    Resend OTP
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Change Number */}
            <TouchableOpacity
              style={styles.changeNumberButton}
              onPress={() => navigation.goBack()}>

              <Icon
                name="arrow-left"
                size={18}
                color="#1F6FEB"
              />

              <Text style={styles.changeNumberText}>
                Change Mobile Number
              </Text>
            </TouchableOpacity>
          </View>

          {/* Security */}
          <View style={styles.securityBox}>
            <Icon
              name="shield-check-outline"
              size={20}
              color="#1F6FEB"
            />

            <Text style={styles.securityText}>
              Your verification is secure with ClickAangan.
            </Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },

  keyboardView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 35,
  },

  iconContainer: {
    alignItems: 'center',
    marginBottom: 18,
  },

  iconCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#1F6FEB',
    alignItems: 'center',
    justifyContent: 'center',

    elevation: 5,

    shadowColor: '#1F6FEB',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },

  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },

  subtitle: {
    textAlign: 'center',
    fontSize: 13.5,
    color: '#6B7280',
    marginTop: 8,
  },

  mobileText: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
    color: '#1F6FEB',
    marginTop: 5,
    marginBottom: 22,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,

    elevation: 4,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },

  cardTitle: {
    textAlign: 'center',
    fontSize: 19,
    fontWeight: '800',
    color: '#111827',
  },

  cardSubtitle: {
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 19,
    color: '#6B7280',
    marginTop: 6,
    marginBottom: 22,
  },

  otpInput: {
    height: 60,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 13,
    backgroundColor: '#F8FAFC',

    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 12,
    color: '#111827',

    marginBottom: 18,
  },

  verifyButton: {
    height: 54,
    borderRadius: 13,
    backgroundColor: '#1F6FEB',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    elevation: 4,

    shadowColor: '#1F6FEB',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.22,
    shadowRadius: 7,
  },

  verifyText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },

  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  resendLabel: {
    fontSize: 13,
    color: '#6B7280',
  },

  timerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9CA3AF',
    marginLeft: 5,
  },

  resendLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F6FEB',
    marginLeft: 5,
  },

  changeNumberButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },

  changeNumberText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F6FEB',
    marginLeft: 6,
  },

  securityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 10,
  },

  securityText: {
    flex: 1,
    fontSize: 11.5,
    color: '#6B7280',
    marginLeft: 7,
    lineHeight: 17,
  },
});

export default OTPScreen;
