import React, {useEffect, useRef, useState} from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  Animated,
  Pressable,
  Keyboard,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

/* =========================================================
   INPUT COMPONENT

   IMPORTANT:
   Keep this OUTSIDE RoleBasedRegistrationScreen.
   This prevents TextInput from remounting while typing.
========================================================= */

const InputBox = ({
  icon,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  secureTextEntry = false,
  rightIcon,
  onRightPress,
  maxLength,
  autoCapitalize = 'none',
}) => {
  return (
    <View style={styles.inputContainer}>
      <Icon name={icon} size={19} color="#012353" />

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        maxLength={maxLength}
        underlineColorAndroid="transparent"
        returnKeyType="next"
      />

      {rightIcon ? (
        <TouchableOpacity
          onPress={onRightPress}
          activeOpacity={0.7}>
          <Icon name={rightIcon} size={20} color="#777" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};



/* =========================================================
   ROLE BASED REGISTRATION SCREEN
========================================================= */

const RoleBasedRegistrationScreen = ({navigation, route}) => {
  const role = route?.params?.role || 'CUSTOMER';

  /* =======================================================
     STEP
  ======================================================= */

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  /* =======================================================
     BASIC DETAILS
  ======================================================= */

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  /* =======================================================
     STEP 2 - COMMON
  ======================================================= */

  const [city, setCity] = useState('');
  const [experience, setExperience] = useState('');

  /* =======================================================
     BUILDER / INVESTOR
  ======================================================= */

  const [companyName, setCompanyName] = useState('');
  const [businessType, setBusinessType] = useState('');

  /* =======================================================
     PROPERTY EXECUTIVE
  ======================================================= */

  const [workingArea, setWorkingArea] = useState('');

  /* =======================================================
     OWNER
  ======================================================= */

  const [propertyType, setPropertyType] = useState('');
  const [propertyLocation, setPropertyLocation] = useState('');
  const [purpose, setPurpose] = useState('');

  /* =======================================================
     CUSTOMER
  ======================================================= */

  const [lookingFor, setLookingFor] = useState('');
  const [preferredLocation, setPreferredLocation] = useState('');
  const [budget, setBudget] = useState('');

  /* =======================================================
     ANIMATIONS
  ======================================================= */

  const fadeAnim = useRef(
    new Animated.Value(0),
  ).current;

  const scaleAnim = useRef(
    new Animated.Value(0.94),
  ).current;

  const keyboardOffset = useRef(
    new Animated.Value(0),
  ).current;

  const successAnim = useRef(
    new Animated.Value(120),
  ).current;

  const goToHome = async () => {
  try {
    console.log('1. goToHome START');

    // Safe values
    const safeName = String(name || '');
    const safeMobile = String(mobile || '');
    const safeEmail = String(email || '');
    const safeRole = String(role || 'CUSTOMER');

    console.log('2. VALUES OK');

    const cleanMobile = safeMobile.replace(/[^0-9]/g, '');

    console.log('3. MOBILE CLEAN:', cleanMobile);

    // SAVE DATA
    await AsyncStorage.setItem('userLogin', 'true');
    console.log('4. userLogin saved');

    await AsyncStorage.setItem('loginStatus', 'true');
    console.log('5. loginStatus saved');

    await AsyncStorage.setItem('userName', safeName);
    console.log('6. userName saved');

    await AsyncStorage.setItem('userMobile', cleanMobile);
    console.log('7. userMobile saved');

    await AsyncStorage.setItem('userEmail', safeEmail);
    console.log('8. userEmail saved');

    await AsyncStorage.setItem('userRole', safeRole);
    console.log('9. userRole saved');

    // VERIFY
    const savedLogin = await AsyncStorage.getItem('userLogin');
    const savedName = await AsyncStorage.getItem('userName');
    const savedMobile = await AsyncStorage.getItem('userMobile');
    const savedRole = await AsyncStorage.getItem('userRole');

    console.log('10. STORAGE VERIFY:', {
      savedLogin,
      savedName,
      savedMobile,
      savedRole,
    });

    // CLOSE POPUP
    setShowSuccess(false);

    console.log('11. GOING HOME');

    navigation.reset({
      index: 0,
      routes: [{name: 'Home'}],
    });

  } catch (error) {
    console.log('❌ GO HOME ERROR:', error);

    Alert.alert(
      'Storage Error',
      String(error?.message || error),
    );
  }
};

  /* =======================================================
     POPUP OPEN ANIMATION
  ======================================================= */

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),

      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 70,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  /* =======================================================
     KEYBOARD - MOVE POPUP UP
  ======================================================= */

  useEffect(() => {
    const keyboardDidShow = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        Animated.spring(keyboardOffset, {
          toValue: -120,
          friction: 8,
          tension: 70,
          useNativeDriver: true,
        }).start();
      },
    );

    const keyboardDidHide = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        Animated.spring(keyboardOffset, {
          toValue: 0,
          friction: 8,
          tension: 70,
          useNativeDriver: true,
        }).start();
      },
    );

    return () => {
      keyboardDidShow.remove();
      keyboardDidHide.remove();
    };
  }, [keyboardOffset]);

  /* =======================================================
     SUCCESS -> AUTO LOGIN -> HOME
  ======================================================= */

  useEffect(() => {
    if (!showSuccess) {
      return;
    }

    const timer = setTimeout(() => {
    goToHome();
  }, 2000);


    return () => clearTimeout(timer);
  }, [
    showSuccess,
    mobile,
    name,
    email,
    role,
    navigation,
  ]);

  /* =======================================================
     ROLE DETAILS
  ======================================================= */

  const roleDetails = {
    BUILDER: {
      title: 'Builder / Investor',
      description:
        'Create your account to manage projects & investments',
      icon: 'office-building-outline',
    },

    EXECUTIVE: {
      title: 'Property Executive',
      description:
        'Create your account to manage properties & clients',
      icon: 'account-tie-outline',
    },

    OWNER: {
      title: 'Property Owner',
      description:
        'Create your account to sell or rent your property',
      icon: 'home-account',
    },

    CUSTOMER: {
      title: 'Property Seeker',
      description:
        'Create your account to buy or rent a property',
      icon: 'home-search-outline',
    },
  };

  const currentRole =
    roleDetails[role] || roleDetails.CUSTOMER;

  /* =======================================================
     CLOSE
  ======================================================= */

  const closePopup = () => {
    if (loading) {
      return;
    }

    navigation.goBack();
  };

  /* =======================================================
     STEP 1 VALIDATION
  ======================================================= */

  const validateStepOne = () => {
    if (!name.trim()) {
      Alert.alert(
        'Required',
        'Please enter your full name.',
      );
      return false;
    }

    const cleanMobile = mobile.replace(/[^0-9]/g, '');

    if (!cleanMobile) {
      Alert.alert(
        'Required',
        'Please enter your mobile number.',
      );
      return false;
    }

    if (cleanMobile.length !== 10) {
      Alert.alert(
        'Invalid Mobile',
        'Please enter a valid 10 digit mobile number.',
      );
      return false;
    }

    if (!email.trim()) {
      Alert.alert(
        'Required',
        'Please enter your email address.',
      );
      return false;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      Alert.alert(
        'Invalid Email',
        'Please enter a valid email address.',
      );
      return false;
    }

    if (!password) {
      Alert.alert(
        'Required',
        'Please enter your password.',
      );
      return false;
    }

    if (password.length < 6) {
      Alert.alert(
        'Password',
        'Password must be at least 6 characters.',
      );
      return false;
    }

    if (!confirmPassword) {
      Alert.alert(
        'Required',
        'Please confirm your password.',
      );
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        'Password Mismatch',
        'Password and confirm password do not match.',
      );
      return false;
    }

    return true;
  };

  /* =======================================================
     STEP 2 VALIDATION
  ======================================================= */

  const validateStepTwo = () => {
    if (!city.trim()) {
      Alert.alert(
        'Required',
        'Please enter your city.',
      );
      return false;
    }

    /* -----------------------------------------------
       BUILDER / INVESTOR
    ------------------------------------------------ */

    if (role === 'BUILDER') {
      if (!companyName.trim()) {
        Alert.alert(
          'Required',
          'Please enter company / firm name.',
        );
        return false;
      }

      if (!businessType.trim()) {
        Alert.alert(
          'Required',
          'Please enter business type.',
        );
        return false;
      }

      return true;
    }

    /* -----------------------------------------------
       PROPERTY EXECUTIVE
    ------------------------------------------------ */

    if (role === 'EXECUTIVE') {
      if (!companyName.trim()) {
        Alert.alert(
          'Required',
          'Please enter agency / company name.',
        );
        return false;
      }

      if (!workingArea.trim()) {
        Alert.alert(
          'Required',
          'Please enter your working area.',
        );
        return false;
      }

      return true;
    }

    /* -----------------------------------------------
       PROPERTY OWNER
    ------------------------------------------------ */

    if (role === 'OWNER') {
      if (!propertyType.trim()) {
        Alert.alert(
          'Required',
          'Please enter property type.',
        );
        return false;
      }

      if (!propertyLocation.trim()) {
        Alert.alert(
          'Required',
          'Please enter property location.',
        );
        return false;
      }

      if (!purpose.trim()) {
        Alert.alert(
          'Required',
          'Please enter Sell or Rent.',
        );
        return false;
      }

      return true;
    }

    /* -----------------------------------------------
       PROPERTY SEEKER
    ------------------------------------------------ */

    if (role === 'CUSTOMER') {
      if (!lookingFor.trim()) {
        Alert.alert(
          'Required',
          'Please enter Buy or Rent.',
        );
        return false;
      }

      if (!propertyType.trim()) {
        Alert.alert(
          'Required',
          'Please enter property type.',
        );
        return false;
      }

      if (!preferredLocation.trim()) {
        Alert.alert(
          'Required',
          'Please enter preferred location.',
        );
        return false;
      }

      return true;
    }

    return true;
  };

  /* =======================================================
     NEXT
  ======================================================= */

  const handleNext = () => {
    if (!validateStepOne()) {
      return;
    }

    setStep(2);
  };

  /* =======================================================
     BACK
  ======================================================= */

  const handleBack = () => {
    if (loading) {
      return;
    }

    setStep(1);
  };

  /* =======================================================
     REGISTER
  ======================================================= */

  const handleRegister = async () => {
    if (!validateStepTwo()) {
      return;
    }

    try {
      setLoading(false);

      setShowSuccess(true);

      successAnim.setValue(120);

      Animated.spring(successAnim, {
        toValue: 0,
        friction: 8,
        tension: 70,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.log(
        'REGISTRATION ERROR:',
        error,
      );

      setLoading(false);
    }
  };

  /* =======================================================
     STEP 2 UI
  ======================================================= */

  const renderStepTwo = () => {
    /* =====================================================
       BUILDER / INVESTOR
    ===================================================== */

    if (role === 'BUILDER') {
      return (
        <>
          <InputBox
            icon="office-building-outline"
            placeholder="Company / Firm Name"
            value={companyName}
            onChangeText={setCompanyName}
            autoCapitalize="words"
          />

          <InputBox
            icon="briefcase-outline"
            placeholder="Business Type"
            value={businessType}
            onChangeText={setBusinessType}
            autoCapitalize="words"
          />

          <InputBox
            icon="map-marker-outline"
            placeholder="City"
            value={city}
            onChangeText={setCity}
            autoCapitalize="words"
          />

          <InputBox
            icon="clock-outline"
            placeholder="Experience (Years)"
            value={experience}
            onChangeText={text =>
              setExperience(
                text.replace(/[^0-9]/g, ''),
              )
            }
            keyboardType="numeric"
            maxLength={2}
          />
        </>
      );
    }

    /* =====================================================
       PROPERTY EXECUTIVE
    ===================================================== */

    if (role === 'EXECUTIVE') {
      return (
        <>
          <InputBox
            icon="office-building-outline"
            placeholder="Agency / Company Name"
            value={companyName}
            onChangeText={setCompanyName}
            autoCapitalize="words"
          />

          <InputBox
            icon="map-marker-outline"
            placeholder="City"
            value={city}
            onChangeText={setCity}
            autoCapitalize="words"
          />

          <InputBox
            icon="clock-outline"
            placeholder="Experience (Years)"
            value={experience}
            onChangeText={text =>
              setExperience(
                text.replace(/[^0-9]/g, ''),
              )
            }
            keyboardType="numeric"
            maxLength={2}
          />

          <InputBox
            icon="map-marker-radius-outline"
            placeholder="Working Area / Localities"
            value={workingArea}
            onChangeText={setWorkingArea}
            autoCapitalize="words"
          />
        </>
      );
    }

    /* =====================================================
       PROPERTY OWNER
    ===================================================== */

    if (role === 'OWNER') {
      return (
        <>
          <InputBox
            icon="map-marker-outline"
            placeholder="City"
            value={city}
            onChangeText={setCity}
            autoCapitalize="words"
          />

          <InputBox
            icon="home-outline"
            placeholder="Property Type"
            value={propertyType}
            onChangeText={setPropertyType}
            autoCapitalize="words"
          />

          <InputBox
            icon="map-marker-radius-outline"
            placeholder="Property Location"
            value={propertyLocation}
            onChangeText={setPropertyLocation}
            autoCapitalize="words"
          />

          <InputBox
            icon="swap-horizontal"
            placeholder="Purpose - Sell / Rent"
            value={purpose}
            onChangeText={setPurpose}
            autoCapitalize="words"
          />
        </>
      );
    }

    /* =====================================================
       PROPERTY SEEKER
    ===================================================== */

    return (
      <>
        <InputBox
          icon="map-marker-outline"
          placeholder="City"
          value={city}
          onChangeText={setCity}
          autoCapitalize="words"
        />

        <InputBox
          icon="swap-horizontal"
          placeholder="Looking For - Buy / Rent"
          value={lookingFor}
          onChangeText={setLookingFor}
          autoCapitalize="words"
        />

        <InputBox
          icon="home-outline"
          placeholder="Property Type"
          value={propertyType}
          onChangeText={setPropertyType}
          autoCapitalize="words"
        />

        <InputBox
          icon="map-marker-radius-outline"
          placeholder="Preferred Location"
          value={preferredLocation}
          onChangeText={setPreferredLocation}
          autoCapitalize="words"
        />

        <InputBox
          icon="currency-inr"
          placeholder="Budget"
          value={budget}
          onChangeText={text =>
            setBudget(
              text.replace(/[^0-9]/g, ''),
            )
          }
          keyboardType="numeric"
        />
      </>
    );
  };

  /* =======================================================
     MAIN
  ======================================================= */

  return (
    <View style={styles.overlay}>

      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      {/* ===================================================
          OUTSIDE POPUP
      =================================================== */}

      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={closePopup}
      />

      {/* ===================================================
          POPUP
      =================================================== */}

    {/* ===================================================
    POPUP
=================================================== */}

{!showSuccess && (
  <Animated.View
    style={[
      styles.popup,
      {
        opacity: fadeAnim,
        transform: [
          {
            scale: scaleAnim,
          },
          {
            translateY: keyboardOffset,
          },
        ],
      },
    ]}>

    {/* CLOSE BUTTON */}
    <TouchableOpacity
      style={styles.closeButton}
      onPress={closePopup}
      activeOpacity={0.7}>
      <Icon
        name="close"
        size={20}
        color="#555"
      />
    </TouchableOpacity>

    {/* ROLE HEADER */}
    <View style={styles.roleHeader}>
      <View style={styles.roleIcon}>
        <Icon
          name={currentRole.icon}
          size={27}
          color="#F58220"
        />
      </View>

      <View style={styles.roleTextContainer}>
        <Text style={styles.roleTitle}>
          {currentRole.title}
        </Text>

        <Text style={styles.roleDescription}>
          {currentRole.description}
        </Text>
      </View>
    </View>

    {/* STEP INDICATOR */}
    <View style={styles.stepContainer}>

      <View
        style={[
          styles.stepCircle,
          step === 1 && styles.stepActive,
        ]}>
        <Text
          style={[
            styles.stepNumber,
            step !== 1 && styles.stepInactiveNumber,
          ]}>
          1
        </Text>
      </View>

      <View
        style={[
          styles.stepLine,
          step === 2 && styles.stepLineActive,
        ]}
      />

      <View
        style={[
          styles.stepCircle,
          step === 2 && styles.stepActive,
        ]}>
        <Text
          style={[
            styles.stepNumber,
            step !== 2 && styles.stepInactiveNumber,
          ]}>
          2
        </Text>
      </View>

    </View>

    {/* STEP TITLE */}
    <View style={styles.stepTitleRow}>
      <Text style={styles.stepTitle}>
        {step === 1
          ? 'Basic Details'
          : 'Additional Details'}
      </Text>

      <Text style={styles.stepCount}>
        Step {step} of 2
      </Text>
    </View>

    {/* =================================================
        STEP 1
    ================================================= */}

    {step === 1 && (
      <>
        <InputBox
          icon="account-outline"
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <InputBox
          icon="phone-outline"
          placeholder="Mobile Number"
          value={mobile}
          onChangeText={text =>
            setMobile(text.replace(/[^0-9]/g, ''))
          }
          keyboardType="phone-pad"
          maxLength={10}
        />

        <InputBox
          icon="email-outline"
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <InputBox
          icon="lock-outline"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          rightIcon={
            showPassword
              ? 'eye-off-outline'
              : 'eye-outline'
          }
          onRightPress={() =>
            setShowPassword(!showPassword)
          }
        />

        <InputBox
          icon="lock-check-outline"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          rightIcon={
            showConfirmPassword
              ? 'eye-off-outline'
              : 'eye-outline'
          }
          onRightPress={() =>
            setShowConfirmPassword(
              !showConfirmPassword,
            )
          }
        />

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleNext}
          activeOpacity={0.8}>

          <Text style={styles.primaryButtonText}>
            Next
          </Text>

          <Icon
            name="arrow-right"
            size={18}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </>
    )}

    {/* =================================================
        STEP 2
    ================================================= */}

    {step === 2 && (
      <>
        {renderStepTwo()}

        <View style={styles.buttonRow}>

          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.8}>

            <Icon
              name="arrow-left"
              size={17}
              color="#012353"
            />

            <Text style={styles.backButtonText}>
              Back
            </Text>

          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.primaryButton,
              styles.registerButton,
              loading && styles.disabledButton,
            ]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}>

            {loading ? (
              <Text style={styles.primaryButtonText}>
                Please wait...
              </Text>
            ) : (
              <>
                <Text style={styles.primaryButtonText}>
                  Register
                </Text>

                <Icon
                  name="check-circle-outline"
                  size={18}
                  color="#FFFFFF"
                />
              </>
            )}

          </TouchableOpacity>

        </View>
      </>
    )}

    {/* SECURITY */}
    <View style={styles.securityBox}>
      <Icon
        name="shield-check-outline"
        size={16}
        color="#2E7D32"
      />

      <Text style={styles.securityText}>
        Your information is safe and secure
      </Text>
    </View>

  </Animated.View>
)}

