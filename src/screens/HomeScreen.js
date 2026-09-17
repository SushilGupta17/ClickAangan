import {
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';

import React, {useState, useEffect} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeHeader from '../components/HomeHeader';
import Footer from '../components/Footer';
import PropertyListScreen from '../screens/PropertyListScreen';
import {SafeAreaView} from 'react-native-safe-area-context';
import LoginPopup from '../screens/LoginPopup';
import RentalListScreen from '../screens/RentalListScreen';

function HomeScreen({navigation}) {
  const [showPopup, setShowPopup] = useState(false);

  const [showTopFilters, setShowTopFilters] = useState(true);

  const [lastOffset, setLastOffset] = useState(0);

  const [selectedType, setSelectedType] = useState('Villa');

  const [selectedProperty, setSelectedProperty] = useState('Villa');

  // =========================================================
  // LOGIN USER STATE
  // =========================================================
  const [loggedInUser, setLoggedInUser] = useState(null);

  // =========================================================
  // CHECK LOGIN ON HOME SCREEN LOAD
  // =========================================================
  useEffect(() => {
    checkUserLogin();
  }, []);

  const checkUserLogin = async () => {
    try {
      const loginStatus = await AsyncStorage.getItem('userLogin');

      const id = await AsyncStorage.getItem('userId');
      const name = await AsyncStorage.getItem('userName');
      const mobile = await AsyncStorage.getItem('userMobile');
      const email = await AsyncStorage.getItem('userEmail');
      const role = await AsyncStorage.getItem('userRole');

      console.log('HOME SCREEN LOGIN STATUS:', loginStatus);
      console.log('HOME SCREEN MOBILE:', mobile);
      console.log('HOME SCREEN ROLE:', role);

      if (loginStatus === 'true') {
        // User already logged in
        setLoggedInUser({
          id: id || '',
          name: name || '',
          mobile: mobile || '',
          email: email || '',
          role: role || 'PROPERTY_SEEKER',
        });

        setShowPopup(false);
      } else {
        // User not logged in
        setLoggedInUser(null);
        setShowPopup(true);
      }
    } catch (error) {
      console.log('HOME LOGIN CHECK ERROR:', error);
    }
  };

  // =========================================================
  // LOGIN REQUIRED ACTION
  // =========================================================
  const checkLoginAndProceed = async callback => {
    try {
      const loginStatus = await AsyncStorage.getItem('userLogin');

      if (loginStatus === 'true') {
        setShowPopup(false);
        callback();
      } else {
        setShowPopup(true);
      }
    } catch (e) {
      console.log('CHECK LOGIN ERROR:', e);
    }
  };

  // =========================================================
  // LOGOUT
  // =========================================================
  const handleLogout = () => {
    console.log('HOME SCREEN LOGOUT');

    setLoggedInUser(null);
    setShowPopup(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>

      {/* =====================================================
          HEADER
      ====================================================== */}
      <HomeHeader
        loggedInUser={loggedInUser}

        onLoginPress={() => {
          console.log('HEADER LOGIN CLICK');

          setShowPopup(true);
        }}

        onLogout={() => {
          handleLogout();
        }}
      />

      {/* =====================================================
          PROPERTY LIST
      ====================================================== */}
      <PropertyListScreen
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
          AI SEARCH - CURRENTLY DISABLED
      ====================================================== */}

      {/*
      <TouchableOpacity
        style={styles.floatingAiSearch}
        activeOpacity={0.8}
        onPress={() =>
          checkLoginAndProceed(() => {
            navigation.navigate('AiSearchScreen');
          })
        }>

        <Text style={styles.floatingAiText}>
          AI Search
        </Text>

      </TouchableOpacity>
      */}

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

        // IMPORTANT:
        // LoginPopup se user object receive hoga
        onLogin={user => {
          console.log('HOME SCREEN LOGIN USER:', user);

          // Normalize user data
          const normalizedUser = {
            id: user?.id ?? user?.Id ?? '',
            name: user?.name ?? user?.Name ?? '',
            mobile: user?.mobile ?? user?.Mobile ?? '',
            email: user?.email ?? user?.Email ?? '',
            role:
              user?.role ??
              user?.Role ??
              'PROPERTY_SEEKER',
          };

          console.log(
            'HOME SCREEN NORMALIZED USER:',
            normalizedUser,
          );

          // Header ko immediately login state milegi
          setLoggedInUser(normalizedUser);

          // Popup close
          setShowPopup(false);
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
      <Footer
  onLoginRequired={() => {
    console.log('FOOTER LOGIN REQUIRED');
    setShowPopup(true);
  }}
/>


    </SafeAreaView>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#012353',
    color: '#ffff',
  },

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
    transform: [{rotate: '-90deg'}],
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

  floatingAiSearch: {
    position: 'absolute',
    left: 0,
    top: '50%',
    marginTop: -70,
    width: 46,
    height: 140,
    backgroundColor: '#012353',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
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

  floatingAiText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    width: 160,
    textAlign: 'center',
    transform: [{rotate: '90deg'}],
  },
});
