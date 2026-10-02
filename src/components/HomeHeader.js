import React, {useState, useEffect, useCallback, useRef} from 'react';

import {
  StatusBar,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Menu from '../components/Menu';
import Icon from 'react-native-vector-icons/FontAwesome5';

const HomeHeader = ({onLoginPress, loggedInUser, onLogout}) => {
  // ======================================================
  // STATES
  // ======================================================

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userMobile, setUserMobile] = useState('');
  const [userRole, setUserRole] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  // LOGOUT CONFIRMATION
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // ======================================================
  // PREVENT OLD loggedInUser FROM LOGGING IN AGAIN
  // AFTER LOGOUT
  // ======================================================

  const justLoggedOutRef = useRef(false);

  // ======================================================
  // DISPLAY ROLE
  // ======================================================

  const displayRole =
    userRole === 'PROPERTY_SEEKER' || 'USER'
      ? 'SEEKER'
      : userRole || 'SEEKER';

  // ======================================================
  // CHECK LOGIN FROM ASYNC STORAGE
  // ======================================================

  const checkLogin = async () => {
    try {
      const loginStatus =
        await AsyncStorage.getItem('userLogin');

      const mobile =
        await AsyncStorage.getItem('userMobile');

      const role =
        await AsyncStorage.getItem('userRole');

      console.log(
        '====================================',
      );

      console.log(
        'HOME HEADER LOGIN STATUS:',
        loginStatus,
      );

      console.log(
        'HOME HEADER MOBILE:',
        mobile,
      );

      console.log(
        'HOME HEADER ROLE:',
        role,
      );

      console.log(
        '====================================',
      );

      if (loginStatus === 'true') {
        setIsLoggedIn(true);
        setUserMobile(mobile || '');
        setUserRole(role || 'USER');
      } else {
        setIsLoggedIn(false);
        setUserMobile('');
        setUserRole('');
      }
    } catch (err) {
      console.log(
        'HOME HEADER LOGIN CHECK ERROR:',
        err,
      );
    }
  };

  // ======================================================
  // LOGIN USER DIRECTLY FROM HOMESCREEN
  // ======================================================

useEffect(() => {
  if (loggedInUser) {
    console.log('HOME HEADER NEW USER RECEIVED:', loggedInUser);

    // New login ke baad logout flag reset
    justLoggedOutRef.current = false;

    setIsLoggedIn(true);

    setUserMobile(
      loggedInUser.mobile ||
        loggedInUser.Mobile ||
        '',
    );

    setUserRole(
      loggedInUser.role ||
        loggedInUser.Role ||
        loggedInUser.roleType ||
        loggedInUser.RoleType ||
        'SEEKER',
    );

    return;
  }

  // Agar user logout ke baad loggedInUser null hua hai
  if (justLoggedOutRef.current) {
    console.log(
      'HOME HEADER: USER LOGGED OUT',
    );

    setIsLoggedIn(false);
    setUserMobile('');
    setUserRole('');

    return;
  }

  checkLogin();
}, [loggedInUser]);

  // ======================================================
  // CHECK LOGIN WHEN HOME SCREEN FOCUSES
  // ======================================================

  useFocusEffect(
    useCallback(() => {
      checkLogin();
    }, []),
  );

  // ======================================================
  // LOGOUT BUTTON
  // ======================================================

  const handleLogout = () => {
    console.log(
      '====================================',
    );

    console.log(
      'LOGOUT BUTTON CLICKED',
    );

    console.log(
      '====================================',
    );

    setShowLogoutConfirm(true);
  };

  // ======================================================
  // ACTUAL LOGOUT
  // ======================================================

  const performLogout = async () => {
    console.log(
      '====================================',
    );

    console.log(
      'YES BUTTON CLICKED',
    );

    console.log(
      'LOGOUT START',
    );

    console.log(
      '====================================',
    );

    try {
      // --------------------------------------------------
      // MARK LOGOUT FIRST
      // --------------------------------------------------

      justLoggedOutRef.current = true;

      // --------------------------------------------------
      // CLEAR STORAGE
      // --------------------------------------------------

      await AsyncStorage.multiRemove([
        'userLogin',
        'userMobile',
        'userRole',
        'userToken',
        'userId',
        'userEmail',
        'userName',
        'loginStatus',
      ]);

      console.log(
        'LOGOUT: ASYNC STORAGE CLEARED',
      );

      // --------------------------------------------------
      // UPDATE LOCAL HEADER
      // --------------------------------------------------

      setShowLogoutConfirm(false);

      setIsLoggedIn(false);

      setUserMobile('');

      setUserRole('');

      setShowMenu(false);

      console.log(
        'LOGOUT: HEADER STATE CLEARED',
      );

      // --------------------------------------------------
      // CALL PARENT CALLBACK
      // --------------------------------------------------

      if (typeof onLogout === 'function') {
        console.log(
          'LOGOUT: onLogout FUNCTION FOUND',
        );

        try {
          onLogout();

          console.log(
            'LOGOUT: onLogout EXECUTED SUCCESSFULLY',
          );
        } catch (callbackError) {
          console.log(
            '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
          );

          console.log(
            'PARENT onLogout ERROR:',
            callbackError,
          );

          console.log(
            'PARENT onLogout ERROR MESSAGE:',
            callbackError?.message,
          );

          console.log(
            '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
          );
        }
      } else {
        console.log(
          'LOGOUT: onLogout IS NOT A FUNCTION',
        );

        console.log(
          'LOGOUT: onLogout VALUE:',
          onLogout,
        );
      }

      console.log(
        '====================================',
      );

      console.log(
        'LOGOUT COMPLETE',
      );

      console.log(
        '====================================',
      );
    } catch (logoutError) {
      console.log(
        '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
      );

      console.log(
        'LOGOUT MAIN ERROR:',
        logoutError,
      );

      console.log(
        'LOGOUT MAIN ERROR MESSAGE:',
        logoutError?.message,
      );

      console.log(
        '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
      );

      setShowLogoutConfirm(false);

      setIsLoggedIn(false);

      setUserMobile('');

      setUserRole('');
    }
  };

  // ======================================================
  // CANCEL LOGOUT
  // ======================================================

  const cancelLogout = () => {
    console.log(
      'LOGOUT CANCELLED',
    );

    setShowLogoutConfirm(false);
  };

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <>
      {/* ==================================================
          STATUS BAR
      ================================================== */}

      <StatusBar
        backgroundColor="#0A3D62"
        barStyle="light-content"
      />

      {/* ==================================================
          MENU
      ================================================== */}

      {showMenu && (
        <View style={styles.menuWrapper}>
          <Menu />
        </View>
      )}

      {/* ==================================================
          HEADER
      ================================================== */}

      <View style={styles.header}>
        {/* ==================================================
            MENU BUTTON
        ================================================== */}

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() =>
            setShowMenu(!showMenu)
          }
          activeOpacity={0.7}>
          <Icon
            name="bars"
            size={24}
            color="#333"
          />
        </TouchableOpacity>

        {/* ==================================================
            LOGO
        ================================================== */}

        <View style={styles.logoSection}>
          <Image
            source={{
              uri:
                'https://clickaangan.in/assets/img/logo/logo.png',
            }}
            style={styles.logo}
            resizeMode="contain"
          />

          <View style={styles.divider} />
        </View>

        {/* ==================================================
            USER SECTION
        ================================================== */}

        {isLoggedIn ? (
          <View style={styles.userSection}>
            {/* ==============================================
                USER ROW
            =============================================== */}

            <View style={styles.userRow}>
              <Icon
                name="user"
                size={12}
                color="#012353"
              />

              <Text
                style={styles.userMobile}
                numberOfLines={1}>
                {userMobile}
              </Text>

              <Text
                style={styles.userRole}
                numberOfLines={1}>
                ({displayRole})
              </Text>
            </View>

            {/* ==============================================
                LOGOUT
            =============================================== */}

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
          /* ==================================================
             LOGIN BUTTON
          ================================================== */

          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => {
              console.log(
                'LOGIN BUTTON CLICKED',
              );

              if (
                typeof onLoginPress ===
                'function'
              ) {
                onLoginPress();
              } else {
                console.log(
                  'onLoginPress is not a function:',
                  onLoginPress,
                );
              }
            }}
            activeOpacity={0.8}>
            <Text style={styles.btnText}>
              Login
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ==================================================
          LOGOUT CONFIRMATION
      ================================================== */}

      {showLogoutConfirm && (
        <View style={styles.logoutOverlay}>
          <View style={styles.logoutDialog}>
            {/* ==================================================
                ICON
            ================================================== */}

            <View style={styles.logoutIcon}>
              <Icon
                name="sign-out-alt"
                size={22}
                color="#F58220"
              />
            </View>

            {/* ==================================================
                TITLE
            ================================================== */}

            <Text style={styles.logoutTitle}>
              Logout Confirmation
            </Text>

            {/* ==================================================
                MESSAGE
            ================================================== */}

            <Text style={styles.logoutMessage}>
              Are you sure you want to logout?
            </Text>

            {/* ==================================================
                BUTTONS
            ================================================== */}

            <View style={styles.logoutActions}>
              {/* NO */}

              <TouchableOpacity
                style={styles.cancelLogoutBtn}
                activeOpacity={0.8}
                onPress={cancelLogout}>
                <Text
                  style={
                    styles.cancelLogoutText
                  }>
                  No
                </Text>
              </TouchableOpacity>

              {/* YES */}

              <TouchableOpacity
                style={styles.confirmLogoutBtn}
                activeOpacity={0.8}
                onPress={performLogout}>
                <Text
                  style={
                    styles.confirmLogoutText
                  }>
                  Yes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </>
  );
};

