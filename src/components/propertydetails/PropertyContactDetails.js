import React, {useEffect, useState} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  TextInput,
  Keyboard,
  ActivityIndicator,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {sendOTP, verifyOTP} from '../services/OTPService';

import {useAppAlert} from '../../utils/AppAlert';

// =========================================================
// PROPERTY CONTACT DETAILS
// =========================================================

const PropertyContactDetails = ({property}) => {
  const {success, error, warning} = useAppAlert();

  // =======================================================
  // STATES
  // =======================================================

  const [expanded, setExpanded] = useState(false);

  const [otpVisible, setOtpVisible] = useState(false);

  const [otp, setOtp] = useState('');

  const [otpTimer, setOtpTimer] = useState(300);

  const [sendingOtp, setSendingOtp] = useState(false);

  const [verifyingOtp, setVerifyingOtp] = useState(false);

  // IMPORTANT:
  // OTP will be sent to logged-in user's mobile number.
  // Property mobile is ONLY for contact display/call/WhatsApp.
  const [apiMobile, setApiMobile] = useState('');

  // =======================================================
  // PROPERTY / PROJECT / RENT UNIQUE KEY
  // =======================================================

  const getVerificationKey = () => {
    const uniqueId =
      property?.propertyId ??
      property?.PropertyId ??
      property?.projectId ??
      property?.ProjectId ??
      property?.rentalId ??
      property?.RentalId ??
      property?.id ??
      property?.Id;

    const type =
      property?.propertyType ??
      property?.PropertyType ??
      property?.listingType ??
      property?.ListingType ??
      property?.purpose ??
      property?.Purpose ??
      'property';

    if (
      uniqueId === undefined ||
      uniqueId === null ||
      String(uniqueId).trim() === ''
    ) {
      return null;
    }

    return `contactVerified_${String(type).trim()}_${String(
      uniqueId,
    ).trim()}`;
  };



  // =======================================================
  // LOAD LOGIN / HEADER MOBILE
  // =======================================================

  useEffect(() => {
    const loadLoginMobile = async () => {
      try {
        const loginMobile = await AsyncStorage.getItem('userMobile');

        console.log('================================');
        console.log('HEADER / LOGIN MOBILE:', loginMobile);
        console.log('================================');

        if (loginMobile) {
          const cleanLoginMobile = String(loginMobile).replace(/\D/g, '');

          setApiMobile(cleanLoginMobile);
        }
      } catch (err) {
        console.log('LOAD LOGIN MOBILE ERROR:', err);
      }
    };

    loadLoginMobile();
  }, []);

  // =======================================================
  // OTP TIMER
  // =======================================================

  useEffect(() => {
    let interval = null;

    if (otpVisible && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }

          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [otpVisible, otpTimer]);

  // =======================================================
  // GET PROPERTY VALUE
  // =======================================================

    // =======================================================
  // CHECK WHETHER THIS PROPERTY IS ALREADY VERIFIED
  // =======================================================

  useEffect(() => {
    const checkPropertyVerification = async () => {
      try {
        const verificationKey = getVerificationKey();

        if (!verificationKey) {
          console.log(
            'PROPERTY VERIFICATION KEY NOT FOUND',
          );
          return;
        }

        const alreadyVerified =
          await AsyncStorage.getItem(verificationKey);

        console.log('================================');
        console.log(
          'PROPERTY VERIFICATION KEY:',
          verificationKey,
        );
        console.log(
          'ALREADY VERIFIED:',
          alreadyVerified,
        );
        console.log('================================');

        if (alreadyVerified === 'true') {
          setExpanded(true);
        } else {
          setExpanded(false);
        }
      } catch (err) {
        console.log(
          'CHECK PROPERTY VERIFICATION ERROR:',
          err,
        );
      }
    };

    checkPropertyVerification();
  }, [property]);

  const getValue = (...keys) => {
    for (const key of keys) {
      const value = property?.[key];

      if (
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ''
      ) {
        return value;
      }
    }

    return '';
  };

  // =======================================================
  // PROPERTY CONTACT DETAILS
  // =======================================================

  const ownerName = getValue(
    'ownerName',
    'OwnerName',
    'owner',
    'Owner',
    'ContactPerson',
    'contactPerson',
    'contactName',
    'ContactName',
  );

  const mobile = getValue(
    'mobile',
    'Mobile',
    'ownerMobile',
    'OwnerMobile',
    'contactMobile',
    'ContactMobile',
    'contactmobile',
    'phone',
    'Phone',
  );

  const email = getValue(
    'email',
    'Email',
    'ownerEmail',
    'OwnerEmail',
    'contactEmail',
    'ContactEmail',
  );

  const designation = getValue(
    'designation',
    'Designation',
    'ownerDesignation',
    'OwnerDesignation',
  );

  // =======================================================
  // PROPERTY MOBILE
  // ONLY FOR CALL / WHATSAPP AFTER VERIFICATION
  // =======================================================

  const cleanMobile = mobile
    ? String(mobile).replace(/[^\d+]/g, '')
    : '';

  // =======================================================
  // SEND OTP
  // =======================================================

  const handleViewContactDetails = async () => {
    Keyboard.dismiss();

    if (!apiMobile || apiMobile.length !== 10) {
      warning(
        'Mobile Number Unavailable',
        'A valid login mobile number is not available for OTP verification.',
      );

      return;
    }

    setSendingOtp(true);

    try {
      console.log('================================');
      console.log('SEND OTP');
      console.log('LOGIN / HEADER MOBILE:', apiMobile);
      console.log('================================');

      const response = await fetch(
        'https://savariyaproperty.in/api/Login/SendOTP',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mobile: apiMobile,
          }),
        },
      );

      const result = await response.json();

      console.log(
        'SEND OTP RESULT:',
        JSON.stringify(result, null, 2),
      );

      // ===================================================
      // SUCCESS
      // ===================================================

      if (result?.statusCode === 1) {
        setOtp('');
        setOtpTimer(300);
        setOtpVisible(true);

         setOtp(String(result?.data));
        success(
          'OTP Sent',
          `OTP has been sent to +91 ${apiMobile}`,
        );

        return;
      }

      // ===================================================
      // FAILED
      // ===================================================

      error(
        'OTP Failed',
        result?.message ||
          result?.ResponseMessage ||
          'Unable to send OTP. Please try again.',
      );
    } catch (otpError) {
      console.log('SEND OTP ERROR:', otpError);

      error(
        'OTP Failed',
        'Unable to send OTP. Please try again.',
      );
    } finally {
      setSendingOtp(false);
    }
  };

  // =======================================================
  // VERIFY OTP
  // =======================================================

  const handleVerifyOTP = async () => {
    Keyboard.dismiss();
 
    if (!otp || otp.length !== 6) {
    warning(
      'Invalid OTP',
      'Please enter the 6 digit OTP.',
    );
    return;
  }

  setVerifyingOtp(true);

  
      const response = await fetch(
        'https://savariyaproperty.in/api/Login/VerifyOTP',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mobile: apiMobile,
            OTP: otp,
          }),
        },
      );

 
    try {
      
   const result = await response.json();

      console.log(
        'SEND OTP RESULT:',
        JSON.stringify(result, null, 2),
      );

      // ===================================================
      // SUCCESS
      // ===================================================

      if (result?.statusCode === 1) {        
        
        const verificationKey = getVerificationKey();

          if (verificationKey) {
            await AsyncStorage.setItem(
              verificationKey,
              'true',
            );

            console.log('================================');
            console.log(
              'PROPERTY VERIFIED & SAVED:',
              verificationKey,
            );
            console.log('================================');
          }

            setOtpVisible(false);
            setOtp('');
            setOtpTimer(300);
            setExpanded(true);
            success(
              'Verified Successfully',
              'Contact details are now visible.',
            );
        return;
      }

      // ===================================================
      // FAILED
      // ===================================================

      error(
        'Invalid OTP',
        response?.message ||
          response?.Message ||
          'Please enter the correct OTP.',
      );
    } catch (verifyError) {
      console.log('VERIFY OTP ERROR:', verifyError);

      error(
        'Verification Failed',
        'Unable to verify OTP.',
      );
    } finally {
      setVerifyingOtp(false);
    }
  };

  // =======================================================
  // RESEND OTP
  // =======================================================

  const handleResendOTP = async () => {
    if (otpTimer > 0 || sendingOtp) {
      return;
    }

    if (!apiMobile || apiMobile.length !== 10) {
      error(
        'Mobile Number Error',
        'Login mobile number is not valid.',
      );

      return;
    }

    Keyboard.dismiss();

    setSendingOtp(true);

    try {
      console.log('================================');
      console.log('RESEND OTP');
      console.log('MOBILE:', apiMobile);
      console.log('================================');

      const response = await sendOTP(apiMobile);

      console.log(
        'RESEND OTP RESPONSE:',
        JSON.stringify(response, null, 2),
      );

      if (
        response?.success === true ||
        response?.statusCode === 1 ||
        response?.status === true ||
        response?.sent === true
      ) {
        setOtp('');
        setOtpTimer(300);

        success(
          'OTP Resent',
          `A new OTP has been sent to +91 ${apiMobile}`,
        );

        return;
      }

      error(
        'Resend Failed',
        response?.message ||
          response?.Message ||
          'Unable to resend OTP.',
      );
    } catch (resendError) {
      console.log('RESEND OTP ERROR:', resendError);

      error(
        'Resend Failed',
        'Unable to resend OTP.',
      );
    } finally {
      setSendingOtp(false);
    }
  };

  // =======================================================
  // CALL PROPERTY CONTACT
  // =======================================================

  const handleCall = () => {
    if (!cleanMobile) {
      warning(
        'Mobile Number Unavailable',
        'Contact mobile number is not available.',
      );

      return;
    }

    Linking.openURL(`tel:${cleanMobile}`).catch(err => {
      console.log('CALL ERROR:', err);
    });
  };

  // =======================================================
  // WHATSAPP PROPERTY CONTACT
  // =======================================================

  const handleWhatsApp = () => {
    if (!cleanMobile) {
      warning(
        'Mobile Number Unavailable',
        'Contact mobile number is not available.',
      );

      return;
    }

    const whatsappNumber = cleanMobile.replace(/\D/g, '');

    const url = `https://wa.me/91${whatsappNumber}`;

    Linking.openURL(url).catch(err => {
      console.log('WHATSAPP ERROR:', err);
    });
  };

  // =======================================================
  // EMAIL
  // =======================================================

  const handleEmail = () => {
    if (!email) {
      warning(
        'Email Unavailable',
        'Contact email address is not available.',
      );

      return;
    }

    Linking.openURL(`mailto:${email}`).catch(err => {
      console.log('EMAIL ERROR:', err);
    });
  };

  // =======================================================
  // NO PROPERTY
  // =======================================================

  if (!property) {
    return null;
  }

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <View style={styles.container}>

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <View style={styles.headerRow}>

        <View style={styles.headerLeft}>

          <View style={styles.iconCircle}>
            <Icon
              name="account-tie"
              size={22}
              color="#012353"
            />
          </View>

          <View>
            <Text style={styles.title}>
              Contact Details
            </Text>

            <Text style={styles.subtitle}>
              Property owner / contact information
            </Text>
          </View>

        </View>

        <Icon
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={24}
          color="#012353"
        />

      </View>

      {/* ================================================= */}
      {/* CONTACT CONTENT */}
      {/* ================================================= */}

      {!expanded ? (

        <View style={styles.lockedContainer}>

          <View style={styles.lockIconCircle}>
            <Icon
              name="lock-outline"
              size={30}
              color="#F7941D"
            />
          </View>

          <Text style={styles.lockedTitle}>
            Contact details are protected
          </Text>

          <Text style={styles.lockedText}>
            Verify your registered mobile number to view
            the property contact details.
          </Text>

          <TouchableOpacity
            style={[
              styles.viewDetailsButton,
              sendingOtp && styles.disabledButton,
            ]}
            onPress={handleViewContactDetails}
            disabled={sendingOtp}
            activeOpacity={0.8}
          >

            {sendingOtp ? (
              <>
                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />

                <Text style={styles.viewDetailsText}>
                  Sending OTP...
                </Text>
              </>
            ) : (
              <>
                <Icon
                  name="shield-check-outline"
                  size={20}
                  color="#FFFFFF"
                />

                <Text style={styles.viewDetailsText}>
                  Verify & View Contact
                </Text>
              </>
            )}

          </TouchableOpacity>

        </View>

      ) : (

        <View style={styles.contactContent}>

          {/* ================================================= */}
          {/* OWNER */}
          {/* ================================================= */}

          <View style={styles.contactRow}>

            <View style={styles.contactIcon}>
              <Icon
                name="account"
                size={22}
                color="#012353"
              />
            </View>

            <View style={styles.contactInfo}>
              <Text style={styles.label}>
                Contact Person
              </Text>

              <Text style={styles.value}>
                {ownerName || 'Not Available'}
              </Text>

              {designation ? (
                <Text style={styles.designation}>
                  {designation}
                </Text>
              ) : null}
            </View>

          </View>

          {/* ================================================= */}
          {/* MOBILE */}
          {/* ================================================= */}

          {mobile ? (
            <View style={styles.contactRow}>

              <View style={styles.contactIcon}>
                <Icon
                  name="phone"
                  size={21}
                  color="#012353"
                />
              </View>

              <View style={styles.contactInfo}>
                <Text style={styles.label}>
                  Mobile Number
                </Text>

                <Text style={styles.value}>
                  {mobile}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleCall}
                activeOpacity={0.8}
              >
                <Icon
                  name="phone"
                  size={19}
                  color="#FFFFFF"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.whatsappButton,
                ]}
                onPress={handleWhatsApp}
                activeOpacity={0.8}
              >
                <Icon
                  name="whatsapp"
                  size={20}
                  color="#FFFFFF"
                />
              </TouchableOpacity>

            </View>
          ) : null}

          {/* ================================================= */}
          {/* EMAIL */}
          {/* ================================================= */}

          {email ? (
            <View style={styles.contactRow}>

              <View style={styles.contactIcon}>
                <Icon
                  name="email-outline"
                  size={22}
                  color="#012353"
                />
              </View>

              <View style={styles.contactInfo}>
                <Text style={styles.label}>
                  Email
                </Text>

                <Text style={styles.value}>
                  {email}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleEmail}
                activeOpacity={0.8}
              >
                <Icon
                  name="email-outline"
                  size={19}
                  color="#FFFFFF"
                />
              </TouchableOpacity>

            </View>
          ) : null}

          {/* ================================================= */}
          {/* VERIFIED */}
          {/* ================================================= */}

          <View style={styles.verifiedBox}>

            <Icon
              name="check-decagram"
              size={21}
              color="#2E7D32"
            />

            <Text style={styles.verifiedText}>
              Mobile number verified successfully
            </Text>

          </View>

        </View>

      )}

      {/* ===================================================== */}
      {/* OTP MODAL */}
      {/* ===================================================== */}

      {otpVisible && (

        <View style={styles.otpOverlay}>

          <View style={styles.otpModal}>

            {/* CLOSE */}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                if (!verifyingOtp) {
                  setOtpVisible(false);
                  setOtp('');
                }
              }}
              disabled={verifyingOtp}
              activeOpacity={0.8}
            >
              <Icon
                name="close"
                size={23}
                color="#555555"
              />
            </TouchableOpacity>

            {/* ICON */}

            <View style={styles.otpIconCircle}>

              <Icon
                name="shield-key-outline"
                size={32}
                color="#F7941D"
              />

            </View>

            {/* TITLE */}

            <Text style={styles.otpTitle}>
              Verify Contact Number
            </Text>

            <Text style={styles.otpSubtitle}>
              Enter the 6 digit OTP sent to
            </Text>

            <Text style={styles.otpMobile}>
              +91 {apiMobile}
            </Text>

            {/* OTP INPUT */}

            <TextInput
              style={styles.otpInput}
              value={otp}
              onChangeText={text => {
                const value = text
                  .replace(/\D/g, '')
                  .slice(0, 6);

                setOtp(value);
              }}
              keyboardType="number-pad"
              maxLength={6}
              placeholder="Enter OTP"
              placeholderTextColor="#999999"
              textAlign="center"
              autoFocus
            />

            {/* VERIFY */}

            <TouchableOpacity
              style={[
                styles.verifyButton,
                verifyingOtp && styles.disabledButton,
              ]}
              onPress={handleVerifyOTP}
              disabled={verifyingOtp}
              activeOpacity={0.8}
            >

              {verifyingOtp ? (
                <>
                  <ActivityIndicator
                    size="small"
                    color="#FFFFFF"
                  />

                  <Text style={styles.verifyButtonText}>
                    Verifying...
                  </Text>
                </>
              ) : (
                <>
                  <Icon
                    name="check-circle-outline"
                    size={21}
                    color="#FFFFFF"
                  />

                  <Text style={styles.verifyButtonText}>
                    Verify OTP
                  </Text>
                </>
              )}

            </TouchableOpacity>

            {/* RESEND */}

            <View style={styles.resendContainer}>

              {otpTimer > 0 ? (

                <Text style={styles.timerText}>
                  Resend OTP in {otpTimer}s
                </Text>

              ) : (

                <TouchableOpacity
                  onPress={handleResendOTP}
                  disabled={sendingOtp}
                  activeOpacity={0.8}
                >

                  <Text style={styles.resendText}>
                    Resend OTP
                  </Text>

                </TouchableOpacity>

              )}

            </View>

          </View>

        </View>

      )}

    </View>
  );
};