{/* ===================================================
    SUCCESS MESSAGE
=================================================== */}

{showSuccess && (
  <Animated.View
    style={[
      styles.successMessage,
      {
        transform: [
          {
            translateY: successAnim,
          },
        ],
      },
    ]}>

    <View style={styles.successIcon}>
      <Icon
        name="check"
        size={32}
        color="#FFFFFF"
      />
    </View>

    <Text style={styles.successTitle}>
      Thank You!
    </Text>

    <Text style={styles.successSubtitle}>
      Welcome to Savariya Property
    </Text>

    <Text style={styles.joinText}>
      Join Us & Grow With Us
    </Text>

    <Text style={styles.successDescription}>
      Your registration has been completed
      successfully.
    </Text>

  </Animated.View>
)}


      {/* ===================================================
          SUCCESS MESSAGE
      =================================================== */}

      {showSuccess && (
        <Animated.View
          style={[
            styles.successMessage,
            {
              transform: [
                {
                  translateY: successAnim,
                },
              ],
            },
          ]}>

          <View style={styles.successIcon}>
            <Icon
              name="check"
              size={32}
              color="#FFFFFF"
            />
          </View>

          <Text style={styles.successTitle}>
            Thank You!
          </Text>

          <Text style={styles.successSubtitle}>
            Welcome to Savariya Property
          </Text>

          <Text style={styles.joinText}>
            Join Us & Grow With Us
          </Text>

          <Text style={styles.successDescription}>
            Your registration has been completed
            successfully.
          </Text>

<TouchableOpacity
  style={styles.homeButton}
  onPress={goToHome}
  activeOpacity={0.85}>
  
  <Text style={styles.homeButtonText}>
    Go to Home
  </Text>

  <Icon
    name="arrow-right"
    size={18}
    color="#FFFFFF"
  />
</TouchableOpacity>
        </Animated.View>
      )}
    </View>
  )};

