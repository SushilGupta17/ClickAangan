import React, {useEffect, useState} from 'react';

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
import Header from '../components/Header';
import Footer from '../components/Footer';

//const API_URL = 'http://192.168.1.3:7045';
const API_URL = 'https://savariyaproperty.in';

const RentalListScreen = ({
navigation,
}) => {

const [selectedProperty, setSelectedProperty] = useState('Apartment');

const [properties, setrentProperties] = useState([]);
const [loading, setLoading] = useState(true);
const [wishlist, setWishlist] = useState([]);
const [likedItems, setLikedItems] = useState([]);
const [showPopup, setShowPopup] = useState(false);
const [pendingAction, setPendingAction] = useState(null);
const [showProjects, setShowProjects] = useState(false);

// ================= LOGIN CHECK =================

const checkLogin = async (action) => {
try {
  const loginStatus =
    await AsyncStorage.getItem('userLogin');

  if (loginStatus) {
    action();
  } else {
    setPendingAction(() => action);
    setShowPopup(true);
  }

} catch (e) {
  console.log(e);
}
 

};

// ================= LOAD WISHLIST =================

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

  }

} catch (error) {

  console.log(
    'Wishlist Error:',
    error
  );

}
 

};

// ================= LOAD RENTAL PROPERTIES =================

const loadProperties = async () => {
  try {
    setLoading(true);

    const data = await getRentalProperties();

    console.log(
      'FULL RENTAL API RESPONSE:',
      JSON.stringify(data, null, 2)
    );

    let propertyData = [];

    if (Array.isArray(data)) {
      console.log(data);
      propertyData = data;
    } else if (Array.isArray(data?.data)) {
      propertyData = data.data;
    } else if (Array.isArray(data?.result)) {
      propertyData = data.result;
    } else if (Array.isArray(data?.properties)) {
      propertyData = data.properties;
    }

    console.log(
      'FINAL RENTAL DATA:',
      propertyData
    );

    // API already rental data दे रही है
    setrentProperties(propertyData);

  } catch (error) {

    console.log(
      'Rental API Error:',
      error
    );

    setrentProperties([]);

  } finally {
    setLoading(false);
  }
};

// ================= USE EFFECT =================

useEffect(() => {
 
loadProperties();
loadWishlist();
 

}, []);

useEffect(() => {

 
console.log(
  'Selected Rental Type:',
  selectedProperty
);
 

}, [selectedProperty]);

// ================= PROPERTY TYPE FILTER =================

const filteredData =
Array.isArray(properties)

 
  ? properties.filter(item => {

      if (!selectedProperty) {
        return true;
      }

      const propertyType =
        item?.propertyType
          ?.trim()
          ?.toLowerCase();

      const selected =
        selectedProperty
          ?.trim()
          ?.toLowerCase();

      return propertyType === selected;

    })

  : [];
 
  console.log('==========================');
console.log('RENT SCREEN PROPERTIES:', properties.length);
console.log('SELECTED PROPERTY:', selectedProperty);
console.log('FILTERED DATA:', filteredData.length);
console.log('==========================');


// ================= WISHLIST =================

const addToWishlist = async (item) => {

 
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


} catch (error) {

  console.log(error);

}
 

};

// ================= CALL OWNER =================

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

// ================= SHARE PROPERTY =================

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

} catch (error) {

  console.log(error);

}
 

};

