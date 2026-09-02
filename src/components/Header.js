import React, {useState, useEffect, useCallback} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
  Image,
} from 'react-native';

import {useNavigation, useFocusEffect} from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import Menu from '../components/Menu';

import Icon from 'react-native-vector-icons/FontAwesome5';

const Header = () => {
  const navigation = useNavigation();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userMobile, setUserMobile] = useState('');
  const [userRole, setUserRole] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  // =============================
  // CHECK LOGIN
  // =============================
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

  // =============================
  // SCREEN FOCUS
  // =============================
  useFocusEffect(
    useCallback(() => {
      checkLogin();
    }, []),
  );

  // =============================
  // INITIAL LOAD
  // =============================
  useEffect(() => {
    checkLogin();
  }, []);

  // =============================
  // LOGOUT WITH CONFIRMATION
  // =============================
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
              await AsyncStorage.multiRemove([
                'userLogin',
                'userMobile',
                'userRole',
                'userToken',
              ]);

              setIsLoggedIn(false);
              setUserMobile('');
              setUserRole('');
              setShowMenu(false);

              navigation.replace('Login');
            } catch (error) {
              console.log('Logout Error:', error);
              Alert.alert(
                'Error',
                'Unable to logout. Please try again.',
              );
            }
          },
        },
      ],
      {cancelable: true},
    );
  };

  return (
    <>
      <StatusBar
        backgroundColor="#012353"
        barStyle="light-content"
        translucent={false}
      />

      <View
        style={{
          height: StatusBar.currentHeight,
          backgroundColor: '#012353',
        }}
      />

      {/* MENU POPUP */}
      {showMenu && (
        <View style={styles.menuWrapper}>
          <Menu />
        </View>
      )}

      {/* HEADER */}
      <View style={styles.header}>

        {/* MENU BUTTON */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setShowMenu(!showMenu)}>
          <Icon name="bars" size={24} color="#333" />
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
        </View>

        {/* LOGGED IN USER */}
        {isLoggedIn ? (
          <View style={styles.userSection}>

            <View style={styles.userRow}>
              <Icon name="mobile-alt" size={12} color="#012353" />
              <Text style={styles.userMobile}>
                {userMobile}
              </Text>
            </View>

            <View style={styles.userRow}>
              <Icon name="user-tag" size={11} color="#777" />
              <Text style={styles.userRole}>
                {userRole || 'USER'}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={handleLogout}>
              <Icon
                name="sign-out-alt"
                size={11}
                color="#fff"
              />
              <Text style={styles.logoutText}>
                {' '}Logout
              </Text>
            </TouchableOpacity>

          </View>
        ) : (
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

export default Header;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 5,
    elevation: 4,
  },

  menuButton: {
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoSection: {
    flex: 1,
    justifyContent: 'center',
  },

  logo: {
    width: 145,
    height: 45,
  },

  userSection: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 8,
  },

  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },

  userMobile: {
    color: '#012353',
    fontSize: 12,
    marginLeft: 5,
    fontWeight: '700',
  },

  userRole: {
    color: '#777',
    fontSize: 10,
    marginLeft: 5,
    fontWeight: '600',
    textTransform: 'uppercase',
  },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d9534f',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    marginTop: 4,
  },

  logoutText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },

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