export default HomeHeader;

// ======================================================
// STYLES
// ======================================================

const styles = StyleSheet.create({
  // ====================================================
  // HEADER
  // ====================================================

header: {
  backgroundColor: '#fff',
  flexDirection: 'row',
  alignItems: 'center',
  height: 64,
  paddingHorizontal: 3,
  elevation: 4,
  zIndex: 100,
},

menuButton: {
  width: 34,
  paddingHorizontal: 0,
  marginRight: 0,
  justifyContent: 'center',
  alignItems: 'center',
},

logoSection: {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  marginLeft: -15,
},

  divider: {
    width: 0,
    height: 28,
    backgroundColor: '#ddd',
    marginHorizontal: 10,
  },

logo: {
  width: 220,
  height: 60,
  marginLeft: -10,
  resizeMode: 'contain',
},

  // ====================================================
  // USER SECTION
  // ====================================================

  userSection: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 6,
  },

  // ====================================================
  // USER ROW
  // ====================================================

  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 18,
    maxWidth: 150,
  },

  // ====================================================
  // MOBILE
  // ====================================================

  userMobile: {
    color: '#012353',
    fontSize: 12,
    marginLeft: 5,
    fontWeight: '700',
    maxWidth: 82,
  },

  // ====================================================
  // ROLE
  // ====================================================

  userRole: {
    color: '#777',
    fontSize: 9,
    marginLeft: 4,
    fontWeight: '600',
    textTransform: 'uppercase',
    maxWidth: 55,
  },

  // ====================================================
  // LOGOUT BUTTON
  // ====================================================

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

  // ====================================================
  // LOGIN BUTTON
  // ====================================================

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

  // ====================================================
  // MENU WRAPPER
  // ====================================================

  menuWrapper: {
    position: 'absolute',
    top: 60,
    left: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 10,
    zIndex: 9999,
  },

  // ====================================================
  // LOGOUT OVERLAY
  // ====================================================

  logoutOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    backgroundColor: 'rgba(0,0,0,0.35)',

    justifyContent: 'flex-start',
    alignItems: 'center',

    zIndex: 999999,
    elevation: 999999,
  },

  // ====================================================
  // LOGOUT DIALOG
  // ====================================================

  logoutDialog: {
    width: '88%',
    backgroundColor: '#FFFFFF',

    borderRadius: 16,

    marginTop: 85,

    padding: 20,

    elevation: 20,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 6,
    },

    shadowOpacity: 0.25,

    shadowRadius: 12,
  },

  // ====================================================
  // LOGOUT ICON
  // ====================================================

  logoutIcon: {
    width: 48,
    height: 48,

    borderRadius: 24,

    backgroundColor: '#FFF3E8',

    alignItems: 'center',
    justifyContent: 'center',

    alignSelf: 'center',

    marginBottom: 12,
  },

  // ====================================================
  // LOGOUT TITLE
  // ====================================================

  logoutTitle: {
    fontSize: 18,
    fontWeight: '700',

    color: '#012353',

    textAlign: 'center',

    marginBottom: 7,
  },

  // ====================================================
  // LOGOUT MESSAGE
  // ====================================================

  logoutMessage: {
    fontSize: 14,

    color: '#6B7280',

    textAlign: 'center',

    lineHeight: 21,

    marginBottom: 20,
  },

  // ====================================================
  // LOGOUT ACTIONS
  // ====================================================

  logoutActions: {
    flexDirection: 'row',

    justifyContent: 'flex-end',

    alignItems: 'center',
  },

  // ====================================================
  // NO BUTTON
  // ====================================================

  cancelLogoutBtn: {
    minWidth: 75,

    paddingVertical: 9,
    paddingHorizontal: 18,

    borderRadius: 7,

    borderWidth: 1,
    borderColor: '#D1D5DB',

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 10,
  },

  cancelLogoutText: {
    color: '#6B7280',

    fontSize: 13,

    fontWeight: '700',
  },

  // ====================================================
  // YES BUTTON
  // ====================================================

  confirmLogoutBtn: {
    minWidth: 75,

    paddingVertical: 9,
    paddingHorizontal: 18,

    borderRadius: 7,

    backgroundColor: '#012353',

    alignItems: 'center',
    justifyContent: 'center',
  },

  confirmLogoutText: {
    color: '#FFFFFF',

    fontSize: 13,

    fontWeight: '700',
  },
});