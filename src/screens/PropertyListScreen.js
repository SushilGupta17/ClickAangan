import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SectionList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';
import Share from 'react-native-share';  
import LoginPopup from '../screens/LoginPopup';
import {getProperties} from '../services/PropertyApi';
import ImageRotator from '../components/ImageRotator';
import PropImageRotator from '../components/PropImgRotator';
import Icon from 'react-native-vector-icons/FontAwesome5';
import PropertyTabs from '../components/PropertyTabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatPrice } from '../helpers/priceHelper';
import ProjectPopup from '../components/ProjectListing/ProjectPopup';

const API_URL = 'https://clickaangan.in/';
const API_URL1 = 'http://192.168.1.5:7045';

const PropertyListScreen = ({
  navigation,
  selectedProperty1,
}) => {

  const [selectedProperty, setSelectedProperty] =
    useState('Villa');
const [properties, setProperties] = useState([]);
const [loading, setLoading] = useState(true);
const [favorites, setFavorites] = useState([]);
const [wishlist, setWishlist] = useState([]);
const [likedItems, setLikedItems] = useState([]);
const [showPopup, setShowPopup] = useState(false);
const [pendingAction, setPendingAction] = useState(null);
const [showProjects,setShowProjects]=useState(false);

const checkLogin = async (action) => {
  try {
     const token = await AsyncStorage.getItem("userToken");
     const loginStatus = await AsyncStorage.getItem('userLogin');
     const mobile = await AsyncStorage.getItem('userMobile');

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

const loadWishlist = async () => {
  const data = await AsyncStorage.getItem('wishlist');

  if (data) {
    setWishlist(JSON.parse(data));
  }
};

useEffect(() => {
  console.log('PROJECT POPUP STATE:', showProjects);
}, [showProjects]);

useEffect(() => {
  loadProperties();
  loadWishlist();
}, []);

useEffect(() => {
  console.log('Selected:', selectedProperty);
}, [selectedProperty]);

const filteredData =
  selectedProperty?.trim()
    ? properties.filter(item =>
        item?.propertyType?.trim()?.toLowerCase() ===
        selectedProperty?.trim()?.toLowerCase()
      )
    : properties;

// const filteredData = Array.isArray(properties) ? properties : [];

const filteredProperties = properties.filter(item => {
  if (!selectedProperty) return true;

  return (
    item.propertyType === selectedProperty ||
    item.title?.includes(selectedProperty)
  );
});


const loadProperties = async () => {
  try {
   

    const data = await getProperties();

    if (Array.isArray(data)) {
      setProperties(data);
    } 
    else if (Array.isArray(data?.data)) {
      setProperties(data.data);
    } 
    else if (Array.isArray(data?.result)) {
      setProperties(data.result);
    } 
    else if (Array.isArray(data?.properties)) {
      setProperties(data.properties);
    } 
    else {
      console.log('Unexpected API response:', data);
      setProperties([]);
    }

  } catch (error) {
    console.log('API Error:', error);
    setProperties([]);
  } finally {
    setLoading(false);
  }
};

   const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() =>
        navigation &&
        navigation.navigate('PropertyDetails', {
          property: item,
          id: item.id,
        })
      }>

<PropImageRotator
  images={ item.images
  ? item.images.split(',').map(x =>
      `${API_URL}/${x.trim().replace(/\\/g, '/')}`
    )
  : []}
/>

    

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

<View style={styles.iconContainer}>

  {/* CALL */}
  <TouchableOpacity
    onPress={() => callOwner(item)}
    style={styles.actionIcon}>
    <Icon
      name="phone"
      size={15}
      color="#1959A2"
    />
  </TouchableOpacity>


  {/* WHATSAPP */}
  <TouchableOpacity
    onPress={() =>
      checkLogin(() => openWhatsApp(item))
    }
    style={styles.actionIcon}>
    <Icon
      name="whatsapp"
      size={18}
      color="#25D366"
    />
  </TouchableOpacity>


  {/* SHARE */}
  <TouchableOpacity
    onPress={() =>
      checkLogin(() => shareProperty(item))
    }
    style={styles.actionIcon}>
    <Icon
      name="share-alt"
      size={15}
      color="#1959A2"
    />
  </TouchableOpacity>


  {/* WISHLIST */}
  <TouchableOpacity
    onPress={() =>
      checkLogin(() => addToWishlist(item))
    }
    style={styles.actionIcon}>

    <Icon
      name="heart"
      size={17}
      color={
        likedItems.includes(item.id)
          ? "red"
          : "#1959A2"
      }
    />

  </TouchableOpacity>

</View>


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
 numberOfLines={1}> </Text>

{/* =========================
BUTTONS
========================== */}

  <View style={styles.buttonRow}>


{/* CONTACT OWNER */}
<TouchableOpacity
  style={styles.contactBtn}
  onPress={() =>
    checkLogin(() =>
      navigation.navigate('ContactOwner', {
        property: item,
      })
    )
  }>

  <Icon
    name="phone"
    size={12}
    color="#1959A2"
  />

  <Text style={styles.contactBtnText}>
    Contact
  </Text>

</TouchableOpacity>


{/* VIEW DETAILS */}
<TouchableOpacity
  style={styles.detailsBtn}
  onPress={() =>
    checkLogin(() =>
      navigation.navigate('PropertyDetails', {
        property: item,
        id: item.id,
      })
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


{/* ENQUIRY */}
<TouchableOpacity
  style={styles.enquiryBtn}
  onPress={() =>
    checkLogin(() =>
      navigation.navigate('EnquiryScreen', {
        property: item,
      })
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


const addToWishlist = async (item) => {
  try {
    const existingWishlist =
      JSON.parse(await AsyncStorage.getItem('wishlist')) || [];

    const alreadyExists = existingWishlist.some(
      x => x.id === item.id
    );

    if (alreadyExists) {
      Alert.alert('Wishlist', 'Property already exists in wishlist');
      return;
    }

    const updatedWishlist = [...existingWishlist, item];

    await AsyncStorage.setItem(
      'wishlist',
      JSON.stringify(updatedWishlist)
    );

    // ✅ IMPORTANT: update UI state
    setLikedItems(prev => [...prev, item.id]);

  
  } catch (error) {
    console.log(error);
  }
};



const callOwner = item => {
  Linking.openURL(`tel:${item.mobile}`);
};  

const shareProperty = async (item) => {
  try {
    await Share.open({  
      title: item.title,
      message: `
🏠 ${item.title}
💰 ${item.price}
📍 ${item.location}
      `,
      url: 'https://picsum.photos/id/238/800/400', // image URL
      social: Share.Social.WHATSAPP,
    });
  } catch (error) {
    console.log(error);
  }
};


const openWhatsApp = (item) => {
  const appLink = `propertyapp://property/${item.id}`;
  const webLink = `https://yourdomain.com/properties/${item.id}`;

  const message = `
🏠 *${item.title}*

💰 ₹${item.price}
📍 ${item.location}

👉 Open in App:
${appLink}

🌐 View Online:
${webLink}
`;

  const phoneNumber = '91' + item.mobile;

  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  Linking.openURL(url).catch(err =>
    console.log('WhatsApp error:', err)
  );
};

const openWhatsApp2 = (item) => {
const imgName = 'https://picsum.photos/id/238/800/400';

  const message =
`🏠 Property Details

📌 Title: ${item.title}

💰 Price: ₹${item.price}

📍 Location: ${item.location}

📐 Area: ${item.area} Sq.Ft.

🛏 Bedrooms: ${item.bedrooms}

📝 Description:
${item.description}

📞 Contact: ${item.mobile}

🔗 Property Image:
${imgName}
`;

const phoneNumber = '9314630866';
  const url =
    `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  Linking.openURL(url);
};

const openWhatsApp1 = () => {
  const phoneNumber = '9314630866';

  Linking.openURL(
    `https://wa.me/${phoneNumber}?text=text=Hello, I am interested in your property`
  ).catch(err =>
    console.log('Error opening WhatsApp', err),
  );
};




  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#1959a2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
     <SectionList
  sections={[
    {
      title: '',
      data: filteredData,
    },
  ]}

  keyExtractor={item => item.id.toString()}

  renderItem={renderItem}

  renderSectionHeader={() => (
    <PropertyTabs
      navigation={navigation}
      selectedProperty={selectedProperty}
      onTabChange={setSelectedProperty}
      setShowProjects={setShowProjects}
    />
  )}

  ListHeaderComponent={<ImageRotator />}

  ListEmptyComponent={() => (
    <View style={styles.noPropertyContainer}>
      <Text style={styles.noPropertyIcon}>🏠</Text>

      <Text style={styles.noPropertyTitle}>
        No Property Available
      </Text>

      <Text style={styles.noPropertyText}>
        No property found for {selectedProperty}.
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

      <ProjectPopup
      visible={showProjects}
      navigation={navigation}
      onClose={() => {
  setShowProjects(false);
  setSelectedProperty('Villa');
}}
/>

<LoginPopup
  visible={showPopup}

  onClose={() => {
    setShowPopup(false);
  }}

  onGuest={() => {
    setShowPopup(false);
  }}

  onLogin={() => {
    // LoginPopup ke andar successful login hone par
    // popup close hoga, Home par hi rahenge
    setShowPopup(false);
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

export default PropertyListScreen;

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
    fontSize: 13,
    fontWeight: '200',
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
    lineHeight: 10,
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

  contactBtnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  detailsBtnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  enquiryBtn: {
  flex: 1,
    backgroundColor: 'red',
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 5,
  },

  enquiryBtnText: { 
  color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
},

  whatsappBtn: {width: 50,
  height: 50,
  backgroundColor: '#fff',
  borderRadius: 25,
  justifyContent: 'center',
  alignItems: 'center',
  marginHorizontal: 5,
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

stickyTabs: {
  backgroundColor: "#fff",
  zIndex: 100,
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
  color: '#111111',
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
}
);