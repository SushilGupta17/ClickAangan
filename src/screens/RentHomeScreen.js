import {
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeHeader from '../components/HomeHeader';
import Footer from '../components/Footer';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoginPopup from '../screens/LoginPopup';
import RentalListScreen from '../screens/RentalListScreen';

function RentHomeScreen({navigation}) {
const [showPopup, setShowPopup] = useState(false);
const [showTopFilters, setShowTopFilters] = useState(true);
const [lastOffset, setLastOffset] = useState(0);

const [selectedType, setSelectedType] =
    useState('Apartment');

const [selectedProperty, setSelectedProperty] =
  useState('Apartment');
  
  useEffect(() => {
  checkUserLogin();
}, []);

const checkUserLogin = async () => {
  try {
    const loginStatus = await AsyncStorage.getItem('userLogin');

    if (loginStatus !== 'true') {
      setShowPopup(true);
    }
  } catch (error) {
    console.log(error);
  }
};

const checkLoginAndProceed = async (callback) => {
  try {
    const loginStatus = await AsyncStorage.getItem('userLogin');

    if (loginStatus === 'true') {
      setShowPopup(false);
      callback();
    } else {
      setShowPopup(true);
    }
  } catch (e) {
    console.log(e);
  }
};

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
    <HomeHeader />
 
<RentalListScreen
  navigation={navigation}
  selectedProperty={selectedProperty}
  setShowTopFilters={setShowTopFilters}
/>

<TouchableOpacity
  style={styles.floatingAddProperty}
  activeOpacity={0.8}
  onPress={() =>
    checkLoginAndProceed(() => {
      navigation.navigate('AddPropertyScreen');
    })
  }>

 <Text style={styles.floatingText}>
  Post Property{" "}
  <Text style={styles.freeText}>FREE</Text>
</Text>
</TouchableOpacity>

<TouchableOpacity
  style={styles.floatingAiSearch}
  activeOpacity={0.8}
  onPress={() =>
    checkLoginAndProceed(() => {
      navigation.navigate('AiSearchScreen');
    })
  }>
  <Text style={styles.floatingAiText}>
  AI Search
  </Text>
</TouchableOpacity>
 <LoginPopup
        visible={showPopup}
        onClose={() => setShowPopup(false)}
        onGuest={() => setShowPopup(false)}
        onLogin={() => {
          setShowPopup(false);
          navigation.navigate('Login');
        }}
        onRegister={() => {
          setShowPopup(false);
          navigation.navigate('Register');
        }}
        onForgotPassword={() => {
  setShowPopup(false);
  navigation.navigate('Forgot');
}}
      />
      <Footer />
    </SafeAreaView>
  );
}

export default RentHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#012353',
color:'#ffff'
  },

  floatingAddProperty: {
  position: 'absolute',
  right: 0,
  top: '50%',
  marginTop: -70,

  width: 46,
  height: 140,

  backgroundColor: '#012353',

  justifyContent: 'center',
  alignItems: 'center',

  borderTopLeftRadius: 12,
  borderBottomLeftRadius: 12,

  elevation: 12,
  zIndex: 99999,

  shadowColor: '#783d06',
  shadowOffset: {width: 0, height: 3},
  shadowOpacity: 0.35,
  shadowRadius: 5,
},

floatingText: {
  color: '#fff',
  fontSize: 14,
  fontWeight: '700',
  transform: [{ rotate: '-90deg' }],
  width: 160,
  textAlign: 'center',
},

freeText: {
  color: '#00FF66',
  fontWeight: 'bold',
  fontSize: 16,
  fontStyle: 'italic',   // Optional
  fontFamily: 'Algerian',

},
floatingAiSearch: {
  position: 'absolute',
  left: 0,
  top: '50%',
  marginTop: -70,

  width: 46,
  height: 140,

  backgroundColor: '#012353', // Same color

  justifyContent: 'center',
  alignItems: 'center',

  borderTopRightRadius: 12,
  borderBottomRightRadius: 12,

  elevation: 12,
  zIndex: 99999,

  shadowColor: '#783d06',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.35,
  shadowRadius: 5,
},

floatingAiText: {
  color: '#fff',
  fontSize: 14,
  fontWeight: '700',
  width: 160,
  textAlign: 'center',
  transform: [{ rotate: '90deg' }], // Left button
},

});