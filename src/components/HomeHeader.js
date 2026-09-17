import React, {useState, useEffect, useCallback} from 'react';

import {
  StatusBar,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';

import {useFocusEffect} from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import Menu from '../components/Menu';

import Icon from 'react-native-vector-icons/FontAwesome5';

const HomeHeader = ({onLoginPress, loggedInUser, onLogout}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userMobile, setUserMobile] = useState('');
  const [userRole, setUserRole] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  const displayRole =
  userRole === 'PROPERTY_SEEKER'
    ? 'SEEKER'
    : userRole;

  // ========================================
  // CHECK LOGIN FROM ASYNC STORAGE
  // ========================================

  const checkLogin = async () => {
    try {
      const loginStatus = await AsyncStorage.getItem('userLogin');
      const mobile = await AsyncStorage.getItem('userMobile');
      const role = await AsyncStorage.getItem('userRole');

      console.log('HOME HEADER LOGIN STATUS:', loginStatus);
      console.log('HOME HEADER MOBILE:', mobile);
      console.log('HOME HEADER ROLE:', role);

      if (loginStatus === 'true') {
        setIsLoggedIn(true);
        setUserMobile(mobile || '');
        setUserRole(role || 'USER');
      } else {
        setIsLoggedIn(false);
        setUserMobile('');
        setUserRole('');
      }
    } catch (error) {
      console.log('Login Check Error:', error);
    }
  };

  // ========================================
  // LOGIN USER DIRECTLY FROM HOMESCREEN
  // ========================================

  useEffect(() => {
    if (loggedInUser) {
      console.log('HOME HEADER USER RECEIVED:', loggedInUser);

      setIsLoggedIn(true);

      setUserMobile(
        loggedInUser.mobile ||
          loggedInUser.Mobile ||
          '',
      );

      setUserRole(
        loggedInUser.role ||
          loggedInUser.Role ||
          'USER',
      );
    } else {
      checkLogin();
    }
  }, [loggedInUser]);

  // ========================================
  // CHECK LOGIN WHEN HOME SCREEN FOCUSES
  // ========================================

  useFocusEffect(
    useCallback(() => {
      checkLogin();
    }, []),
  );

  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = () => {
    Alert.alert(
      'Logout Confirmation',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },

        {
          text: 'Logout',
          style: 'destructive',

          onPress: async () => {
            try {
              // ========================================
              // REMOVE LOGIN / SESSION DATA
              // ========================================

              await AsyncStorage.removeItem('userLogin');
              await AsyncStorage.removeItem('userMobile');
              await AsyncStorage.removeItem('userRole');
              await AsyncStorage.removeItem('userToken');
              await AsyncStorage.removeItem('userId');
              await AsyncStorage.removeItem('userEmail');
              await AsyncStorage.removeItem('userName');
              await AsyncStorage.removeItem('loginStatus');

              // ========================================
              // IMMEDIATELY UPDATE HEADER
              // ========================================

              setIsLoggedIn(false);
              setUserMobile('');
              setUserRole('');
              setShowMenu(false);

              // ========================================
              // INFORM HOMESCREEN
              // ========================================

              if (onLogout) {
                onLogout();
              }

              console.log('LOGOUT SUCCESS');
            } catch (error) {
              console.log('Logout Error:', error);

              Alert.alert(
                'Logout Error',
                String(error?.message || error),
              );
            }
          },
        },
      ],
      {
        cancelable: true,
      },
    );
  };

  return (
    <>
      {/* ========================================
          STATUS BAR
      ======================================== */}

      <StatusBar
        backgroundColor="#0A3D62"
        barStyle="light-content"
      />

      {/* ========================================
          MENU
      ======================================== */}

      {showMenu && (
        <View style={styles.menuWrapper}>
          <Menu />
        </View>
      )}

      {/* ========================================
          HEADER
      ======================================== */}

      <View style={styles.header}>

        {/* ========================================
            MENU BUTTON
        ======================================== */}

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setShowMenu(!showMenu)}>

          <Icon
            name="bars"
            size={24}
            color="#333"
          />

        </TouchableOpacity>

        {/* ========================================
            LOGO
        ======================================== */}

        <View style={styles.logoSection}>

          <Image
            source={{
              uri: 'https://savariyaproperty.in/assets/img/logo/logo.png',
            }}
            style={styles.logo}
            resizeMode="contain"
          />

          <View style={styles.divider} />

        </View>

        {/* ========================================
            USER SECTION
        ======================================== */}

        {isLoggedIn ? (

          <View style={styles.userSection}>

            {/* ====================================
                FIRST LINE - MOBILE + ROLE
            ==================================== */}

            <View style={styles.userRow}>

              {/* USER ICON */}

              <Icon
                name="user"
                size={12}
                color="#012353"
              />

              {/* MOBILE */}

              <Text style={styles.userMobile}>
                {userMobile}
              </Text>

              {/* ROLE */}

              <Text style={styles.userRole}>
                ({displayRole  || 'USER'})
              </Text>

            </View>

            {/* ====================================
                SECOND LINE - LOGOUT
            ==================================== */}

            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={handleLogout}
              activeOpacity={0.7}>

              <Icon
                name="sign-out-alt"
                size={11}
                color="#fff"
              />

              <Text style={styles.logoutText}>
                Logout
              </Text>

            </TouchableOpacity>

          </View>

        ) : (

          /* ======================================
              LOGIN BUTTON
          ====================================== */

          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => {
              if (onLoginPress) {
                onLoginPress();
              }
            }}
            activeOpacity={0.8}>

            <Text style={styles.btnText}>
              Login
            </Text>

          </TouchableOpacity>

        )}

      </View>
    </>
  );
};

export default HomeHeader;

// ========================================
// STYLES
// ========================================

const styles = StyleSheet.create({

  // ========================================
  // HEADER
  // ========================================

  header: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 5,
    elevation: 4,
  },

  // ========================================
  // MENU BUTTON
  // ========================================

  menuButton: {
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ========================================
  // LOGO SECTION
  // ========================================

  logoSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  divider: {
    width: 1,
    height: 28,
    backgroundColor: '#ddd',
    marginHorizontal: 10,
  },

  logo: {
    width: 180,
    height: 45,
  },

  // ========================================
  // USER SECTION
  // ========================================

  userSection: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 6,
  },

  // ========================================
  // FIRST LINE
  // ========================================

  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 18,
  },

  // ========================================
  // MOBILE
  // ========================================

  userMobile: {
    color: '#012353',
    fontSize: 12,
    marginLeft: 5,
    fontWeight: '700',
  },

  // ========================================
  // ROLE ICON
  // ========================================

  roleIcon: {
    marginLeft: 8,
  },

  // ========================================
  // ROLE
  // ========================================

  userRole: {
    color: '#777',
    fontSize: 9,
    marginLeft: 4,
    fontWeight: '600',
    textTransform: 'uppercase',
  },

  // ========================================
  // LOGOUT BUTTON
  // ========================================

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: '#d9534f',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    marginTop: 2,
  },

  logoutText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 4,
  },

  // ========================================
  // LOGIN BUTTON
  // ========================================

  loginBtn: {
    backgroundColor: '#012353',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 6,
    marginRight: 8,
  },

  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },

  // ========================================
  // MENU WRAPPER
  // ========================================

  menuWrapper: {
    position: 'absolute',
    top: 60,
    left: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 10,
    zIndex: 9999,
  },

});