// ================= WHATSAPP =================

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
  `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;


Linking.openURL(url)
  .catch(err =>
    console.log(
      'WhatsApp error:',
      err
    )
  );

};

// ================= PROPERTY CARD =================

const renderItem = ({item}) => (

 
<TouchableOpacity
  style={styles.card}
  activeOpacity={0.9}
  onPress={() =>
    navigation.navigate(
      'PropertyDetails',
      {
        property: item,
        id: item.id,
      }
    )
  }
>

  <PropImageRotator
    images={
      item.images
        ? item.images
            .split(',')
            .map(
              x =>
                `${API_URL}/${x
                  .trim()
                  .replace(/\\/g, '/')}`
            )
        : []
    }
  />


  {/* PROPERTY TYPE BADGE */}

  <View style={styles.badgeContainer}>

    <Text style={styles.badge}>

      {item.propertyType}

    </Text>

  </View>

  <View style={styles.info}>

{/* =========================
PRICE + ACTION ICONS
========================== */}

  <View style={styles.priceRow}>


<Text style={styles.price}>
  ₹ {formatPrice(item.price)}
</Text>

  </View>

{/* =========================
TITLE
========================== */}

<Text
 style={styles.title}
 numberOfLines={1}>
{item.title} </Text>

{/* =========================
LOCATION
========================== */}

  <View style={styles.locationRow}>


<Icon
  name="map-marker-alt"
  size={13}
  color="#C62828"
/>

<Text
  style={styles.location}
  numberOfLines={1}>
  {item.location}
</Text>


  </View>

{/* =========================
DESCRIPTION
========================== */}

<Text
 style={styles.description}
 numberOfLines={2}>
{item.description} </Text>

{/* =========================
BUTTONS
========================== */}

<View style={styles.buttonRow}>
  <TouchableOpacity
    style={styles.contactBtn}
    onPress={() =>
      checkLogin(() =>
        navigation.navigate('ContactOwner', {
          property: item,
        }),
      )
    }>
    <Icon
      name="phone"
      size={12}
      color="#C62828"
    />

    <Text style={styles.contactBtnText}>
      Contact
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.detailsBtn}
    onPress={() =>
      checkLogin(() =>
        navigation.navigate('PropertyDetails', {
          property: item,
          id: item.id,
        }),
      )
    }>
    <Text style={styles.detailsBtnText}>
      View Details
    </Text>

    <Icon
      name="arrow-right"
      size={11}
      color="#fff"
    />
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.enquiryBtn}
    onPress={() =>
      checkLogin(() =>
        navigation.navigate('EnquiryScreen', {
          property: item,
        }),
      )
    }>
    <Icon
      name="comment-dots"
      size={12}
      color="#fff"
    />

    <Text style={styles.enquiryBtnText}>
      Enquiry
    </Text>
  </TouchableOpacity>
</View>

</View>
 

</TouchableOpacity>


);

// ================= LOADING =================

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

// ================= RETURN =================

return (


<View style={styles.container}>

  <SectionList

    sections={[
      {
        title: '',
        data: filteredData,
      },
    ]}

    keyExtractor={item =>
      item.id.toString()
    }

    renderItem={renderItem}


    
    renderSectionHeader={() => (

      <PropertyTabs
        navigation={navigation}
        selectedProperty={selectedProperty}
        onTabChange={setSelectedProperty}
        setShowProjects={setShowProjects}
      />

    )}




    ListEmptyComponent={() => (

      <View
        style={
          styles.noPropertyContainer
        }
      >

        <Text
          style={
            styles.noPropertyIcon
          }
        >
          🏠
        </Text>


        <Text
          style={
            styles.noPropertyTitle
          }
        >

          No Rental Property Available

        </Text>


        <Text
          style={
            styles.noPropertyText
          }
        >

          No rental property found for{' '}
          {selectedProperty}.

        </Text>


      </View>

    )}


    stickySectionHeadersEnabled={true}

    showsVerticalScrollIndicator={false}

    contentContainerStyle={{
      paddingBottom: 140,
      flexGrow: 1,
    }}

  />


  {/* PROJECT POPUP */}

  <ProjectPopup
    visible={showProjects}
    navigation={navigation}
    onClose={() =>
      setShowProjects(false)
    }
  />


  {/* LOGIN POPUP */}

  <LoginPopup

    visible={showPopup}

    onClose={() =>
      setShowPopup(false)
    }

    onGuest={() =>
      setShowPopup(false)
    }

    onLogin={() => {

      setShowPopup(false);

      navigation.navigate(
        'Login'
      );

    }}

    onRegister={() => {

      setShowPopup(false);

      navigation.navigate(
        'Register'
      );

    }}

  />


</View>


);

};

export default RentalListScreen;

// ================= STYLES =================

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
padding: 15,
},

price: {
fontSize: 20,
fontWeight: 'bold',
color: '#0078FF',
},

title: {
fontSize: 16,
fontWeight: '500',
marginTop: 5,
color: '#222',
},

location: {
marginTop: 6,
color: '#666',
fontSize: 14,
},

featureRow: {
flexDirection: 'row',
justifyContent: 'space-between',
marginTop: 15,
},

featureBox: {
width: '31%',
backgroundColor: '#F7F7F7',
borderRadius: 10,
paddingVertical: 10,
alignItems: 'center',
},

featureValue: {
fontSize: 18,
fontWeight: 'bold',
color: '#222',
},

featureLabel: {
fontSize: 12,
color: '#777',
marginTop: 2,
},

description: {
marginTop: 12,
color: '#666',
lineHeight: 20,
fontSize: 14,
},

buttonRow: {
flexDirection: 'row',
marginTop: 15,
},

contactBtn: {
flex: 1,
backgroundColor: '#28A745',
paddingVertical: 12,
borderRadius: 8,
marginRight: 5,
},

detailsBtn: {
flex: 1,
backgroundColor: '#0078FF',
paddingVertical: 12,
borderRadius: 8,
marginLeft: 5,
},

enquiryBtn: {
flex: 1,
backgroundColor: 'red',
paddingVertical: 12,
borderRadius: 8,
marginLeft: 5,
},

contactBtnText: {
color: '#fff',
textAlign: 'center',
fontWeight: 'bold',
fontSize: 11,
},

detailsBtnText: {
color: '#fff',
textAlign: 'center',
fontWeight: 'bold',
fontSize: 11,
},

enquiryBtnText: {
color: '#fff',
textAlign: 'center',
fontWeight: 'bold',
fontSize: 11,
},

priceRow: {
flexDirection: 'row',
alignItems: 'center',
},

iconContainer: {
flexDirection: 'row',
alignItems: 'center',
marginLeft: 'auto',
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

});
