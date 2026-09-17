import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {useNavigation} from '@react-navigation/native';

import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Footer = ({onLoginRequired}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // =========================================================
  // CHECK LOGIN
  // =========================================================
  const checkLoginAndProceed = async callback => {
    try {
      const loginStatus = await AsyncStorage.getItem('userLogin');

      console.log('FOOTER LOGIN STATUS:', loginStatus);

      if (loginStatus === 'true') {
        // Already logged in
        callback();
      } else {
        // Ask HomeScreen to open existing LoginPopup
        if (onLoginRequired) {
          onLoginRequired();
        }
      }
    } catch (e) {
      console.log('FOOTER LOGIN CHECK ERROR:', e);
    }
  };

  // =========================================================
  // HANDLE FOOTER PRESS
  // =========================================================
  const handlePress = tab => {
    switch (tab) {
      // -----------------------------------------------------
      // HOME
      // -----------------------------------------------------
      case 'Home':
        navigation.navigate('Home');
        break;

      // -----------------------------------------------------
      // SEARCH
      // -----------------------------------------------------
      case 'Search':
        navigation.navigate('SearchScreen');
        break;

      // -----------------------------------------------------
      // CALL
      // -----------------------------------------------------
      case 'Call':
        Linking.openURL('tel:9314630866');
        break;

      // -----------------------------------------------------
      // CONTACT
      // -----------------------------------------------------
      case 'Contact':
        navigation.navigate('ContactOwner');
        break;

      // -----------------------------------------------------
      // WISHLIST
      // -----------------------------------------------------
      case 'Wishlist':
        navigation.navigate('Wishlist');
        break;

      // -----------------------------------------------------
      // POST PROPERTY
      // -----------------------------------------------------
      case 'PostProperty':
        checkLoginAndProceed(() => {
          navigation.navigate('AddPropertyScreen');
        });
        break;

      default:
        break;
    }
  };

  return (
    <View
      style={[
        styles.footer,
        {
          paddingBottom: insets.bottom,
        },
      ]}>

      {/* =====================================================
          MAIN FOOTER ROW
      ====================================================== */}
      <View style={styles.infoRow}>

        {/* ===================================================
            HOME
        ==================================================== */}
        <TouchableOpacity
          style={styles.item}
          onPress={() => handlePress('Home')}
          activeOpacity={0.7}>

          <Icon
            name="home-outline"
            size={21}
            color="#012353"
          />

          <Text style={styles.text}>
            Home
          </Text>
        </TouchableOpacity>

        {/* ===================================================
            SEARCH
        ==================================================== */}
        <TouchableOpacity
          style={styles.item}
          onPress={() => handlePress('Search')}
          activeOpacity={0.7}>

          <Icon
            name="magnify"
            size={22}
            color="#012353"
          />

          <Text style={styles.text}>
            Search
          </Text>
        </TouchableOpacity>

        {/* ===================================================
            POST PROPERTY
        ==================================================== */}
        <TouchableOpacity
          style={styles.postPropertyButton}
          onPress={() => handlePress('PostProperty')}
          activeOpacity={0.85}>

          <View style={styles.postIconCircle}>

            <Icon
              name="plus"
              size={18}
              color="#F58220"
            />

          </View>

          <Text style={styles.postPropertyText}>
            Post Property
          </Text>

        </TouchableOpacity>

        {/* ===================================================
            CONTACT
        ==================================================== */}
        <TouchableOpacity
          style={styles.item}
          onPress={() => handlePress('Contact')}
          activeOpacity={0.7}>

          <Icon
            name="account-outline"
            size={22}
            color="#012353"
          />

          <Text style={styles.text}>
            Contact
          </Text>

        </TouchableOpacity>

        {/* ===================================================
            WISHLIST
        ==================================================== */}
        <TouchableOpacity
          style={styles.item}
          onPress={() => handlePress('Wishlist')}
          activeOpacity={0.7}>

          <Icon
            name="heart-outline"
            size={22}
            color="#012353"
          />

          <Text style={styles.text}>
            Wishlist
          </Text>

        </TouchableOpacity>

      </View>

      {/* =====================================================
          BOTTOM NOTE
      ====================================================== */}
      <View style={styles.bottomBar}>

        <Text style={styles.note}>
          ✔ Verified Property | Best Deal Available
        </Text>

      </View>

    </View>
  );
};

export default Footer;

// ===========================================================
// STYLES
// ===========================================================

const styles = StyleSheet.create({

  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,

    backgroundColor: '#FFFFFF',

    elevation: 10,

    paddingVertical: 9,
    paddingHorizontal: 6,

    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',

    zIndex: 1000,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    marginTop: 3,
    fontSize: 11,
    fontWeight: '600',
    color: '#012353',
  },

  // =========================================================
  // POST PROPERTY BUTTON
  // =========================================================

  postPropertyButton: {
    width: 78,
    height: 58,

    borderRadius: 29,

    backgroundColor: '#F58220',

    alignItems: 'center',
    justifyContent: 'center',

    elevation: 4,

    marginHorizontal: 2,
  },

  postIconCircle: {
    width: 26,
    height: 26,

    borderRadius: 13,

    backgroundColor: '#FFFFFF',

    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: 2,
  },

  postPropertyText: {
    color: '#FFFFFF',

    fontSize: 10,

    fontWeight: '700',

    textAlign: 'center',
  },

  // =========================================================
  // BOTTOM BAR
  // =========================================================

  bottomBar: {
    marginTop: 7,

    borderTopWidth: 1,
    borderColor: '#EEEEEE',

    paddingTop: 5,

    alignItems: 'center',
  },

  note: {
    fontSize: 10,

    color: '#666666',

    fontWeight: '500',
  },

});