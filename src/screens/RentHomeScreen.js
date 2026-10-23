import React, {useCallback, useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';

import RentHeader from '../components/RentHeader';
import Footer from '../components/Footer';
import LoginPopup from '../screens/LoginPopup';
import RentalListScreen from '../screens/RentalListScreen';

function RentHomeScreen({navigation}) {
  // =========================================================
  // STATES
  // =========================================================

  const [showPopup, setShowPopup] = useState(false);

  const [showTopFilters, setShowTopFilters] = useState(true);

  const [selectedProperty, setSelectedProperty] =
    useState('Apartment');

  const [loggedInUser, setLoggedInUser] = useState(null);

  // =========================================================
  // CHECK LOGIN USER
  // =========================================================

  const checkUserLogin = useCallback(async () => {
    try {
      const [
        loginStatus,
        id,
        name,
        mobile,
        email,
        role,
      ] = await AsyncStorage.multiGet([
        'userLogin',
        'userId',
        'userName',
        'userMobile',
        'userEmail',
        'userRole',
      ]);

      const loginValue = loginStatus[1];

      const userId = id[1];
      const userName = name[1];
      const userMobile = mobile[1];
      const userEmail = email[1];

      const storedRole = role[1];

      console.log('====================================');
      console.log('RENT HOME LOGIN STATUS:', loginValue);
      console.log('RENT HOME USER ID:', userId);
      console.log('RENT HOME NAME:', userName);
      console.log('RENT HOME MOBILE:', userMobile);
      console.log('RENT HOME EMAIL:', userEmail);
      console.log('RENT HOME ROLE:', storedRole);
      console.log('====================================');

      if (loginValue === 'true') {
        const finalRole =
          storedRole && storedRole.trim() !== ''
            ? storedRole
            : 'PROPERTY_SEEKER';

        const user = {
          id: userId || '',
          name: userName || '',
          mobile: userMobile || '',
          email: userEmail || '',
          role: finalRole,
        };

        setLoggedInUser(user);
        setShowPopup(false);

        console.log('FINAL LOGGED IN USER:', user);
      } else {
        setLoggedInUser(null);
      }
    } catch (error) {
      console.log('RENT HOME LOGIN CHECK ERROR:', error);
      setLoggedInUser(null);
    }
  }, []);

  // =========================================================
  // REFRESH USER WHEN SCREEN COMES INTO FOCUS
  // =========================================================

  useFocusEffect(
    useCallback(() => {
      checkUserLogin();
    }, [checkUserLogin]),
  );

  // =========================================================
  // LOGIN CHECK BEFORE ACTION
  // =========================================================

  const checkLoginAndProceed = async callback => {
    try {
      const loginStatus = await AsyncStorage.getItem('userLogin');

      console.log('POST PROPERTY LOGIN STATUS:', loginStatus);

      if (loginStatus === 'true') {
        setShowPopup(false);

        if (typeof callback === 'function') {
          callback();
        }
      } else {
        setShowPopup(true);
      }
    } catch (error) {
      console.log('CHECK LOGIN ERROR:', error);
      setShowPopup(true);
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <SafeAreaView style={styles.container} edges={['top']}>

      {/* =====================================================
          HEADER
      ====================================================== */}

      <RentHeader
        loggedInUser={loggedInUser}
      />

      {/* =====================================================
          RENTAL LIST
      ====================================================== */}

      <RentalListScreen
        navigation={navigation}
        selectedProperty={selectedProperty}
        setShowTopFilters={setShowTopFilters}
      />

      {/* =====================================================
          FLOATING POST PROPERTY BUTTON
      ====================================================== */}

      <TouchableOpacity
        style={styles.floatingAddProperty}
        activeOpacity={0.8}
        onPress={() =>
          checkLoginAndProceed(() => {
            navigation.navigate('AddPropertyScreen');
          })
        }>

        <Text style={styles.floatingText}>
          Post Property{' '}
          <Text style={styles.freeText}>FREE</Text>
        </Text>

      </TouchableOpacity>

      {/* =====================================================
          LOGIN POPUP
      ====================================================== */}

      <LoginPopup
        visible={showPopup}

        onClose={() => {
          setShowPopup(false);
        }}

        onGuest={() => {
          setShowPopup(false);
        }}

        onLogin={() => {
          setShowPopup(false);
          navigation.navigate('Login');
        }}

        onRegister={() => {
          setShowPopup(false);
          navigation.navigate('Register');
        }}

        onForgotPassword={() => {
          setShowPopup(false);
          navigation.navigate('Forgot');
        }}
      />

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <Footer />

    </SafeAreaView>
  );
}

export default RentHomeScreen;

// ===========================================================
// STYLES
// ===========================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#012353',
  },

  // =========================================================
  // POST PROPERTY FLOATING BUTTON
  // =========================================================

  floatingAddProperty: {
    position: 'absolute',
    right: 0,
    top: '50%',
    marginTop: -70,

    width: 46,
    height: 140,

    backgroundColor: '#012353',

    justifyContent: 'center',
    alignItems: 'center',

    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,

    elevation: 12,

    zIndex: 99999,

    shadowColor: '#783d06',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.35,
    shadowRadius: 5,
  },

  floatingText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',

    transform: [
      {
        rotate: '-90deg',
      },
    ],

    width: 160,
    textAlign: 'center',
  },

  freeText: {
    color: '#00FF66',
    fontWeight: 'bold',
    fontSize: 16,
    fontStyle: 'italic',
    fontFamily: 'Algerian',
  },
});