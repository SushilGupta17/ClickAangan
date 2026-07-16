import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Linking,
  Share,
  StyleSheet, // add this
} from 'react-native';

import {useNavigation} from '@react-navigation/native';

const Menu = () => {
  const navigation = useNavigation();
  const [activeMenu, setActiveMenu] = useState('');
  const [showMenu, setShowMenu] = useState(true);

  

    const handleMenuPress = async (menu) => {
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
        Linking.openURL(
          'https://wa.me/9314630866?text=Hello%20I%20need%20help'
        );
        break;

      case 'Share':
        try {
          await Share.share({
            message: 'Check out this amazing real estate app! Download now.',
          });
        } catch (error) {
          Alert.alert('Error', 'Unable to share');
        }
        break;

      case 'Contact':
         navigation.navigate('ContactOwner');
         break;

      case 'Map':
        Linking.openURL('https://www.google.com/maps?q=Office+Location');
        break;

      default:
        break;
    }
  };

    if (!showMenu) return null;

  return (
    <View>

      <TouchableOpacity
        style={[
          styles.menuItem,
          activeMenu === 'Home' && styles.activeMenu,
        ]}
        onPress={() => handleMenuPress('Home')}
      >
        <Text>🏠 Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.menuItem,
          activeMenu === 'Call' && styles.activeMenu,
        ]}
        onPress={() => handleMenuPress('Call')}
      >
        <Text>📞 Call</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.menuItem,
          activeMenu === 'WhatsApp' && styles.activeMenu,
        ]}
        onPress={() => handleMenuPress('WhatsApp')}
      >
        <Text>💬 WhatsApp</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.menuItem,
          activeMenu === 'Share' && styles.activeMenu,
        ]}
        onPress={() => handleMenuPress('Share')}
      >
        <Text>📤 Share</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.menuItem,
          activeMenu === 'Contact' && styles.activeMenu,
        ]}
        onPress={() => handleMenuPress('Contact')}
      >
        <Text>👤 Contact</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.menuItem,
          activeMenu === 'Map' && styles.activeMenu,
        ]}
        onPress={() => handleMenuPress('Map')}
      >
        <Text>📍 Map</Text>
      </TouchableOpacity>

    </View>
  );
};
export default Menu;

const styles = StyleSheet.create({
  menuItem: {
    padding: 12,
  },
  activeMenu: {
    backgroundColor: '#e6f0ff',
  },
});