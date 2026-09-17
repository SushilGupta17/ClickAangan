import React, {useCallback, useEffect, useState} from 'react';

import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';

import {useFocusEffect} from '@react-navigation/native';

import Share from 'react-native-share';
import LoginPopup from '../screens/LoginPopup';
import {getRentalProperties} from '../services/RentalService';
import ImageRotator from '../components/ImageRotator';
import PropImageRotator from '../components/PropImgRotator';
import Icon from 'react-native-vector-icons/FontAwesome5';
import PropertyTabs from '../components/PropertyTabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {formatPrice} from '../helpers/priceHelper';
import ProjectPopup from '../components/ProjectListing/ProjectPopup';
import RentalCard from '../components/Rental/RentalCard';

// =========================================================
// RENTAL LIST SCREEN
// =========================================================

const RentalListScreen = ({navigation}) => {

  // =======================================================
  // STATES
  // =======================================================

  const [selectedProperty, setSelectedProperty] =
    useState('Apartment');

  const [properties, setrentProperties] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [wishlist, setWishlist] =
    useState([]);

  const [likedItems, setLikedItems] =
    useState([]);

  const [showPopup, setShowPopup] =
    useState(false);

  const [pendingAction, setPendingAction] =
    useState(null);

  const [showProjects, setShowProjects] =
    useState(false);


  // =======================================================
  // LOGIN CHECK
  // =======================================================

  const checkLogin = async action => {

    try {

      const loginStatus =
        await AsyncStorage.getItem('userLogin');

      if (loginStatus === 'true') {

        action();

      } else {

        setPendingAction(() => action);

        setShowPopup(true);

      }

    } catch (e) {

      console.log('Login Check Error:', e);

    }

  };


  // =======================================================
  // LOAD WISHLIST
  // =======================================================

  const loadWishlist = async () => {

    try {

      const data =
        await AsyncStorage.getItem('wishlist');

      if (data) {

        const parsedWishlist =
          JSON.parse(data);

        setWishlist(parsedWishlist);

        setLikedItems(
          parsedWishlist.map(x => x.id)
        );

      } else {

        setWishlist([]);

        setLikedItems([]);

      }

    } catch (error) {

      console.log(
        'Wishlist Error:',
        error
      );

    }

  };


  // =======================================================
  // LOAD RENTAL PROPERTIES
  // =======================================================

  const loadProperties = useCallback(async () => {

    try {

      setLoading(true);

      console.log('');
      console.log('=================================');
      console.log('LOADING RENTAL PROPERTIES');
      console.log('=================================');

      const data =
        await getRentalProperties();

      console.log(
        'FULL RENTAL API RESPONSE:',
        JSON.stringify(data, null, 2)
      );


      // -----------------------------------------------------
      // NORMALIZE API RESPONSE
      // -----------------------------------------------------

      let propertyData = [];


      if (Array.isArray(data)) {

        propertyData = data;

      }

      else if (Array.isArray(data?.data)) {

        propertyData = data.data;

      }

      else if (Array.isArray(data?.result)) {

        propertyData = data.result;

      }

      else if (Array.isArray(data?.properties)) {

        propertyData = data.properties;

      }


      console.log(
        'FINAL RENTAL DATA COUNT:',
        propertyData.length
      );


      // -----------------------------------------------------
      // SHOW SOME PROPERTY TYPES FOR DEBUGGING
      // -----------------------------------------------------

      console.log(
        'RENTAL PROPERTY TYPES:',
        propertyData.map(item => item?.propertyType)
      );


      // -----------------------------------------------------
      // SAVE DATA
      // -----------------------------------------------------

      setrentProperties(propertyData);

    }

    catch (error) {

      console.log(
        'Rental API Error:',
        error
      );

      setrentProperties([]);

    }

    finally {

      setLoading(false);

    }

  }, []);


  // =======================================================
  // IMPORTANT:
  // LOAD DATA EVERY TIME RENT SCREEN GETS FOCUS
  // =======================================================

  useFocusEffect(
    useCallback(() => {

      console.log('');
      console.log('=================================');
      console.log('RENT SCREEN FOCUSED');
      console.log('=================================');

      loadProperties();

      loadWishlist();


      return () => {

        console.log(
          'RENT SCREEN BLURRED'
        );

      };

    }, [loadProperties])
  );


  // =======================================================
  // SELECTED RENTAL TYPE
  // =======================================================

  useEffect(() => {

    console.log('');
    console.log('=================================');
    console.log(
      'SELECTED RENTAL TYPE:',
      selectedProperty
    );
    console.log(
      'TOTAL RENTAL DATA:',
      properties.length
    );
    console.log('=================================');

  }, [
    selectedProperty,
    properties,
  ]);


  // =======================================================
  // PROPERTY TYPE FILTER
  // =======================================================

  const filteredData =
    Array.isArray(properties)

      ? properties.filter(item => {

          // -----------------------------------------------
          // NO FILTER
          // -----------------------------------------------

          if (!selectedProperty) {

            return true;

          }


          // -----------------------------------------------
          // API PROPERTY TYPE
          // -----------------------------------------------

          const propertyType =
            item?.propertyType
              ?.toString()
              ?.trim()
              ?.toLowerCase();


          // -----------------------------------------------
          // SELECTED TAB
          // -----------------------------------------------

          const selected =
            selectedProperty
              ?.toString()
              ?.trim()
              ?.toLowerCase();


          console.log(
            'FILTER:',
            propertyType,
            '===',
            selected
          );


          return propertyType === selected;

        })

      : [];


  // =======================================================
  // DEBUG
  // =======================================================

  console.log(
    '=========================='
  );

  console.log(
    'RENT SCREEN PROPERTIES:',
    properties.length
  );

  console.log(
    'SELECTED PROPERTY:',
    selectedProperty
  );

  console.log(
    'FILTERED DATA:',
    filteredData.length
  );

  console.log(
    '=========================='
  );


  // =======================================================
  // WISHLIST
  // =======================================================

  const addToWishlist = async item => {

    try {

      const existingWishlist =
        JSON.parse(
          await AsyncStorage.getItem(
            'wishlist'
          )
        ) || [];


      const alreadyExists =
        existingWishlist.some(
          x => x.id === item.id
        );


      if (alreadyExists) {

        Alert.alert(
          'Wishlist',
          'Property already exists in wishlist'
        );

        return;

      }


      const updatedWishlist = [
        ...existingWishlist,
        item,
      ];


      await AsyncStorage.setItem(
        'wishlist',
        JSON.stringify(updatedWishlist)
      );


      setWishlist(
        updatedWishlist
      );


      setLikedItems(prev => [
        ...prev,
        item.id,
      ]);


      Alert.alert(
        'Success',
        'Added to Wishlist'
      );

    }

    catch (error) {

      console.log(
        'Wishlist Add Error:',
        error
      );

    }

  };


  // =======================================================
  // CALL OWNER
  // =======================================================

  const callOwner = item => {

    if (!item?.mobile) {

      Alert.alert(
        'Error',
        'Mobile number not available'
      );

      return;

    }


    Linking.openURL(
      `tel:${item.mobile}`
    );

  };


  // =======================================================
  // SHARE PROPERTY
  // =======================================================

  const shareProperty = async item => {

    try {

      await Share.open({

        title: item.title,

        message: `
🏠 ${item.title}

💰 ₹ ${formatPrice(item.price)}

📍 ${item.location}

🏡 Property for Rent
`,

        url:
          'https://picsum.photos/id/238/800/400',

      });

    }

    catch (error) {

      console.log(
        'Share Error:',
        error
      );

    }

  };


  // =======================================================
  // WHATSAPP
  // =======================================================

  const openWhatsApp = item => {

    if (!item?.mobile) {

      Alert.alert(
        'Error',
        'Mobile number not available'
      );

      return;

    }


    const appLink =
      `propertyapp://property/${item.id}`;


    const webLink =
      `https://savariyaproperty.in/properties/${item.id}`;


    const message = `

🏠 *${item.title}*

🏡 Property Available for Rent

💰 Rent: ₹ ${formatPrice(item.price)}

📍 Location: ${item.location}

📐 Area: ${item.area || ''} Sq.Ft.

👉 Open in App:
${appLink}

🌐 View Online:
${webLink}
`;


    const phoneNumber =
      '91' + item.mobile;


    const url =
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        message
      )}`;


    Linking.openURL(url)
      .catch(err =>
        console.log(
          'WhatsApp error:',
          err
        )
      );

  };


  // =======================================================
  // PROPERTY CARD
  // =======================================================

  const renderItem = ({item}) => (

    <RentalCard
      item={item}
      navigation={navigation}
      checkLogin={checkLogin}
    />

  );


  // =======================================================
  // LOADING
  // =======================================================

  if (loading) {

    return (

      <View style={styles.loader}>

        <ActivityIndicator
          size="large"
          color="#1959a2"
        />

      </View>

    );

  }


  // =======================================================
  // RETURN
  // =======================================================

return (
  <View style={styles.container}>

    {/* =================================================
        PROPERTY TABS
    ================================================= */}
    <PropertyTabs
      navigation={navigation}
      selectedProperty={selectedProperty}
      onTabChange={setSelectedProperty}
      setShowProjects={setShowProjects}
    />

    {/* =================================================
        PROPERTY DATA
    ================================================= */}
    {filteredData.length > 0 ? (
      <SectionList
        sections={[
          {
            title: '',
            data: filteredData,
          },
        ]}
        keyExtractor={(item, index) =>
          `${item?.id ?? index}`
        }
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 140,
        }}
      />
    ) : (
      /* =================================================
         NO DATA
      ================================================= */
      <View style={styles.noPropertyContainer}>

        <Text style={styles.noPropertyIcon}>
          🏠
        </Text>

        <Text style={styles.noPropertyTitle}>
          No {selectedProperty} Data Found
        </Text>

        <Text style={styles.noPropertyText}>
          No rental property found for {selectedProperty}.
        </Text>

      </View>
    )}

    {/* =================================================
        PROJECT POPUP
    ================================================= */}
    <ProjectPopup
      visible={showProjects}
      navigation={navigation}
      onClose={() => {
            setShowProjects(false);
            setSelectedProperty('Apartment');
        }}
    />

    {/* =================================================
        LOGIN POPUP
    ================================================= */}
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

  </View>
);

};


// =========================================================
// EXPORT
// =========================================================

export default RentalListScreen;


// =========================================================
// STYLES
// =========================================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },


  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },


  card: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
  },


  image: {
    width: '100%',
    height: 220,
  },


  badgeContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
  },


  badge: {
    backgroundColor: '#28A745',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    fontWeight: '700',
    fontSize: 12,
  },


  info: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 12,
  },


  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 7,
  },


  price: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1959A2',
  },


  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },


  actionIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F1F6FC',
    justifyContent: 'center',
    alignItems: 'center',
  },


  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 2,
    marginBottom: 5,
  },


  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },


  location: {
    flex: 1,
    fontSize: 12,
    color: '#1959A2',
    marginLeft: 5,
    fontWeight: '600',
  },


  description: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 11,
  },


  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },


  contactBtn: {
    flex: 1,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1959A2',
    backgroundColor: '#F4F8FD',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },


  contactBtnText: {
    color: '#1959A2',
    fontSize: 11,
    fontWeight: '700',
  },


  detailsBtn: {
    flex: 1.15,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#1959A2',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    elevation: 2,
  },


  detailsBtnText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },


  enquiryBtn: {
    flex: 0.9,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#0A8754',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    elevation: 2,
  },


  enquiryBtnText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },


  noPropertyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 20,
  },


  noPropertyIcon: {
    fontSize: 45,
    marginBottom: 10,
  },


  noPropertyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },


  noPropertyText: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
  },

});