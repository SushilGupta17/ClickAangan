import React, {useState, useCallback} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';

import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Menu from '../components/Menu';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userMobile, setUserMobile] = useState('');
  const [userRole, setUserRole] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  // ========================================
  // CHECK LOGIN
  // ========================================

  const checkLogin = async () => {
    try {
      const loginStatus = await AsyncStorage.getItem('userLogin');
      const mobile = await AsyncStorage.getItem('userMobile');
      const role = await AsyncStorage.getItem('userRole');

      console.log('HEADER LOGIN:', {
        loginStatus,
        mobile,
        role,
      });

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
      console.log('HEADER LOGIN CHECK ERROR:', error);

      setIsLoggedIn(false);
      setUserMobile('');
      setUserRole('');
    }
  };

  // ========================================
  // SCREEN FOCUS
  // ========================================

  useFocusEffect(
    useCallback(() => {
      checkLogin();
    }, []),
  );

  // ========================================
  // SAME ROLE DISPLAY AS HOME HEADER
  // ========================================

  const displayRole =
    userRole === 'PROPERTY_SEEKER'
      ? 'SEEKER'
      : userRole || '';

  // ========================================
  // HEADER
  // ========================================

  return (
    <>
      {/* ========================================
          STATUS BAR
      ======================================== */}

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

      {/* ========================================
          MENU POPUP
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
          onPress={() => setShowMenu(!showMenu)}
          activeOpacity={0.7}
        >
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
        </View>
      </View>
    </>
  );
};

export default Header;


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

  // ========================================
  // LOGO
  // ========================================

  logo: {
    width: 145,
    height: 45,
  },

  // ========================================
  // USER SECTION
  // ========================================

  userSection: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 8,
  },

  // ========================================
  // USER ROW
  // ========================================

  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 22,
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
  // MENU POPUP
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