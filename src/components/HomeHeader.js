import React, {useState, useEffect} from 'react';
import {
    StatusBar,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import Menu from '../components/Menu'; // apne path ke hisab se
import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';

const handleLogout = () => {
  Alert.alert(
    'Logout',
    'Are you sure you want to logout?',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: async () => {
          await AsyncStorage.removeItem('userMobile');
          navigation.replace('Login');
        },
      },
    ],
    {cancelable: true},
  );
};

const Header = () => {
  const navigation = useNavigation();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useFocusEffect(
  useCallback(() => {
   const checkLogin = async () => {
      const loginStatus = await AsyncStorage.getItem('userLogin');
     const mobile = await AsyncStorage.getItem('userMobile');

    if (loginStatus === 'true') {
      setIsLoggedIn(true);
      setUserName(mobile || '');
    } else {
        setIsLoggedIn(false);
      }
    };

    checkLogin();
  }, [])
);

  useEffect(() => {
    const checkLogin = async () => {
      const loginStatus = await AsyncStorage.getItem('userLogin');
     const mobile = await AsyncStorage.getItem('userMobile');

    if (loginStatus === 'true') {
      setIsLoggedIn(true);
      setUserName(mobile || '');
    } else {
        setIsLoggedIn(false);
      }
    };

    checkLogin();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userLogin');

    setIsLoggedIn(false);
    setShowDropdown(false);

    Alert.alert('Success', 'Logout Successful');
  };

  return (
    <>
     <StatusBar backgroundColor="#0A3D62" barStyle="light-content" />
      {/* MENU POPUP */}
      {showMenu && (
        <View style={styles.menuWrapper}>
          <Menu />
        </View>
      )}

      <View style={styles.header}>
        {/* MENU ICON */}
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
           <View style={styles.divider} />
        </View>

        {/* USER / LOGIN */}
        <View style={styles.userSection}>
          {isLoggedIn ? (
            <View>
              <TouchableOpacity
                style={styles.userRow}
                onPress={handleLogout}>
                <Icon name="user-circle" size={22} color="#333" />
                <Text style={styles.userName}>{userName}</Text>
              </TouchableOpacity>

              {showDropdown && (
                <View style={styles.dropdown}>
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setShowDropdown(false);
                      navigation.navigate('Profile');
                    }}>
                    <Text style={styles.dropdownText}>Profile</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={handleLogout}>
                    <Text
                      style={[
                        styles.dropdownText,
                        {color: 'red'},
                      ]}>
                      Logout
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ) : (
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={() => navigation.navigate('Login')}>
              <Text style={styles.btnText}>Login</Text>
            </TouchableOpacity>
          )}
        </View>
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
  flexDirection: 'row',
  alignItems: 'center',
},

divider: {
  width: 1,
  height: 28,
  backgroundColor: '#ddd',
  marginHorizontal: 10,
},

screenTitle: {
  fontSize: 15,
  fontWeight: '700',
  color: '#0A3D62',
},

  logo: {
    width: 180,
    height: 45,
  },

  userSection: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 10,
  },

  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  userName: {
    color: '#333',
    fontSize: 13,
    marginLeft: 6,
    fontWeight: '600',
  },

  loginBtn: {
    backgroundColor: '#012353',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },

  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },

  dropdown: {
    position: 'absolute',
    top: 35,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 5,
    width: 120,
    zIndex: 9999,
  },

  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  dropdownText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
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