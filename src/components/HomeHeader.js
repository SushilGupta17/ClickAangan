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

import {useNavigation, useFocusEffect} from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import Menu from '../components/Menu';

import Icon from 'react-native-vector-icons/FontAwesome5';

const HomeHeader = () => {
  const navigation = useNavigation();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userMobile, setUserMobile] = useState('');
  const [userRole, setUserRole] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  // ==============================
  // CHECK LOGIN
  // ==============================
  const checkLogin = async () => {
    try {
      const loginStatus = await AsyncStorage.getItem('userLogin');
      const mobile = await AsyncStorage.getItem('userMobile');
      const role = await AsyncStorage.getItem('userRole');

      if (loginStatus === 'true') {
        setIsLoggedIn(true);
        setUserMobile(mobile || '');
        setUserRole(role || '');
      } else {
        setIsLoggedIn(false);
        setUserMobile('');
        setUserRole('');
      }
    } catch (error) {
      console.log('Login Check Error:', error);
    }
  };

  // ==============================
  // CHECK LOGIN WHEN SCREEN FOCUSES
  // ==============================
  useFocusEffect(
    useCallback(() => {
      checkLogin();
    }, []),
  );

  // ==============================
  // INITIAL LOGIN CHECK
  // ==============================
  useEffect(() => {
    checkLogin();
  }, []);

  // ==============================
  // LOGOUT
  // ==============================
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
              // await AsyncStorage.multiRemove([
              //   'userLogin',
              //   'userMobile',
              //   'userRole',
              //   'userToken',
              // ]);

              // setIsLoggedIn(false);
              // setUserMobile('');
              // setUserRole('');
              // setShowMenu(false);

              navigation.replace('Login');
            } catch (error) {

              Alert.alert(
                'Error',
                'Unable to logout. Please try again.',
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
      {/* ==============================
          STATUS BAR
      ============================== */}
      <StatusBar
        backgroundColor="#0A3D62"
        barStyle="light-content"
      />

      {/* ==============================
          MENU
      ============================== */}
      {showMenu && (
        <View style={styles.menuWrapper}>
          <Menu />
        </View>
      )}

      {/* ==============================
          HEADER
      ============================== */}
      <View style={styles.header}>

        {/* MENU BUTTON */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setShowMenu(!showMenu)}>
          <Icon
            name="bars"
            size={24}
            color="#333"
          />
        </TouchableOpacity>

        {/* LOGO */}
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

        {/* ==============================
            USER SECTION
        ============================== */}
        {isLoggedIn ? (
          <View style={styles.userSection}>

            {/* =================================
                FIRST LINE - MOBILE + ROLE
            ================================= */}
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
    ({userRole || 'USER'})
  </Text>

</View>

            {/* =================================
                SECOND LINE - LOGOUT
            ================================= */}
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

          /* ==============================
             LOGIN BUTTON
          ============================== */
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => navigation.navigate('Login')}>

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

  // ==============================
  // HEADER
  // ==============================
  header: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 5,
    elevation: 4,
  },

  // ==============================
  // MENU BUTTON
  // ==============================
  menuButton: {
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ==============================
  // LOGO SECTION
  // ==============================
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

  // ==============================
  // USER SECTION
  // ==============================
  userSection: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 6,
  },

  // ==============================
  // FIRST LINE
  // MOBILE + ROLE
  // ==============================
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 18,
  },

  // ==============================
  // MOBILE
  // ==============================
  userMobile: {
    color: '#012353',
    fontSize: 12,
    marginLeft: 5,
    fontWeight: '700',
  },

  // ==============================
  // ROLE ICON
  // ==============================
  roleIcon: {
    marginLeft: 8,
  },

  // ==============================
  // ROLE
  // ==============================
  userRole: {
    color: '#777',
    fontSize: 9,
    marginLeft: 4,
    fontWeight: '600',
    textTransform: 'uppercase',
  },

  // ==============================
  // SECOND LINE
  // LOGOUT BUTTON
  // ==============================
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

  // ==============================
  // LOGIN BUTTON
  // ==============================
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

  // ==============================
  // MENU WRAPPER
  // ==============================
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