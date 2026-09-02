// RoleBasedRegistrationScreen.js

import React, {useState} from 'react';
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
} from 'react-native';
import axios from 'axios';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../components/Header';
import Footer from '../components/Footer';

function RoleBasedRegistrationScreen({navigation, route}) {

  const {role} = route.params || {};

  
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const roleDetails = {
    BUILDER_INVESTOR: {
      title: 'Builder / Investor',
      subtitle: 'Create your account to manage projects & investments',
      icon: 'office-building-outline',
    },

    PROPERTY_EXECUTIVE: {
      title: 'Property Executive',
      subtitle: 'Create your account to manage properties & clients',
      icon: 'account-tie-outline',
    },

    OWNER: {
      title: 'Property Owner',
      subtitle: 'Create your account to sell or rent your property',
      icon: 'home-account',
    },

    CUSTOMER: {
      title: 'Property Seeker',
      subtitle: 'Create your account to buy or rent a property',
      icon: 'home-search-outline',
    },
  };

  const currentRole =
    roleDetails[role] || roleDetails.CUSTOMER;

  const handleContinue = async () => {
  if (!name.trim()) {
    Alert.alert('Required', 'Please enter your name');
    return;
  }

  if (!mobile.trim()) {
    Alert.alert('Required', 'Please enter mobile number');
    return;
  }

  if (mobile.length !== 10) {
    Alert.alert(
      'Invalid Mobile',
      'Please enter a valid 10 digit mobile number',
    );
    return;
  }

  if (email.trim() && !email.includes('@')) {
    Alert.alert(
      'Invalid Email',
      'Please enter a valid email address',
    );
    return;
  }

  try {
  const response = await axios.post(
    'https://savariyaproperty.in/api/Register',
    {
      name: name,
      mobile: mobile,
      email: email,
      password: password,
      roleType: role,
    },
  );

  console.log('Register API Response:', response.data);

  if (response.data?.success === true) {
    Alert.alert(
      'Success',
      response.data?.message || 'Registration Successful',
      [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('Login');
          },
        },
      ],
    );
  } else {
    Alert.alert(
      'Registration Failed',
      response.data?.message || 'Something went wrong',
    );
  }

} catch (error) {
  console.log(
    'Registration API Error:',
    error?.response?.data || error.message,
  );

  Alert.alert(
    'Error',
    error?.response?.data?.message ||
      'Unable to register. Please try again.',
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {/* Role Header */}

        <View style={styles.roleHeader}>

          <View style={styles.roleIcon}>
            <Icon
              name={currentRole.icon}
              size={34}
              color="#FFFFFF"
            />
          </View>

          <View style={styles.roleHeaderContent}>

            <Text style={styles.registerLabel}>
              CREATE ACCOUNT
            </Text>

            <Text style={styles.roleTitle}>
              {currentRole.title}
            </Text>

          </View>

        </View>

        {/* Description */}

        <Text style={styles.description}>
          {currentRole.subtitle}
        </Text>

        {/* Progress */}

        <View style={styles.progressContainer}>

          <View style={styles.progressActive} />

          <View style={styles.progressInactive} />

        </View>

        <Text style={styles.stepText}>
          Step 1 of 2
        </Text>

        {/* Form Card */}

        <View style={styles.card}>

          <Text style={styles.cardTitle}>
            Tell us about yourself
          </Text>

          <Text style={styles.cardSubtitle}>
            Enter your basic details to get started.
          </Text>

          {/* Name */}

          <Text style={styles.label}>
            Full Name
          </Text>

          <View style={styles.inputContainer}>

            <Icon
              name="account-outline"
              size={21}
              color="#6B7280"
            />

            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor="#9CA3AF"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />

          </View>

          {/* Mobile */}

          <Text style={styles.label}>
            Mobile Number
          </Text>

          <View style={styles.inputContainer}>

            <Icon
              name="phone-outline"
              size={21}
              color="#6B7280"
            />

            <TextInput
              style={styles.input}
              placeholder="Enter 10 digit mobile number"
              placeholderTextColor="#9CA3AF"
              value={mobile}
              onChangeText={text =>
                setMobile(text.replace(/[^0-9]/g, ''))
              }
              keyboardType="phone-pad"
              maxLength={10}
            />

          </View>

          {/* Email */}

          <Text style={styles.label}>
            Email Address
            <Text style={styles.optional}>
              {' '} (Optional)
            </Text>
          </Text>

          <View style={styles.inputContainer}>

            <Icon
              name="email-outline"
              size={21}
              color="#6B7280"
            />

            <TextInput
              style={styles.input}
              placeholder="Enter your email address"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

          </View>

        <Text style={styles.label}> Password </Text>

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

          {/* Continue */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.continueButton}
            onPress={handleContinue}>

            <Text style={styles.continueText}>
              Continue
            </Text>

            <Icon
              name="arrow-right"
              size={22}
              color="#FFFFFF"
            />

          </TouchableOpacity>

          {/* Already Account */}

          <View style={styles.loginContainer}>

            <Text style={styles.loginLabel}>
              Already have an account?
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
   

        {/* Security Note */}

        <View style={styles.securityBox}>

          <Icon
            name="shield-check-outline"
            size={20}
            color="#1F6FEB"
          />

          <Text style={styles.securityText}>
            Your information is safe and secure with
            Savariya Property.
          </Text>

        </View>
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

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 35,
  },

  /* Role Header */

  roleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  roleIcon: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: '#1F6FEB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,

    elevation: 4,
    shadowColor: '#1F6FEB',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.22,
    shadowRadius: 6,
  },

  roleHeaderContent: {
    flex: 1,
  },

  registerLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1F6FEB',
    letterSpacing: 1,
    marginBottom: 3,
  },

  roleTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },

  description: {
    fontSize: 13.5,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 15,
  },

  /* Progress */

  progressContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 5,
    marginBottom: 7,
  },

  progressActive: {
    flex: 1,
    backgroundColor: '#1F6FEB',
    borderRadius: 5,
    marginRight: 4,
  },

  progressInactive: {
    flex: 1,
    backgroundColor: '#DCE4EF',
    borderRadius: 5,
    marginLeft: 4,
  },

  stepText: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 18,
  },

  /* Card */

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
    fontSize: 19,
    fontWeight: '800',
    color: '#111827',
  },

  cardSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 5,
    marginBottom: 22,
  },

  /* Form */

  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },

  optional: {
    fontSize: 11,
    fontWeight: '500',
    color: '#9CA3AF',
  },

  inputContainer: {
    height: 54,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#F8FAFC',

    borderWidth: 1,
    borderColor: '#E5E7EB',

    borderRadius: 12,

    paddingHorizontal: 14,

    marginBottom: 17,
  },

  input: {
    flex: 1,

    height: '100%',

    fontSize: 15,

    color: '#111827',

    marginLeft: 10,
  },

  /* Continue */

  continueButton: {
    height: 54,

    borderRadius: 13,

    backgroundColor: '#1F6FEB',

    marginTop: 7,

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

  continueText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },

  /* Login */

  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    marginTop: 20,
  },

  loginLabel: {
    fontSize: 13,
    color: '#6B7280',
  },

  loginLink: {
    fontSize: 13,
    color: '#1F6FEB',
    fontWeight: '700',
    marginLeft: 5,
  },

  /* Security */

  securityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

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

export default RoleBasedRegistrationScreen;

