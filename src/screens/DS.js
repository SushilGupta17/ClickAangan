import React, {useCallback, useEffect, useState} from 'react';

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  View,
  Text,
  Linking,
  TouchableOpacity,
  Share,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {WebView} from 'react-native-webview';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PropImageRotator from '../components/PropImgRotator';
import PropertyImageCarousel from '../components/propertydetails/PropertyImageCarousel';
import PropertyTitle from '../components/propertydetails/PropertyTitle';
import PropertyStatusCard from '../components/propertydetails/PropertyStatusCard';
import PropertyPriceCard from '../components/propertydetails/PropertyPriceCard';
import PropertyOverviewCard from '../components/propertydetails/PropertyOverviewCard';
import PropertyAmenities from '../components/propertydetails/PropertyAmenities';

const API_URL = 'https://clickaangan.in';

const DetailsScreen = ({route}) => {

  const [property, setProperty] = useState(
    route.params?.property || null,
  );

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const id = route.params?.id;

  const loadPropertyDetails = async () => {
    try {

      if (!id) {
        return;
      }

      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/Property/${id}`,
      );

      if (!response.ok) {
        throw new Error(
          `HTTP Error ${response.status}`,
        );
      }

      const data = await response.json();

      console.log(
        'Property API Data =>',
        data,
      );

      setProperty(data);

    } catch (error) {

      console.log(
        'Property Details Error =>',
        error,
      );

    } finally {

      setLoading(false);
      setRefreshing(false);

    }
  };


  useEffect(() => {

    if (id) {
      loadPropertyDetails();
    }

  }, [id]);


  const onRefresh = useCallback(() => {

    setRefreshing(true);

    loadPropertyDetails();

  }, [id]);


  if (loading && !property) {

    return (
      <SafeAreaView
        style={styles.loaderContainer}>

        <ActivityIndicator
          size="large"
          color="#1959A2"
        />

      </SafeAreaView>
    );

  }


  if (!property) {

    return (
      <SafeAreaView
        style={styles.loaderContainer}>

        <Icon
          name="home-alert-outline"
          size={50}
          color="#999"
        />

        <Text style={styles.noProperty}>
          Property details not available
        </Text>

      </SafeAreaView>
    );

  }


  const latitude =
    Number(property?.latitude) || 26.9124;

  const longitude =
    Number(property?.longitude) || 75.7873;


  return (

    <SafeAreaView style={styles.container}>
    <Header />

     <ScrollView

        showsVerticalScrollIndicator={false}

        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }

        contentContainerStyle={{
          paddingBottom: 110,
        }}>


        {/* ================================= */}
        {/* IMAGE CAROUSEL */}
        {/* ================================= */}

        <PropertyImageCarousel
          property={property}
        />


        {/* ================================= */}
        {/* TITLE */}
        {/* ================================= */}

        <PropertyTitle
          property={property}
        />


        {/* ================================= */}
        {/* STATUS */}
        {/* ================================= */}

        <PropertyStatusCard
          property={property}
        />


        {/* ================================= */}
        {/* PRICE */}
        {/* ================================= */}

        <PropertyPriceCard
          property={property}
        />


        {/* ================================= */}
        {/* OVERVIEW */}
        {/* ================================= */}

        <PropertyOverviewCard
          property={property}
        />


        {/* ================================= */}
        {/* PROPERTY DETAILS */}
        {/* ================================= */}

        {/* <PropertyDetailsCard
          property={property}
        /> */}


        {/* ================================= */}
        {/* AMENITIES */}
        {/* ================================= */}

        <PropertyAmenities
          amenities={property?.amenities || []}
        />


        {/* ================================= */}
        {/* DESCRIPTION */}
        {/* ================================= */}

        <PropertyDescription
          property={property}
        />


        {/* ================================= */}
        {/* BROCHURE */}
        {/* ================================= */}

        <PropertyBrochure
          property={property}
        />


        {/* ================================= */}
        {/* OWNER */}
        {/* ================================= */}

        <OwnerCard
          property={property}
        />


        {/* ================================= */}
        {/* LOCATION */}
        {/* ================================= */}

        <PropertyMapSection
          property={property}
          latitude={latitude}
          longitude={longitude}
        />


        {/* ================================= */}
        {/* ENQUIRY */}
        {/* ================================= */}

        {/* <PropertyEnquiryForm
          property={property}
        /> */}

     </ScrollView>

     <Footer/>

      {/* ================================= */}
      {/* STICKY BOTTOM BAR */}
      {/* ================================= */}

      <PropertyStickyBottomBar
        property={property}
      />

    </SafeAreaView>

  );
};

/* ========================================================= */
/* PROPERTY DETAILS CARD */
/* ========================================================= */

const PropertyDetailsCard = ({property}) => {
  const rows = [
    {
      title: 'Configuration',
      value: property?.bhk,
    },

    {
      title: 'Area',
      value: property?.area
        ? `${property.area} Sq.Ft.`
        : null,
    },

    {
      title: 'Furnishing',
      value: property?.furnishing,
    },

    {
      title: 'Parking',
      value: property?.parking,
    },

    {
      title: 'Property Type',
      value: property?.propertyType,
    },

  ];


  return (

    <View style={styles.card}>

      <Text style={styles.heading}>
        Property Details
      </Text>


      {rows.map((row, index) => {

        if (!row.value) {
          return null;
        }

        return (

          <View
            key={index}
            style={[
              styles.detailRow,
              index === rows.length - 1 &&
                styles.lastRow,
            ]}>

            <Text style={styles.rowTitle}>
              {row.title}
            </Text>

            <Text style={styles.rowValue}>
              {row.value}
            </Text>

          </View>

        );

      })}

    </View>

  );
};


/* ========================================================= */
/* DESCRIPTION */
/* ========================================================= */

const PropertyDescription = ({property}) => {

  if (!property?.description) {
    return null;
  }

  return (

    <View style={styles.card}>

      <Text style={styles.heading}>
        Description
      </Text>

      <Text style={styles.description}>
        {property.description}
      </Text>

    </View>

  );
};


/* ========================================================= */
/* OWNER CARD */
/* ========================================================= */

const OwnerCard = ({property}) => {

  const callOwner = () => {

    if (property?.mobile) {
      Linking.openURL(
        `tel:${property.mobile}`,
      );
    }

  };


  return (

    <View style={styles.card}>

      <Text style={styles.heading}>
        Owner Details
      </Text>


      <View style={styles.ownerRow}>

        <View style={styles.ownerIcon}>

          <Icon
            name="account"
            size={30}
            color="#1959A2"
          />

        </View>


        <View style={styles.ownerInfo}>

          <Text style={styles.ownerName}>
            {property?.owner || 'Property Owner'}
          </Text>

          {property?.mobile ? (
            <Text style={styles.ownerMobile}>
              +91 {property.mobile}
            </Text>
          ) : null}

        </View>


        {property?.mobile ? (

          <TouchableOpacity
            style={styles.ownerCall}
            onPress={callOwner}>

            <Icon
              name="phone"
              size={20}
              color="#fff"
            />

          </TouchableOpacity>

        ) : null}

      </View>

    </View>

  );
};


/* ========================================================= */
/* BROCHURE */
/* ========================================================= */

const PropertyBrochure = ({property}) => {

  const brochure =
    property?.brochurePath ||
    property?.brochure ||
    property?.brochureUrl;


  if (!brochure) {
    return null;
  }


  const openBrochure = () => {

    const url = brochure.startsWith('http')
      ? brochure
      : `${API_URL}${brochure}`;

    Linking.openURL(url);

  };


  return (

    <View style={styles.card}>

      <Text style={styles.heading}>
        Property Brochure
      </Text>


      <TouchableOpacity
        style={styles.brochureButton}
        onPress={openBrochure}>

        <Icon
          name="file-pdf-box"
          size={30}
          color="#D32F2F"
        />

        <View style={styles.brochureInfo}>

          <Text style={styles.brochureTitle}>
            Download Brochure
          </Text>

          <Text style={styles.brochureSub}>
            View property brochure PDF
          </Text>

        </View>

        <Icon
          name="chevron-right"
          size={24}
          color="#777"
        />

      </TouchableOpacity>

    </View>

  );
};


/* ========================================================= */
/* MAP */
/* ========================================================= */

const PropertyMapSection = ({
  property,
  latitude,
  longitude,
}) => {

  const openFullMap = () => {

    Linking.openURL(
      `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`,
    );

  };


  return (

    <View style={styles.card}>

      <Text style={styles.heading}>
        Location
      </Text>


      {property?.location ? (

        <View style={styles.locationRow}>

          <Icon
            name="map-marker"
            size={20}
            color="#1959A2"
          />

          <Text style={styles.locationText}>
            {property.location}
          </Text>

        </View>

      ) : null}


      <View style={styles.mapContainer}>

        <WebView
          scrollEnabled={false}
          javaScriptEnabled
          domStorageEnabled
          originWhitelist={['*']}

          source={{
            html: `
              <!DOCTYPE html>

              <html>

              <head>

                <meta
                  name="viewport"
                  content="width=device-width,
                  initial-scale=1.0"
                />

                <link
                  rel="stylesheet"
                  href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                />

                <style>

                  html,
                  body {
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

                <script
                  src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js">
                </script>

                <script>

                  var map = L.map('map')
                    .setView(
                      [${latitude}, ${longitude}],
                      15
                    );

                  L.tileLayer(
                    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                    {
                      maxZoom: 19,
                      attribution:
                        '© OpenStreetMap'
                    }
                  ).addTo(map);

                  L.marker(
                    [${latitude}, ${longitude}]
                  )
                  .addTo(map)
                  .bindPopup(
                    "${property?.title || 'Property'}"
                  )
                  .openPopup();

                </script>

              </body>

              </html>
            `,
          }}

        />

      </View>


      <TouchableOpacity
        style={styles.mapButton}
        onPress={openFullMap}>

        <Icon
          name="map-outline"
          size={18}
          color="#fff"
        />

        <Text style={styles.mapButtonText}>
          Open Full Map
        </Text>

      </TouchableOpacity>

    </View>

  );
};


/* ========================================================= */
/* ENQUIRY */
/* ========================================================= */

const PropertyEnquiryForm = ({property}) => {

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');


  const submit = () => {

    if (!name.trim()) {

      return;

    }

    if (!mobile.trim()) {

      return;

    }

  };


  return (

    <View style={styles.card}>

      <Text style={styles.heading}>
        Enquire About This Property
      </Text>


      <TextInput
        placeholder="Your Name"
        placeholderTextColor="#999"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />


      <TextInput
        placeholder="Mobile Number"
        placeholderTextColor="#999"
        keyboardType="phone-pad"
        maxLength={10}
        style={styles.input}
        value={mobile}
        onChangeText={setMobile}
      />


      <TouchableOpacity
        style={styles.enquiryButton}
        onPress={submit}>

        <Icon
          name="send"
          size={18}
          color="#fff"
        />

        <Text style={styles.enquiryText}>
          Submit Enquiry
        </Text>

      </TouchableOpacity>

    </View>

  );
};


/* ========================================================= */
/* STICKY BOTTOM BAR */
/* ========================================================= */

const PropertyStickyBottomBar = ({property}) => {

  const callOwner = () => {

    if (property?.mobile) {

      Linking.openURL(
        `tel:${property.mobile}`,
      );

    }

  };


  const openWhatsapp = () => {

    if (property?.mobile) {

      Linking.openURL(
        `https://wa.me/91${property.mobile}`,
      );

    }

  };


  const shareProperty = async () => {

    try {

      await Share.share({

        message: `
🏠 ${property?.title || 'Property'}

📍 ${property?.location || ''}

💰 Price: ₹ ${property?.price || ''}

${API_URL}
        `,

      });

    } catch (error) {

      console.log(error);

    }

  };


  return (

    <View style={styles.bottomBar}>

      <TouchableOpacity
        style={[
          styles.bottomButton,
          styles.callButton,
        ]}
        onPress={callOwner}>

        <Icon
          name="phone"
          size={20}
          color="#fff"
        />

        <Text style={styles.bottomText}>
          Call
        </Text>

      </TouchableOpacity>


      <TouchableOpacity
        style={[
          styles.bottomButton,
          styles.whatsappButton,
        ]}
        onPress={openWhatsapp}>

        <Icon
          name="whatsapp"
          size={20}
          color="#fff"
        />

        <Text style={styles.bottomText}>
          WhatsApp
        </Text>

      </TouchableOpacity>


      <TouchableOpacity
        style={[
          styles.bottomButton,
          styles.shareButton,
        ]}
        onPress={shareProperty}>

        <Icon
          name="share-variant"
          size={20}
          color="#fff"
        />

        <Text style={styles.bottomText}>
          Share
        </Text>

      </TouchableOpacity>

    </View>

  );
};


