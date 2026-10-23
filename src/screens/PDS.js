
import React, {useCallback, useEffect, useState} from 'react';

import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  Linking,
  TouchableOpacity,
  Share,
  TextInput,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {WebView} from 'react-native-webview';

import Header from '../components/Header';
import Footer from '../components/Footer';

import PropertyImageCarousel from '../components/propertydetails/PropertyImageCarousel';
import PropertyTitle from '../components/propertydetails/PropertyTitle';
import PropertyStatusCard from '../components/propertydetails/PropertyStatusCard';
import PropertyPriceCard from '../components/propertydetails/PropertyPriceCard';
import PropertyOverviewCard from '../components/propertydetails/PropertyOverviewCard';
import PropertyAmenities from '../components/propertydetails/PropertyAmenities';

const API_URL = 'https://savariyaproperty.in';

// =========================================================
// PROPERTY DETAILS SCREEN
// =========================================================

const DetailsScreen = ({route}) => {
  // =======================================================
  // ROUTE DATA
  // =======================================================

  const routeProperty =
    route?.params?.property || null;

  const propertyId =
    route?.params?.id ||
    routeProperty?.id ||
    routeProperty?.Id ||
    routeProperty?.propertyId ||
    routeProperty?.PropertyId;

  // =======================================================
  // STATES
  // =======================================================

  const [property, setProperty] =
    useState(routeProperty);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  // =======================================================
  // LOAD PROPERTY
  // =======================================================

  const loadPropertyDetails = useCallback(async () => {
    try {
      if (!propertyId) {
        console.log(
          'Property ID not available',
        );

        setLoading(false);
        setRefreshing(false);
        return;
      }

      console.log(
        '=================================',
      );

      console.log(
        'LOADING PROPERTY DETAILS',
      );

      console.log(
        'PROPERTY ID:',
        propertyId,
      );

      console.log(
        '=================================',
      );

      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/Property/${propertyId}`,
      );

      if (!response.ok) {
        throw new Error(
          `HTTP Error ${response.status}`,
        );
      }

      const data = await response.json();

      console.log(
        'PROPERTY API DATA =>',
        JSON.stringify(
          data,
          null,
          2,
        ),
      );

      /*
       * Keep API response compatible with
       * existing Property API.
       */

      let propertyData = data;

      if (
        data?.data &&
        !Array.isArray(data.data)
      ) {
        propertyData = data.data;
      } else if (
        data?.result &&
        !Array.isArray(data.result)
      ) {
        propertyData = data.result;
      } else if (
        data?.property &&
        !Array.isArray(data.property)
      ) {
        propertyData = data.property;
      }

      if (propertyData) {
        setProperty(propertyData);
      }
    } catch (error) {
      console.log(
        'Property Details Error =>',
        error,
      );

      /*
       * API fail hone par route se
       * aaya hua property data preserve rahega.
       */

      if (!routeProperty) {
        setProperty(null);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [propertyId, routeProperty]);

  // =======================================================
  // INITIAL LOAD
  // =======================================================

  useEffect(() => {
    loadPropertyDetails();
  }, [loadPropertyDetails]);

  // =======================================================
  // REFRESH
  // =======================================================

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadPropertyDetails();
  }, [loadPropertyDetails]);

  // =======================================================
  // LOADING
  // =======================================================

  if (loading && !property) {
    return (
      <SafeAreaView
        style={styles.loaderContainer}>

        <StatusBar
          backgroundColor="#FFFFFF"
          barStyle="dark-content"
        />

        <ActivityIndicator
          size="large"
          color="#1959A2"
        />

      </SafeAreaView>
    );
  }

  // =======================================================
  // NO PROPERTY
  // =======================================================

  if (!property) {
    return (
      <SafeAreaView
        style={styles.loaderContainer}>

        <StatusBar
          backgroundColor="#FFFFFF"
          barStyle="dark-content"
        />

        <View
          style={styles.noDataContainer}>

          <View
            style={styles.noDataIcon}>

            <Icon
              name="home-alert-outline"
              size={34}
              color="#1959A2"
            />

          </View>

          <Text
            style={styles.noDataTitle}>

            Property Not Found

          </Text>

          <Text
            style={styles.noDataText}>

            Property details are not available
            at the moment.

          </Text>

        </View>

      </SafeAreaView>
    );
  }

  // =======================================================
  // LATITUDE / LONGITUDE
  // =======================================================

  const latitude =
    Number(
      property?.latitude ??
        property?.Latitude ??
        property?.lat ??
        property?.Lat,
    ) || 26.9124;

  const longitude =
    Number(
      property?.longitude ??
        property?.Longitude ??
        property?.lng ??
        property?.Lng,
    ) || 75.7873;

  // =======================================================
  // SCREEN
  // =======================================================

  return (
    <SafeAreaView
      style={styles.container}>

      {/* =================================================
          STATUS BAR
      ================================================= */}

      <StatusBar
        backgroundColor="#FFFFFF"
        barStyle="dark-content"
      />

      {/* =================================================
          HEADER
      ================================================= */}

      <Header />

      {/* =================================================
          CONTENT
      ================================================= */}

      <ScrollView
        showsVerticalScrollIndicator={false}

        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#1959A2']}
            tintColor="#1959A2"
          />
        }

        contentContainerStyle={
          styles.scrollContent
        }>

        {/* =================================================
            PROPERTY IMAGE
        ================================================= */}

        <PropertyImageCarousel
          property={property}
        />

        {/* =================================================
            TITLE
        ================================================= */}

        <PropertyTitle
          property={property}
        />

        <PropertyOverviewCard
          property={property}
        />


        {/* =================================================
            AMENITIES
        ================================================= */}

        {Array.isArray(
          property?.amenities,
        ) &&
          property.amenities.length > 0 && (

            <PropertyAmenities
              amenities={
                property.amenities
              }
            />

          )}
   

        {/* =================================================
            OWNER
        ================================================= */}

        <OwnerCard
          property={property}
        />

      

      </ScrollView>

      {/* =================================================
          FOOTER
      ================================================= */}

      <Footer />

      {/* =================================================
          STICKY BAR
      ================================================= */}

      <PropertyStickyBottomBar
        property={property}
      />

    </SafeAreaView>
  );
};

// =========================================================
// PROPERTY DETAILS CARD
// =========================================================

const PropertyDetailsCard = ({
  property,
}) => {
  const rows = [
    {
      title: 'Configuration',
      value:
        property?.bhk ??
        property?.BHK ??
        property?.configuration,
    },
    {
      title: 'Area',
      value:
        property?.area ||
        property?.Area
          ? `${
              property?.area ??
              property?.Area
            } Sq.Ft.`
          : null,
    },
    {
      title: 'Furnishing',
      value:
        property?.furnishing ??
        property?.Furnishing,
    },
    {
      title: 'Parking',
      value:
        property?.parking ??
        property?.Parking,
    },
    {
      title: 'Property Type',
      value:
        property?.propertyType ??
        property?.PropertyType,
    },
  ];

  return (
    <View style={styles.card}>

      <View
        style={styles.sectionHeader}>

        <View
          style={styles.sectionLine}
        />

        <Text
          style={styles.heading}>

          Property Details

        </Text>

      </View>

      {rows.map((row, index) => {

        if (
          row.value === null ||
          row.value === undefined ||
          row.value === ''
        ) {
          return null;
        }

        return (
          <View
            key={index}
            style={[
              styles.detailRow,
              index ===
                rows.length - 1 &&
                styles.lastRow,
            ]}>

            <Text
              style={styles.rowTitle}>

              {row.title}

            </Text>

            <Text
              style={styles.rowValue}>

              {row.value}

            </Text>

          </View>
        );
      })}

    </View>
  );
};

// =========================================================
// DESCRIPTION
// =========================================================

const PropertyDescription = ({
  property,
}) => {
  const description =
    property?.description ??
    property?.Description;

  if (!description) {
    return null;
  }

  return (
    <View style={styles.card}>

      <View
        style={styles.sectionHeader}>

        <View
          style={styles.sectionLine}
        />

        <Text
          style={styles.heading}>

          Description

        </Text>

      </View>

      <Text
        style={styles.description}>

        {description}

      </Text>

    </View>
  );
};

// =========================================================
// OWNER
// =========================================================

const OwnerCard = ({
  property,
}) => {
  const mobile =
    property?.mobile ??
    property?.Mobile ??
    property?.contactMobile ??
    property?.ContactMobile;

  const owner =
    property?.owner ??
    property?.Owner ??
    property?.ownerName ??
    property?.OwnerName ??
    property?.contactPerson ??
    property?.ContactPerson;

  if (!owner && !mobile) {
    return null;
  }

  const callOwner = () => {
    if (mobile) {
      Linking.openURL(
        `tel:${mobile}`,
      );
    }
  };

  return (
    <View style={styles.card}>

      <View
        style={styles.sectionHeader}>

        <View
          style={styles.sectionLine}
        />

        <Text
          style={styles.heading}>

          Owner Details

        </Text>

      </View>

      <View
        style={styles.ownerRow}>

        <View
          style={styles.ownerIcon}>

          <Icon
            name="account"
            size={30}
            color="#1959A2"
          />

        </View>

        <View
          style={styles.ownerInfo}>

          <Text
            style={styles.ownerName}>

            {owner ||
              'Property Owner'}

          </Text>

          {mobile ? (
            <Text
              style={
                styles.ownerMobile
              }>

              +91 {mobile}

            </Text>
          ) : null}

        </View>

        {mobile ? (
          <TouchableOpacity
            style={
              styles.ownerCall
            }
            onPress={callOwner}>

            <Icon
              name="phone"
              size={20}
              color="#FFFFFF"
            />

          </TouchableOpacity>
        ) : null}

      </View>

    </View>
  );
};

// =========================================================
// BROCHURE
// =========================================================

const PropertyBrochure = ({
  property,
}) => {
  const brochure =
    property?.brochurePath ||
    property?.BrochurePath ||
    property?.brochure ||
    property?.Brochure ||
    property?.brochureUrl ||
    property?.BrochureUrl;

  if (!brochure) {
    return null;
  }

  const openBrochure = () => {
    const url =
      brochure.startsWith('http')
        ? brochure
        : `${API_URL}${brochure}`;

    Linking.openURL(url);
  };

  return (
    <View style={styles.card}>

      <View
        style={styles.sectionHeader}>

        <View
          style={styles.sectionLine}
        />

        <Text
          style={styles.heading}>

          Property Brochure

        </Text>

      </View>

      <TouchableOpacity
        style={
          styles.brochureButton
        }
        onPress={openBrochure}>

        <View
          style={
            styles.brochureIconBox
          }>

          <Icon
            name="file-pdf-box"
            size={30}
            color="#D32F2F"
          />

        </View>

        <View
          style={
            styles.brochureInfo
          }>

          <Text
            style={
              styles.brochureTitle
            }>

            Download Brochure

          </Text>

          <Text
            style={
              styles.brochureSub
            }>

            View property brochure PDF

          </Text>

        </View>

        <Icon
          name="chevron-right"
          size={24}
          color="#777777"
        />

      </TouchableOpacity>

    </View>
  );
};

// =========================================================
// MAP
// =========================================================

const PropertyMapSection = ({
  property,
  latitude,
  longitude,
}) => {
  const title =
    property?.title ||
    property?.Title ||
    'Property';

  const location =
    property?.location ||
    property?.Location;

  const openFullMap = () => {
    const url =
      `https://www.openstreetmap.org/?mlat=${latitude}` +
      `&mlon=${longitude}` +
      `#map=16/${latitude}/${longitude}`;

    Linking.openURL(url);
  };

  return (
    <View style={styles.card}>

      <View
        style={styles.sectionHeader}>

        <View
          style={styles.sectionLine}
        />

        <Text
          style={styles.heading}>

          Location

        </Text>

      </View>

      {location ? (
        <View
          style={
            styles.locationRow
          }>

          <View
            style={
              styles.locationIcon
            }>

            <Icon
              name="map-marker"
              size={19}
              color="#1959A2"
            />

          </View>

          <Text
            style={
              styles.locationText
            }>

            {location}

          </Text>

        </View>
      ) : null}

      <View
        style={styles.mapContainer}>

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

                  var map =
                    L.map('map')
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
                    ${JSON.stringify(title)}
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
          color="#FFFFFF"
        />

        <Text
          style={
            styles.mapButtonText
          }>

          Open Full Map

        </Text>

      </TouchableOpacity>

    </View>
  );
};

// =========================================================
// ENQUIRY FORM
// =========================================================

const PropertyEnquiryForm = ({
  property,
}) => {
  const [name, setName] =
    useState('');

  const [mobile, setMobile] =
    useState('');

  const submit = () => {
    if (!name.trim()) {
      return;
    }

    if (!mobile.trim()) {
      return;
    }

    console.log(
      'Property Enquiry',
      {
        propertyId:
          property?.id ??
          property?.Id,
        name,
        mobile,
      },
    );
  };

  return (
    <View style={styles.card}>

      <View
        style={styles.sectionHeader}>

        <View
          style={styles.sectionLine}
        />

        <Text
          style={styles.heading}>

          Enquire About This Property

        </Text>

      </View>

      <TextInput
        placeholder="Your Name"
        placeholderTextColor="#999999"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        placeholder="Mobile Number"
        placeholderTextColor="#999999"
        keyboardType="phone-pad"
        maxLength={10}
        style={styles.input}
        value={mobile}
        onChangeText={setMobile}
      />

      <TouchableOpacity
        style={
          styles.enquiryButton
        }
        onPress={submit}>

        <Icon
          name="send"
          size={18}
          color="#FFFFFF"
        />

        <Text
          style={
            styles.enquiryText
          }>

          Submit Enquiry

        </Text>

      </TouchableOpacity>

    </View>
  );
};

// =========================================================
// STICKY BOTTOM BAR
// =========================================================

const PropertyStickyBottomBar = ({
  property,
}) => {
  const mobile =
    property?.mobile ??
    property?.Mobile ??
    property?.contactMobile ??
    property?.ContactMobile;

  const callOwner = () => {
    if (mobile) {
      Linking.openURL(
        `tel:${mobile}`,
      );
    }
  };

  const openWhatsapp = () => {
    if (!mobile) {
      return;
    }

    const cleanMobile =
      String(mobile).replace(
        /[^0-9]/g,
        '',
      );

    Linking.openURL(
      `https://wa.me/91${cleanMobile}`,
    );
  };

  const shareProperty = async () => {
    try {
      const title =
        property?.title ||
        property?.Title ||
        'Property';

      const location =
        property?.location ||
        property?.Location ||
        '';

      const price =
        property?.price ||
        property?.Price ||
        '';

      await Share.share({
        message:
          `🏠 ${title}\n` +
          `📍 ${location}\n` +
          `💰 Price: ₹ ${price}\n\n` +
          `View on ClickAangan\n` +
          `${API_URL}`,
      });
    } catch (error) {
      console.log(
        'Share Error:',
        error,
      );
    }
  };

  return (
    <View
      style={styles.bottomBar}>

      {/* CALL */}

      <TouchableOpacity
        style={[
          styles.bottomButton,
          styles.callButton,
        ]}
        onPress={callOwner}>

        <Icon
          name="phone"
          size={20}
          color="#FFFFFF"
        />

        <Text
          style={
            styles.bottomText
          }>

          Call

        </Text>

      </TouchableOpacity>

      {/* WHATSAPP */}

      <TouchableOpacity
        style={[
          styles.bottomButton,
          styles.whatsappButton,
        ]}
        onPress={openWhatsapp}>

        <Icon
          name="whatsapp"
          size={20}
          color="#FFFFFF"
        />

        <Text
          style={
            styles.bottomText
          }>

          WhatsApp

        </Text>

      </TouchableOpacity>

      {/* SHARE */}

      <TouchableOpacity
        style={[
          styles.bottomButton,
          styles.shareButton,
        ]}
        onPress={shareProperty}>

        <Icon
          name="share-variant"
          size={20}
          color="#FFFFFF"
        />

        <Text
          style={
            styles.bottomText
          }>

          Share

        </Text>

      </TouchableOpacity>

    </View>
  );
};

// =========================================================
// STYLES
// =========================================================

const styles = StyleSheet.create({

  // =======================================================
  // MAIN
  // =======================================================

  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },

  scrollContent: {
    paddingBottom: 165,
  },

  // =======================================================
  // LOADER
  // =======================================================

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  // =======================================================
  // NO DATA
  // =======================================================

  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },

  noDataIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#EEF4FB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },

  noDataTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#102A47',
    textAlign: 'center',
  },

  noDataText: {
    marginTop: 8,
    fontSize: 13,
    color: '#777777',
    textAlign: 'center',
    lineHeight: 20,
  },

  // =======================================================
  // CARD
  // =======================================================

  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 15,
    padding: 18,

    elevation: 3,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 5,
  },

  // =======================================================
  // SECTION HEADER
  // =======================================================

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  sectionLine: {
    width: 4,
    height: 20,
    borderRadius: 2,
    backgroundColor: '#F57C00',
    marginRight: 9,
  },

  heading: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#102A47',
  },

  // =======================================================
  // DETAILS
  // =======================================================

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
    color: '#666666',
    fontSize: 13,
  },

  rowValue: {
    color: '#102A47',
    fontSize: 13,
    fontWeight: '600',
    maxWidth: '55%',
    textAlign: 'right',
  },

  // =======================================================
  // DESCRIPTION
  // =======================================================

  description: {
    color: '#555555',
    lineHeight: 24,
    fontSize: 13,
  },

  // =======================================================
  // OWNER
  // =======================================================

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
    color: '#777777',
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

  // =======================================================
  // BROCHURE
  // =======================================================

  brochureButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  brochureIconBox: {
    width: 46,
    height: 46,
    borderRadius: 10,
    backgroundColor: '#FFF3F3',
    justifyContent: 'center',
    alignItems: 'center',
  },

  brochureInfo: {
    flex: 1,
    marginLeft: 12,
  },

  brochureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#102A47',
  },

  brochureSub: {
    marginTop: 4,
    color: '#777777',
    fontSize: 11,
  },

  // =======================================================
  // LOCATION
  // =======================================================

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  locationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEF4FB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  locationText: {
    flex: 1,
    marginLeft: 8,
    color: '#666666',
    fontSize: 13,
    lineHeight: 19,
  },

  // =======================================================
  // MAP
  // =======================================================

  mapContainer: {
    height: 200,
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: '#EEEEEE',
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
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
    marginLeft: 7,
  },

  // =======================================================
  // ENQUIRY
  // =======================================================

  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 12,
    fontSize: 14,
    backgroundColor: '#FAFAFA',
    color: '#222222',
  },

  enquiryButton: {
    backgroundColor: '#1959A2',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  enquiryText: {
    color: '#FFFFFF',
    fontWeight: '700',
    marginLeft: 8,
  },

  // =======================================================
  // STICKY BOTTOM
  // =======================================================

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,

    flexDirection: 'row',

    backgroundColor: '#FFFFFF',

    paddingHorizontal: 10,
    paddingVertical: 9,

    elevation: 12,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,

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
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 6,
  },

});

export default DetailsScreen;
 
