import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
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



const API_URL111 = 'http://192.168.1.6:7045/api/property';
const API_URL = 'https://savariyaproperty.in';

const PropertyListScreen = ({
  navigation,
  selectedProperty1,
}) => {

  const [selectedProperty, setSelectedProperty] =
    useState('3 BHK');
const [showTopFilters, setShowTopFilters] = useState(false);
const [properties, setProperties] = useState([]);
const [loading, setLoading] = useState(true);
const [favorites, setFavorites] = useState([]);
const lastOffset = useRef(0);
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
  loadProperties();
  loadWishlist();
}, []);

useEffect(() => {
  console.log('Selected:', selectedProperty);
}, [selectedProperty]);

const filteredData = properties.filter(item =>
  item.propertyType?.trim().toLowerCase() ===
  selectedProperty.trim().toLowerCase()
);

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
      setProperties(data);
    } catch (error) {
      console.log('API Error:', error);
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

<View style={styles.priceRow}>
  <Text style={styles.price}>
    ₹ {formatPrice(item.price)}
  </Text>

  <View style={styles.iconContainer}>
   

    <TouchableOpacity
     onPress={() => callOwner(item)}
      style={{marginRight: 18}}>
      <Icon
        name="phone"
        size={16}
        color="#25D366"
      />
    </TouchableOpacity>

    

    <TouchableOpacity
    onPress={() =>
  checkLogin(() => openWhatsApp(item))}>
      <Icon
        name="whatsapp"
        size={25}
        color="#25D366"
      />
    </TouchableOpacity>

    <TouchableOpacity
    onPress={() =>
  checkLogin(() => shareProperty(item))}
      style={{marginLeft: 10}}>
      <Icon
        name="share-alt"
        size={18}
        color="#2196F3"
      />
    </TouchableOpacity>
   
<TouchableOpacity
  onPress={() =>
  checkLogin(() => addToWishlist(item))
}
  style={{marginLeft: 15}}>

  <Icon
    name="heart"
    size={20}
    color={
      likedItems.includes(item.id)
        ? "red"   // filled heart
        : "#25D366"
    }
  />
</TouchableOpacity>


  </View>
</View>

        <Text style={styles.title}>
          {item.title}
        </Text>

        <Text style={styles.location}>
          📍 {item.location}
        </Text>

        <View style={styles.featureRow}>
          <View style={styles.featureBox}>
            <Text style={styles.featureValue}>
              {item.bedrooms}
            </Text>
            <Text style={styles.featureLabel}>
              Beds
            </Text>
          </View>

          <View style={styles.featureBox}>
            <Text style={styles.featureValue}>
              {item.bathrooms}
            </Text>
            <Text style={styles.featureLabel}>
              Baths
            </Text>
          </View>

          <View style={styles.featureBox}>
            <Text style={styles.featureValue}>
              {item.area}
            </Text>
            <Text style={styles.featureLabel}>
              Sq.Ft
            </Text>
          </View>
        </View>

        <Text
          style={styles.description}
          numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.contactBtn}
            onPress={() => checkLogin(() =>  navigation.navigate('ContactOwner'))}>
            <Text style={styles.contactBtnText}>
              Contact Owner
            </Text>
          </TouchableOpacity>

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
          </TouchableOpacity>
          <TouchableOpacity
              style={styles.enquiryBtn}
              onPress={() => navigation.navigate('EnquiryScreen')}>
              <Text style={styles.enquiryBtnText}>
                Enquiry
              </Text>
            </TouchableOpacity> 
        </View>
      </View>
    </TouchableOpacity>
  );

const handleScroll = (e) => {
  const currentOffset = e.nativeEvent.contentOffset.y;
  const diff = currentOffset - lastOffset.current;

  if (Math.abs(diff) < 15) return;

  if (diff > 0 && currentOffset > 100) {
    setShowTopFilters(false);
  } else {
    setShowTopFilters(true);
  }

  lastOffset.current = currentOffset;
};

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

    Alert.alert('Success', 'Added to Wishlist');
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
     <FlatList
        data={filteredData}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 20}}
        ListHeaderComponent={
          <>
          <ImageRotator />

             {showTopFilters && (
                <PropertyTabs
                      navigation={navigation}
                      selectedProperty={selectedProperty}
                      onTabChange={setSelectedProperty}
                      showTopFilters={showTopFilters}
                      setShowProjects={setShowProjects}
                  />
          )}
          </>
        }
      />

      <ProjectPopup
      visible={showProjects}
      navigation={navigation}
      onClose={() => setShowProjects(false)}
    />


  <LoginPopup
  visible={showPopup}
  onClose={() => setShowPopup(false)}
  onGuest={() => setShowPopup(false)}
  onLogin={() => {
    setShowPopup(false);
    navigation.navigate("Login");
  }}
  onRegister={() => {
    setShowPopup(false);
    navigation.navigate("Register");
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
}
);