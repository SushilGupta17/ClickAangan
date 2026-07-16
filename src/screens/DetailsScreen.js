import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Share,
  Alert,
} from 'react-native';

import {WebView} from 'react-native-webview';
import Header from '../components/Header';
import Footer from '../components/Footer';

const API_URL = 'https://savariyaproperty.in';

const DetailsScreen = ({route}) => {
  
console.log('Route Params => ', route.params);

        const [property, setProperty] = useState(
              route.params?.property || null,
        );
    const id = route.params?.id;
    const latitude = property?.latitude || 26.9124;
    const longitude = property?.longitude || 75.7873;
    
    useEffect(() => {
  if (id) {
    loadPropertyDetails();
  }
}, [id]);


const loadPropertyDetails = async () => {
  try {
    const response = await fetch(
      `${API_URL}/api/Property/${id}`,
    );

    const data = await response.json();

    console.log('Property API Data =>', data);

    setProperty(data);
  } catch (error) {
    console.log(error);
  }
};

  const callOwner = () => {
    Linking.openURL(`tel:${property?.mobile}`);
  };

  const openWhatsapp = () => {
    Linking.openURL(
      `https://wa.me/91${property?.mobile}`,
    );
  };

const shareProperty = async () => {
  try {
    await Share.share({
      message: `
🏠 ${property?.title}


📍 ${property?.location}

💰 Price: ₹ ${property?.price}

📞 Contact: ${property?.mobile || 'N/A'}
      `,
    });
  } catch (error) {
    console.log(error);
  }
};

  return (
    <SafeAreaView style={styles.container}>
 <Header />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 100}}>

        {/* Banner */}

     <Image
        source={{uri: API_URL+property?.imageUrl}}
        style={styles.banner}
        resizeMode="cover"
      />

        {/* Price */}
        <View style={styles.mainContainer}>
          <Text style={styles.price}>
            ₹ {property?.price}
          </Text>
          <Text style={styles.title}>
            {property?.title}
          </Text>
          <Text style={styles.location}>
            📍 {property?.location}
          </Text>
          {/* Overview */}
          <View style={styles.overviewCard}>
            <View style={styles.overviewItem}>
              <Text style={styles.value}>
                {property?.bhk}
              </Text>
              <Text style={styles.label}>
                BHK
              </Text>
            </View>

            <View style={styles.overviewItem}>
              <Text style={styles.value}>
                {property?.area}
              </Text>
              <Text style={styles.label}>
                Area
              </Text>
            </View>

            <View style={styles.overviewItem}>
              <Text style={styles.value}>
                Ready
              </Text>
              <Text style={styles.label}>
                Status
              </Text>
            </View>
          </View>
          {/* Property Details */}

          <View style={styles.card}>

            <Text style={styles.heading}>
              Property Details
            </Text>

            <Row
              title="Configuration"
              value={property?.bhk}
            />

            <Row
              title="Area"
              value={property?.area}
            />

            <Row
              title="Furnishing"
              value={property?.furnishing}
            />

            <Row
              title="Parking"
              value={property?.parking}
            />

          </View>

          {/* Amenities */}

          <View style={styles.card}>

            <Text style={styles.heading}>
              Amenities
            </Text>

            <View style={styles.grid}>

              <Amenity title="Lift" />
              <Amenity title="Gym" />
              <Amenity title="Security" />
              <Amenity title="Garden" />
              <Amenity title="Parking" />
              <Amenity title="Club House" />

            </View>

          </View>

          {/* Description */}

          <View style={styles.card}>

            <Text style={styles.heading}>
              Description
            </Text>

            <Text style={styles.desc}>
              Spacious luxury apartment located
              in a prime residential area.
              Close to schools, hospitals,
              shopping malls and public transport.
              Perfect for families looking for
              comfort and convenience.
            </Text>

          </View>

          {/* Owner */}

          <View style={styles.card}>

            <Text style={styles.heading}>
              Owner Details
            </Text>

            <Text style={styles.ownerName}>
              {property?.owner}
            </Text>

            <Text style={styles.ownerMobile}>
              +91 {property?.mobile}
            </Text>


          </View>


