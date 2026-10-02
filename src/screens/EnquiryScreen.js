import React, {useEffect, useRef, useState} from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAppAlert} from '../utils/AppAlert';

const {width, height} = Dimensions.get('window');

const EnquiryScreen = ({navigation, route}) => {
  // =========================================================
  // ALERT
  // =========================================================

  const {
    success: showSuccess,
    error: showError,
    warning: showWarning,
  } = useAppAlert();

  // =========================================================
  // PROPERTY DATA
  // =========================================================

  const property =
    route?.params?.property ||
    route?.params?.item ||
    {};

  const propertyId =
    route?.params?.propertyId ||
    property?.propertyId ||
    property?.id ||
    property?.Id ||
    '';

  // =========================================================
  // ANIMATION
  // =========================================================

  const scaleAnim = useRef(
    new Animated.Value(0.92),
  ).current;

  const opacityAnim = useRef(
    new Animated.Value(0),
  ).current;

  // =========================================================
  // FORM STATE
  // =========================================================

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // =========================================================
  // LOAD USER + OPEN ANIMATION
  // =========================================================

  useEffect(() => {
    loadUser();

    scaleAnim.setValue(0.92);
    opacityAnim.setValue(0);

    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),

      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 55,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // =========================================================
  // LOAD LOGGED-IN USER
  // =========================================================

  const loadUser = async () => {
    try {
      const userName =
        await AsyncStorage.getItem('userName');

      const userMobile =
        await AsyncStorage.getItem('userMobile');

      const userEmail =
        await AsyncStorage.getItem('userEmail');

      if (userName) {
        setName(userName);
      }

      if (userMobile) {
        setMobile(userMobile);
      }

      if (userEmail) {
        setEmail(userEmail);
      }
    } catch (storageError) {
      console.log(
        'ENQUIRY USER LOAD ERROR:',
        storageError,
      );
    }
  };

  // =========================================================
  // CLOSE
  // =========================================================

  const handleClose = () => {
    navigation.goBack();
  };

  // =========================================================
  // VALIDATION
  // =========================================================

  const validateForm = () => {
    const cleanName = name.trim();
    const cleanMobile = mobile.trim();
    const cleanEmail = email.trim();
    const cleanMessage = message.trim();

    if (!cleanName) {
      showError(
        'Required',
        'Please enter your name.',
      );
      return false;
    }

    if (!cleanMobile) {
      showError(
        'Required',
        'Please enter your mobile number.',
      );
      return false;
    }

    if (cleanMobile.length !== 10) {
      showError(
        'Invalid Mobile',
        'Please enter a valid 10 digit mobile number.',
      );
      return false;
    }

    if (cleanEmail) {
      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(cleanEmail)) {
        showError(
          'Invalid Email',
          'Please enter a valid email address.',
        );
        return false;
      }
    }

    if (!cleanMessage) {
      showError(
        'Required',
        'Please enter your enquiry.',
      );
      return false;
    }

    return true;
  };

  // =========================================================
  // SUBMIT ENQUIRY
  // =========================================================

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    if (!propertyId) {
      showError(
        'Property Error',
        'Property information is missing. Please open the enquiry from a property.',
      );
      return;
    }

    try {
      setIsLoading(true);

      const payload = {
        propertyId: Number(propertyId),
        name: name.trim(),
        mobile: mobile.trim(),
        email: email.trim(),
        message: message.trim(),
      };

      console.log(
        '====================================',
      );
      console.log(
        'ENQUIRY API REQUEST',
      );
      console.log(
        '====================================',
      );

      console.log(
        'ENQUIRY PAYLOAD:',
        payload,
      );

      // =====================================================
      // API CALL
      // =====================================================

      const response = await fetch(
        'https://clickaangan.in/api/Enquiry',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },

          body: JSON.stringify(payload),
        },
      );

      const responseText =
        await response.text();

      console.log(
        'ENQUIRY API STATUS:',
        response.status,
      );

      console.log(
        'ENQUIRY API RESPONSE:',
        responseText,
      );

      // =====================================================
      // PARSE RESPONSE
      // =====================================================

      let result = {};

      try {
        result = responseText
          ? JSON.parse(responseText)
          : {};
      } catch (jsonError) {
        console.log(
          'ENQUIRY JSON PARSE ERROR:',
          jsonError,
        );
      }

      // =====================================================
      // HTTP ERROR
      // =====================================================

      if (!response.ok) {
        throw new Error(
          result?.message ||
            result?.Message ||
            result?.resultMessage ||
            result?.ResultMessage ||
            result?.RESULTMSG ||
            `Server error: ${response.status}`,
        );
      }

      // =====================================================
      // SUCCESS CHECK
      // =====================================================

      const apiSuccess =
        result?.success === true ||
        result?.Success === true ||
        result?.isSuccess === true ||
        result?.IsSuccess === true ||
        result?.resultCode === 1 ||
        result?.ResultCode === 1 ||
        result?.RESULTCODE === 1 ||
        result?.code === 1 ||
        result?.Code === 1;

      // =====================================================
      // SUCCESS
      // =====================================================

      if (
        apiSuccess ||
        response.status === 200 ||
        response.status === 201
      ) {
        showSuccess(
          'Enquiry Submitted',
          'Thank you for your enquiry. Our team will contact you shortly.',
          [
            {
              text: 'OK',
              onPress: () =>
                navigation.goBack(),
            },
          ],
          {
            cancelable: false,
          },
        );

        return;
      }

      // =====================================================
      // API RESPONSE WITHOUT SUCCESS FLAG
      // =====================================================

      showError(
        'Enquiry',
        result?.message ||
          result?.Message ||
          result?.resultMessage ||
          result?.ResultMessage ||
          'Your enquiry could not be submitted. Please try again.',
      );
    } catch (submitError) {
      console.log(
        'ENQUIRY SUBMIT ERROR:',
        submitError,
      );

      showError(
        'Error',
        submitError?.message ||
          'Unable to submit enquiry. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // UI
  // =========================================================

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
            : 'position'
        }
        keyboardVerticalOffset={
          Platform.OS === 'ios'
            ? 0
            : 5
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

          {/* FORM SCROLL */}

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={
              styles.scrollContent
            }
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode={
              Platform.OS === 'ios'
                ? 'interactive'
                : 'on-drag'
            }
            nestedScrollEnabled={true}>

            {/* CLOSE */}

            <TouchableOpacity
              style={styles.close}
              onPress={handleClose}
              activeOpacity={0.7}>

              <Text style={styles.closeText}>
                ×
              </Text>

            </TouchableOpacity>

            {/* HEADER ICON */}

            <View style={styles.logoCircle}>
              <Icon
                name="comment-dots"
                size={27}
                color="#012353"
              />
            </View>

            <Text style={styles.title}>
              Property Enquiry
            </Text>

            <Text style={styles.brand}>
              Send Your Enquiry
            </Text>

            <Text style={styles.desc}>
              Interested in this property? Fill
              in your details and our property
              team will contact you shortly.
            </Text>

            {/* PROPERTY INFO */}

            {(property?.title ||
              property?.propertyTitle ||
              property?.name) && (

              <View style={styles.propertyBox}>

                <View
                  style={
                    styles.propertyIconCircle
                  }>

                  <Icon
                    name="home"
                    size={14}
                    color="#012353"
                  />

                </View>

                <View
                  style={
                    styles.propertyContent
                  }>

                  <Text
                    style={
                      styles.propertyLabel
                    }>

                    PROPERTY

                  </Text>

                  <Text
                    style={
                      styles.propertyTitle
                    }
                    numberOfLines={2}>

                    {property?.title ||
                      property?.propertyTitle ||
                      property?.name}

                  </Text>

                </View>

              </View>
            )}

            {/* NAME */}

            <Text style={styles.label}>
              Your Name
            </Text>

            <View style={styles.inputContainer}>

              <View
                style={
                  styles.inputIconCircle
                }>

                <Icon
                  name="user"
                  size={13}
                  color="#012353"
                />

              </View>

              <TextInput
                placeholder="Enter your name"
                placeholderTextColor="#999"
                value={name}
                onChangeText={setName}
                style={styles.input}
                autoCapitalize="words"
                returnKeyType="next"
              />

            </View>

            {/* MOBILE */}

            <Text style={styles.label}>
              Mobile Number
            </Text>

            <View style={styles.inputContainer}>

              <View
                style={
                  styles.inputIconCircle
                }>

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
                    text.replace(
                      /[^0-9]/g,
                      '',
                    ),
                  );
                }}
                keyboardType="numeric"
                maxLength={10}
                style={styles.input}
                returnKeyType="next"
              />

            </View>

            {/* EMAIL */}

            <Text style={styles.label}>
              Email Address

              <Text style={styles.optional}>
                {' '}
                (Optional)
              </Text>
            </Text>

            <View style={styles.inputContainer}>

              <View
                style={
                  styles.inputIconCircle
                }>

                <Icon
                  name="envelope"
                  size={13}
                  color="#012353"
                />

              </View>

              <TextInput
                placeholder="Enter email address"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />

            </View>

            {/* MESSAGE */}

            <Text style={styles.label}>
              Your Enquiry
            </Text>

            <View
              style={[
                styles.inputContainer,
                styles.messageContainer,
              ]}>

              <View
                style={[
                  styles.inputIconCircle,
                  styles.messageIconCircle,
                ]}>

                <Icon
                  name="comment-alt"
                  size={13}
                  color="#012353"
                />

              </View>

              <TextInput
                placeholder="I am interested in this property..."
                placeholderTextColor="#999"
                value={message}
                onChangeText={setMessage}
                style={[
                  styles.input,
                  styles.messageInput,
                ]}
                multiline
                textAlignVertical="top"
                maxLength={500}
              />

            </View>

            {/* CHARACTER COUNT */}

            <Text style={styles.characterCount}>
              {message.length}/500
            </Text>

            {/* SUBMIT */}

            <TouchableOpacity
              style={[
                styles.submitBtn,
                isLoading &&
                  styles.submitBtnDisabled,
              ]}
              onPress={handleSubmit}
              activeOpacity={0.8}
              disabled={isLoading}>

              {isLoading ? (
                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />
              ) : (
                <Icon
                  name="paper-plane"
                  size={14}
                  color="#FFFFFF"
                />
              )}

              <Text style={styles.submitText}>
                {isLoading
                  ? 'Submitting...'
                  : 'Send Enquiry'}
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
                Your information is secure and
                confidential
              </Text>

            </View>

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

  // =======================================================
  // OVERLAY
  // =======================================================

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

    zIndex: 9999,
    elevation: 9999,
  },

  // =======================================================
  // KEYBOARD CONTAINER
  // =======================================================

  keyboardContainer: {
    width: '100%',
    height: '100%',

    alignItems: 'center',

    // IMPORTANT:
    // Keyboard आने पर card को resize नहीं
    // बल्कि ऊपर move किया जाएगा.
    justifyContent: 'center',
  },

  // =======================================================
  // CARD
  // =======================================================

  card: {
    width: width - 32,

    // Keyboard के समय card को छोटा होने से रोकने के लिए
    height: Math.min(height * 0.90, 650),

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

  // =======================================================
  // TOP ORANGE ACCENT
  // =======================================================

  topAccent: {
    position: 'absolute',

    top: 0,
    left: 0,
    right: 0,

    height: 4,

    backgroundColor: '#F58220',
  },

  // =======================================================
  // SCROLL VIEW
  // =======================================================

  scrollView: {
    width: '100%',
    flex: 1,
  },

  scrollContent: {
    alignItems: 'center',

    paddingBottom: 20,
    paddingTop: 2,
  },

  // =======================================================
  // CLOSE BUTTON
  // =======================================================

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
    elevation: 3,
  },

  closeText: {
    fontSize: 22,
    lineHeight: 23,

    color: '#012353',

    fontWeight: '500',

    includeFontPadding: false,
  },

  // =======================================================
  // LOGO
  // =======================================================

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

  // =======================================================
  // HEADER
  // =======================================================

  title: {
    fontSize: 15,

    color: '#666',

    fontWeight: '500',

    lineHeight: 18,

    textAlign: 'center',
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

  // =======================================================
  // PROPERTY BOX
  // =======================================================

  propertyBox: {
    marginTop: 10,

    width: '100%',

    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: '#F7FAFE',

    borderRadius: 12,

    borderWidth: 1,

    borderColor: '#E5EDF6',

    paddingHorizontal: 9,

    paddingVertical: 8,
  },

  propertyIconCircle: {
    width: 32,
    height: 32,

    borderRadius: 16,

    backgroundColor: '#EAF4FF',

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 8,
  },

  propertyContent: {
    flex: 1,
    minWidth: 0,
  },

  propertyLabel: {
    fontSize: 9.5,

    color: '#777',

    fontWeight: '700',

    marginBottom: 1,
  },

  propertyTitle: {
    fontSize: 12.5,

    color: '#012353',

    fontWeight: '700',

    lineHeight: 17,
  },

  // =======================================================
  // LABEL
  // =======================================================

  label: {
    width: '100%',

    fontSize: 11.5,

    color: '#012353',

    fontWeight: '700',

    marginTop: 8,
    marginBottom: 4,
  },

  optional: {
    color: '#888',
    fontWeight: '500',
  },

  // =======================================================
  // INPUT CONTAINER
  // =======================================================

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

    marginBottom: 2,
  },

  // =======================================================
  // INPUT ICON
  // =======================================================

  inputIconCircle: {
    width: 27,
    height: 27,

    borderRadius: 14,

    backgroundColor: '#EAF4FF',

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 7,

    flexShrink: 0,
  },

  // =======================================================
  // TEXT INPUT
  // =======================================================

  input: {
    flex: 1,

    height: 42,

    fontSize: 13.5,

    color: '#222',

    paddingVertical: 0,
    paddingHorizontal: 0,

    includeFontPadding: false,
  },

  // =======================================================
  // MESSAGE
  // =======================================================

  messageContainer: {
    height: 85,

    alignItems: 'flex-start',

    paddingTop: 8,
    paddingBottom: 5,
  },

  messageIconCircle: {
    marginTop: 1,
  },

  messageInput: {
    height: 70,

    paddingTop: 3,
    paddingBottom: 3,

    lineHeight: 19,

    textAlignVertical: 'top',

    includeFontPadding: false,
  },

  // =======================================================
  // CHARACTER COUNT
  // =======================================================

  characterCount: {
    width: '100%',

    textAlign: 'right',

    color: '#999',

    fontSize: 9.5,

    marginTop: 2,
    marginBottom: 0,
  },

  // =======================================================
  // SUBMIT BUTTON
  // =======================================================

  submitBtn: {
    marginTop: 9,

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

  submitBtnDisabled: {
    opacity: 0.65,
  },

  submitText: {
    color: '#FFFFFF',

    fontSize: 15.5,

    fontWeight: 'bold',

    marginLeft: 7,
  },

  // =======================================================
  // SECURITY
  // =======================================================

  secureRow: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    marginTop: 9,

    paddingHorizontal: 5,
  },

  secureText: {
    color: '#777',

    fontSize: 10.5,

    marginLeft: 5,

    textAlign: 'center',
  },
});

export default EnquiryScreen;