// =========================================================
// STYLES
// =========================================================

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginHorizontal: 12,
    marginTop: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5EAF0',
  },

  headerRow: {
    minHeight: 74,
    paddingHorizontal: 15,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EAF4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#012353',
  },

  subtitle: {
    fontSize: 11,
    color: '#777777',
    marginTop: 3,
  },

  lockedContainer: {
    borderTopWidth: 1,
    borderTopColor: '#EEF1F5',
    paddingHorizontal: 20,
    paddingVertical: 25,
    alignItems: 'center',
  },

  lockIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
  },

  lockedTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#012353',
    textAlign: 'center',
  },

  lockedText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#777777',
    textAlign: 'center',
    marginTop: 7,
    maxWidth: 310,
  },

  viewDetailsButton: {
    marginTop: 18,
    minHeight: 46,
    paddingHorizontal: 22,
    borderRadius: 10,
    backgroundColor: '#F7941D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
  },

  disabledButton: {
    opacity: 0.65,
  },

  viewDetailsText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  contactContent: {
    borderTopWidth: 1,
    borderTopColor: '#EEF1F5',
    paddingHorizontal: 15,
    paddingVertical: 8,
  },

  contactRow: {
    minHeight: 65,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
    paddingVertical: 9,
  },

  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EAF4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  contactInfo: {
    flex: 1,
  },

  label: {
    fontSize: 10,
    color: '#888888',
    marginBottom: 3,
  },

  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#012353',
  },

  designation: {
    fontSize: 11,
    color: '#777777',
    marginTop: 2,
  },

  actionButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#012353',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 7,
  },

  whatsappButton: {
    backgroundColor: '#25D366',
  },

  verifiedBox: {
    marginTop: 13,
    marginBottom: 7,
    minHeight: 42,
    paddingHorizontal: 12,
    borderRadius: 9,
    backgroundColor: '#EEF8F0',
    flexDirection: 'row',
    alignItems: 'center',
  },

  verifiedText: {
    marginLeft: 8,
    color: '#2E7D32',
    fontSize: 12,
    fontWeight: '600',
  },

  // =======================================================
  // OTP OVERLAY
  // =======================================================

  otpOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 360,
    backgroundColor: 'rgba(1, 35, 83, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    zIndex: 999,
    elevation: 20,
  },

  otpModal: {
    width: '100%',
    maxWidth: 390,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 22,
    paddingTop: 25,
    paddingBottom: 22,
    alignItems: 'center',
    elevation: 25,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.18,
    shadowRadius: 10,
  },

  closeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F4F5F7',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },

  otpIconCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#FFF4E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  otpTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#012353',
    textAlign: 'center',
  },

  otpSubtitle: {
    fontSize: 12,
    color: '#777777',
    marginTop: 7,
    textAlign: 'center',
  },

  otpMobile: {
    fontSize: 14,
    fontWeight: '700',
    color: '#012353',
    marginTop: 3,
  },

  otpInput: {
    width: '100%',
    height: 52,
    borderWidth: 1.5,
    borderColor: '#D8DEE6',
    borderRadius: 10,
    marginTop: 18,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 7,
    color: '#012353',
    backgroundColor: '#FAFBFC',
  },

  verifyButton: {
    width: '100%',
    height: 48,
    borderRadius: 10,
    backgroundColor: '#F7941D',
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  resendContainer: {
    minHeight: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 9,
  },

  timerText: {
    fontSize: 12,
    color: '#888888',
  },

  resendText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F7941D',
  },
});

export default PropertyContactDetails;