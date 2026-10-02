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
  // ROLE DISPLAY
  // ========================================

  const displayRole =
    userRole === 'PROPERTY_SEEKER' || userRole === 'USER'
      ? 'SEEKER'
      : userRole || 'SEEKER';

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
        hidden={false}
      />

      {/* ========================================
          TOP STATUS BAR STRIP
      ======================================== */}

      <View style={styles.statusBarStrip} />

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
          activeOpacity={0.7}>
          <Icon
            name="bars"
            size={24}
            color="#333"
          />
        </TouchableOpacity>

        {/* ========================================
            CLICK AANGAN LOGO
        ======================================== */}

        <View style={styles.logoSection}>
          <Image
            source={{
              uri: 'https://clickaangan.in/assets/img/logo/logo.png',
            }}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* ========================================
            USER
            NO LOGIN BUTTON
            NO LOGOUT BUTTON
        ======================================== */}

        {isLoggedIn && (
          <View style={styles.userSection}>

            {/* ====================================
                FIRST LINE
                USER + MOBILE + ROLE
            ==================================== */}

            <View style={styles.userRow}>

              {/* USER ICON */}

              <Icon
                name="user"
                size={12}
                color="#012353"
              />

              {/* MOBILE */}

              <Text
                style={styles.userMobile}
                numberOfLines={1}>
                {userMobile}
              </Text>

              {/* ROLE */}

              {displayRole !== '' && (
                <Text style={styles.userRole}>
                  ({displayRole})
                </Text>
              )}

            </View>
          </View>
        )}
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
  // TOP STATUS BAR STRIP
  // ========================================

  statusBarStrip: {
    height: StatusBar.currentHeight || 24,
    backgroundColor: '#012353',
  },

  // ========================================
  // HEADER
  // ========================================

  header: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    height: 64,
    paddingHorizontal: 3,
    elevation: 4,
    zIndex: 100,
  },

  // ========================================
  // MENU BUTTON
  // ========================================

  menuButton: {
    width: 34,
    paddingHorizontal: 0,
    marginRight: 0,
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
    marginLeft: -15,
  },

  // ========================================
  // LOGO
  // ========================================

  logo: {
    width: 220,
    height: 60,
    marginLeft: -10,
    resizeMode: 'contain',
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

    // Status bar + header ke hisaab se
    top: (StatusBar.currentHeight || 24) + 4,

    left: 10,

    backgroundColor: '#fff',
    borderRadius: 10,

    elevation: 10,
    zIndex: 9999,
  },
});