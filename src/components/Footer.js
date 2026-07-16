import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Linking,Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';


const Footer = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handlePress = (tab) => {
    switch (tab) {
      case 'Home':
        navigation.navigate('Home');
        break;

      case 'Search':
        navigation.navigate('SearchScreen');
        break;

        case 'AI':
            navigation.navigate('AiSearchScreen');
        break;

      case 'Call':
         Linking.openURL(`tel:${'9314630866'}`);
        break;

      case 'Contact':
        navigation.navigate('ContactOwner');
        break;

      case 'Wishlist':
        navigation.navigate('Wishlist');
        break;

      case 'Filter':
        navigation.navigate('FilterScreen');
        break;

        default:
        break;
    }
  };

  return (
<>
   

    <View style={[ styles.footer,
    {
      paddingBottom: insets.bottom,
    },
  ]}>

      <View style={styles.infoRow}>

        <TouchableOpacity style={styles.item} onPress={() => handlePress('Home')}>
          <Text style={styles.icon}>🏠</Text>
          <Text style={styles.text}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => handlePress('Search')}>
          <Text style={styles.icon}>🔍</Text>
          <Text style={styles.text}>Search</Text>
        </TouchableOpacity>

        <TouchableOpacity  style={styles.item} onPress={() => handlePress('Filter')}>
          <Text style={styles.icon}>⚙️</Text>
          <Text style={styles.text}>Filter</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => handlePress('Contact')}>
          <Text style={styles.icon}>👤</Text>
          <Text style={styles.text}>Contact</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() => handlePress('Wishlist')}>
          <Text style={styles.icon}>❤️</Text>
          <Text style={styles.text}>Wishlist</Text>
        </TouchableOpacity>
      

      </View>

      <View style={styles.bottomBar}>
        <Text style={styles.note}>
          ✔ Verified Property | Best Deal Available
        </Text>
      </View>

    </View>
    </>
  );

};

export default Footer;

const styles = StyleSheet.create({
  footer: {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,

  backgroundColor: '#fff',
  elevation: 10,

  paddingVertical: 10,
  paddingHorizontal: 8,

  borderTopWidth: 1,
  borderTopColor: '#E5E5E5',
},

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  item: {
    alignItems: 'center',
    flex: 1,
  },

  icon: {
    fontSize: 18,
    marginBottom: 3,
  },

  text: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },

  bottomBar: {
    marginTop: 8,
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingTop: 6,
    alignItems: 'center',
  },

  note: {
    fontSize: 11,
    color: '#666',
  },
  
});