export default RoleBasedRegistrationScreen;

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({

  /* =======================================================
     OVERLAY
  ======================================================= */

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.60)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  /* =======================================================
     POPUP
  ======================================================= */

  popup: {
    width: '100%',
    maxWidth: 430,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 13,

    elevation: 20,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 8,
    },

    shadowOpacity: 0.28,
    shadowRadius: 15,
  },

  /* =======================================================
     CLOSE
  ======================================================= */

  closeButton: {
    position: 'absolute',
    right: 11,
    top: 11,

    width: 34,
    height: 34,
    borderRadius: 17,

    backgroundColor: '#F2F2F2',

    alignItems: 'center',
    justifyContent: 'center',

    zIndex: 50,
  },

  /* =======================================================
     ROLE HEADER
  ======================================================= */

  roleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 38,
    marginBottom: 10,
  },

  roleIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,

    backgroundColor: '#FFF3E8',

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 10,
  },

  roleTextContainer: {
    flex: 1,
  },

  roleTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#012353',
    marginBottom: 2,
  },

  roleDescription: {
    fontSize: 11.5,
    color: '#777',
    lineHeight: 15,
  },

  /* =======================================================
     STEP
  ======================================================= */

  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    marginTop: 1,
    marginBottom: 5,
  },

  stepCircle: {
    width: 25,
    height: 25,
    borderRadius: 13,

    backgroundColor: '#E5E5E5',

    alignItems: 'center',
    justifyContent: 'center',
  },

  stepActive: {
    backgroundColor: '#012353',
  },

  stepNumber: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
  },

  stepInactiveNumber: {
    color: '#777',
  },

  stepLine: {
    width: 70,
    height: 2,
    backgroundColor: '#DDDDDD',
  },

  stepLineActive: {
    backgroundColor: '#F58220',
  },

  stepTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    marginBottom: 8,
  },

  stepTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#012353',
  },

  stepCount: {
    fontSize: 10.5,
    color: '#888',
  },

  /* =======================================================
     INPUT
  ======================================================= */

  inputContainer: {
    height: 42,

    borderWidth: 1,
    borderColor: '#DFDFDF',
    borderRadius: 9,

    backgroundColor: '#FAFAFA',

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 11,

    marginBottom: 7,
  },

  input: {
    flex: 1,
    height: 41,

    marginLeft: 8,

    paddingVertical: 0,
    paddingHorizontal: 0,

    fontSize: 13.5,
    color: '#222',
  },

  /* =======================================================
     PRIMARY BUTTON
  ======================================================= */

  primaryButton: {
    height: 43,

    backgroundColor: '#012353',

    borderRadius: 9,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    marginTop: 3,

    gap: 7,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },

  /* =======================================================
     STEP 2 BUTTONS
  ======================================================= */

  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',

    marginTop: 3,

    gap: 8,
  },

  backButton: {
    height: 43,
    minWidth: 82,

    borderWidth: 1,
    borderColor: '#012353',
    borderRadius: 9,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 4,
  },

  backButtonText: {
    color: '#012353',
    fontSize: 13,
    fontWeight: '800',
  },

  registerButton: {
    flex: 1,
    marginTop: 0,
  },

  disabledButton: {
    opacity: 0.55,
  },

  /* =======================================================
     SECURITY
  ======================================================= */

  securityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',

    marginTop: 7,

    paddingTop: 6,
  },

  securityText: {
    fontSize: 10.5,
    color: '#777',
    marginLeft: 5,
  },

  /* =======================================================
     SUCCESS MESSAGE
  ======================================================= */

  successMessage: {
  position: 'absolute',

  width: '88%',
  maxWidth: 390,
  height: '50%',

  left: '6%',
  top: '25%',

  backgroundColor: '#FFFFFF',

  borderRadius: 24,

  paddingHorizontal: 22,
  paddingTop: 28,
  paddingBottom: 24,

  alignItems: 'center',
  justifyContent: 'center',

  elevation: 30,

  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 8,
  },
  shadowOpacity: 0.30,
  shadowRadius: 18,

  zIndex: 100,
},


  successIcon: {
    width: 56,
    height: 56,

    borderRadius: 28,

    backgroundColor: '#2E7D32',

    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: 8,
  },

  successTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#012353',
    marginBottom: 2,
  },

  successSubtitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#F58220',
    marginBottom: 3,
  },

  joinText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#012353',
    marginBottom: 4,
  },

  successDescription: {
    fontSize: 11.5,
    color: '#777',

    textAlign: 'center',

    lineHeight: 16,

    marginBottom: 10,
  },
  homeButton: {
  width: '100%',
  height: 44,

  backgroundColor: '#012353',

  borderRadius: 10,

  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',

  marginTop: 8,

  gap: 7,
},

homeButtonText: {
  color: '#FFFFFF',
  fontSize: 13.5,
  fontWeight: '800',
},

});