<View style={styles.card}>
  <Text style={styles.heading}>
    Property Location
  </Text>

  <View
    style={{
      height: 200,
      overflow: 'hidden',
      borderRadius: 12,
    }}>

    <WebView
      scrollEnabled={false}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      originWhitelist={['*']}
      source={{
        html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">

          <link
            rel="stylesheet"
            href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          />

          <style>
            html, body {
              margin: 0;
              padding: 0;
              height: 100%;
            }

            #map {
              width: 100%;
              height: 100%;
            }
          </style>
        </head>

        <body>
          <div id="map"></div>

          <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

          <script>
            var map = L.map('map').setView(
              [${latitude}, ${longitude}],
              15
            );

            L.tileLayer(
              'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
              {
                maxZoom: 19,
                attribution: '© OpenStreetMap'
              }
            ).addTo(map);

            L.marker(
              [${latitude}, ${longitude}]
            )
            .addTo(map)
            .bindPopup("${property?.title}")
            .openPopup();
          </script>

        </body>
        </html>
      `,
      }}
    />
  </View>

  <TouchableOpacity
    style={{
      backgroundColor: '#0d6efd',
      padding: 14,
      borderRadius: 10,
      marginTop: 12,
    }}
    onPress={() =>
      Linking.openURL(
        `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`
      )
    }>
    <Text
      style={{
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
      }}>
      Open Full Map
    </Text>
  </TouchableOpacity>
</View>

</View>
      </ScrollView>
<Footer/>

    </SafeAreaView>
  );
};

const Row = ({title, value}) => (
  <View style={styles.row}>
    <Text style={styles.rowTitle}>{title}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

const Amenity = ({title}) => (
  <View style={styles.amenity}>
    <Text>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
bottomBar: {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  flexDirection: 'row',
  backgroundColor: '#fff',
  padding: 10,
  elevation: 10,
  borderTopWidth: 1,
  borderTopColor: '#ddd',
},

callBtn: {
  flex: 1,
  backgroundColor: '#0d6efd',
  paddingVertical: 14,
  borderRadius: 8,
  marginRight: 5,
},

whatsappBtn: {
  flex: 1,
  backgroundColor: '#25D366',
  paddingVertical: 14,
  borderRadius: 8,
  marginHorizontal: 5,
},

shareBtn: {
  flex: 1,
  backgroundColor: '#FF9800',
  paddingVertical: 14,
  borderRadius: 8,
  marginLeft: 5,
},

btnText: {
  color: '#fff',
  textAlign: 'center',
  fontWeight: 'bold',
  fontSize: 15,
},
  banner: {
    width: '100%',
    height: 260,
  },

  mainContainer: {
    padding: 15,
  },

  price: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#e53935',
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 8,
  },

  location: {
    color: '#666',
    marginTop: 5,
  },

  overviewCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginTop: 15,
    borderRadius: 12,
    padding: 15,
    justifyContent: 'space-between',
  },

  overviewItem: {
    alignItems: 'center',
  },

  value: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  label: {
    color: '#777',
    marginTop: 4,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginTop: 15,
  },

  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
  },

  rowTitle: {
    color: '#555',
  },

  rowValue: {
    fontWeight: '600',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  amenity: {
    width: '30%',
    backgroundColor: '#f1f3f6',
    padding: 12,
    margin: 5,
    borderRadius: 8,
    alignItems: 'center',
  },

  desc: {
    lineHeight: 24,
    color: '#555',
  },

  ownerName: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  ownerMobile: {
    marginTop: 5,
    color: '#666',
  },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    elevation: 10,
  },

  callBtn: {
    flex: 1,
    backgroundColor: '#0d6efd',
    padding: 15,
    borderRadius: 10,
    marginRight: 5,
  },

  whatsappBtn: {
    flex: 1,
    backgroundColor: '#25D366',
    padding: 15,
    borderRadius: 10,
    marginLeft: 5,
  },

  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default DetailsScreen;