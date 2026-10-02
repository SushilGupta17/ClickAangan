import React, {useState} from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Linking,
  Share,
  StyleSheet,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

const Menu = () => {
  const navigation = useNavigation();

  const [activeMenu, setActiveMenu] = useState('');
  const [showMenu, setShowMenu] = useState(true);

  const handleMenuPress = async menu => {
    setActiveMenu(menu);
    setShowMenu(false);

    switch (menu) {
      case 'Home':
        navigation.navigate('Home');
        break;

      case 'Call':
        Linking.openURL('tel:+9314630866');
        break;

      case 'WhatsApp':
        try {
          const userName = await AsyncStorage.getItem('userName');
          const userMobile = await AsyncStorage.getItem('userMobile');

          let message;

          if (userName && userMobile) {
            message =
              `🏠 Hello ClickAangan Team,\n\n` +
              `My name is ${userName} and my registered mobile number is ${userMobile}.\n\n` +
              `I would like to know more about properties available on ClickAangan.\n\n` +
              `Please assist me with suitable residential or commercial property options for Buy, Sell or Rent.\n\n` +
              `Thank you.\n` +
              `ClickAangan`;
          } else {
            message =
              `🏠 Hello ClickAangan Team,\n\n` +
              `I would like to know more about properties available on ClickAangan.\n\n` +
              `Please assist me with suitable residential or commercial property options for Buy, Sell or Rent.\n\n` +
              `Thank you.\n` +
              `ClickAangan`;
          }

          const whatsappUrl =
            'https://wa.me/9314630866?text=' +
            encodeURIComponent(message);

          await Linking.openURL(whatsappUrl);
        } catch (error) {
          Alert.alert(
            'WhatsApp',
            'Unable to open WhatsApp. Please try again.',
          );
        }
        break;

     case 'Share':
  try {
    const userName = await AsyncStorage.getItem('userName');
    const userMobile = await AsyncStorage.getItem('userMobile');

    let shareMessage;

    if (userName && userMobile) {
      shareMessage =
        `🏠 ClickAangan\n\n` +
        `Your trusted destination for Buy • Sell • Rent.\n\n` +
        `Explore a wide range of residential and commercial properties, discover suitable opportunities, and connect with property owners and builders — all in one place.\n\n` +
        `Shared by ${userName}\n` +
        `Registered Mobile: ${userMobile}\n\n` +
        `Begin your property journey with ClickAangan — simple, convenient and reliable.`;
    } else {
      shareMessage =
        `🏠 ClickAangan\n\n` +
        `Your trusted destination for Buy • Sell • Rent.\n\n` +
        `Explore a wide range of residential and commercial properties, discover suitable opportunities, and connect with property owners and builders — all in one place.\n\n` +
        `Begin your property journey with ClickAangan — simple, convenient and reliable.`;
    }

    await Share.share({
      message: shareMessage,
    });
  } catch (error) {
    Alert.alert('Error', 'Unable to share');
  }
  break;
  
      case 'Contact':
        navigation.navigate('ContactOwner');
        break;

      default:
        break;
    }
  };

  if (!showMenu) return null;

  return (
    <View style={styles.menuContainer}>

      <TouchableOpacity
        style={[
          styles.menuItem,
          activeMenu === 'Home' && styles.activeMenu,
        ]}
        onPress={() => handleMenuPress('Home')}
        activeOpacity={0.7}>
        <Text style={styles.menuText}>🏠 Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.menuItem,
          activeMenu === 'Call' && styles.activeMenu,
        ]}
        onPress={() => handleMenuPress('Call')}
        activeOpacity={0.7}>
        <Text style={styles.menuText}>📞 Call</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.menuItem,
          activeMenu === 'WhatsApp' && styles.activeMenu,
        ]}
        onPress={() => handleMenuPress('WhatsApp')}
        activeOpacity={0.7}>
        <Text style={styles.menuText}>💬 WhatsApp</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.menuItem,
          activeMenu === 'Share' && styles.activeMenu,
        ]}
        onPress={() => handleMenuPress('Share')}
        activeOpacity={0.7}>
        <Text style={styles.menuText}>📤 Share</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.menuItem,
          activeMenu === 'Contact' && styles.activeMenu,
        ]}
        onPress={() => handleMenuPress('Contact')}
        activeOpacity={0.7}>
        <Text style={styles.menuText}>👤 Contact</Text>
      </TouchableOpacity>

      {/* Close */}
      <TouchableOpacity
        style={[styles.menuItem, styles.closeMenuItem]}
        onPress={() => setShowMenu(false)}
        activeOpacity={0.7}>
        <Text style={styles.closeSymbol}>✕</Text>
        <Text style={styles.menuText}>Close</Text>
      </TouchableOpacity>

    </View>
  );
};

export default Menu;

const styles = StyleSheet.create({
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 5,
    elevation: 5,
  },

  menuItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  activeMenu: {
    backgroundColor: '#e6f0ff',
  },

  menuText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#012353',
  },

  closeMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  closeSymbol: {
    fontSize: 15,
    fontWeight: '700',
    color: '#012353',
    marginRight: 7,
  },
});