export default DetailsScreen;


/* ========================================================= */
/* STYLES */
/* ========================================================= */

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  noProperty: {
    marginTop: 10,
    color: '#777',
    fontSize: 14,
  },

  /* CARD */

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 0,
    borderRadius: 15,
    padding: 18,
    elevation: 3,
  },

  heading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#102A47',
    marginBottom: 15,
  },

  /* DETAILS */

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 11,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
  },

  lastRow: {
    borderBottomWidth: 0,
  },

  rowTitle: {
    color: '#666',
    fontSize: 13,
  },

  rowValue: {
    color: '#222',
    fontSize: 13,
    fontWeight: '600',
    maxWidth: '55%',
    textAlign: 'right',
  },

  /* DESCRIPTION */

  description: {
    color: '#555',
    lineHeight: 24,
    fontSize: 13,
  },

  /* OWNER */

  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  ownerIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EEF4FB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  ownerInfo: {
    flex: 1,
    marginLeft: 12,
  },

  ownerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#102A47',
  },

  ownerMobile: {
    marginTop: 5,
    color: '#777',
    fontSize: 12,
  },

  ownerCall: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#1959A2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* BROCHURE */

  brochureButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  brochureInfo: {
    flex: 1,
    marginLeft: 12,
  },

  brochureTitle: {
    fontWeight: '600',
    fontSize: 14,
    color: '#222',
  },

  brochureSub: {
    marginTop: 4,
    color: '#777',
    fontSize: 11,
  },

  /* MAP */

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  locationText: {
    flex: 1,
    marginLeft: 7,
    color: '#666',
    fontSize: 13,
  },

  mapContainer: {
    height: 200,
    overflow: 'hidden',
    borderRadius: 12,
  },

  mapButton: {
    marginTop: 12,
    backgroundColor: '#1959A2',
    paddingVertical: 13,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  mapButtonText: {
    color: '#fff',
    fontWeight: '700',
    marginLeft: 7,
  },

  /* ENQUIRY */

  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 12,
    fontSize: 14,
    backgroundColor: '#FAFAFA',
  },

  enquiryButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  enquiryText: {
    color: '#fff',
    fontWeight: '700',
    marginLeft: 8,
  },

  /* BOTTOM BAR */

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 9,
    elevation: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },

  bottomButton: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginHorizontal: 3,
  },

  callButton: {
    backgroundColor: '#1959A2',
  },

  whatsappButton: {
    backgroundColor: '#25D366',
  },

  shareButton: {
    backgroundColor: '#F57C00',
  },

  bottomText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 6,
  },

});