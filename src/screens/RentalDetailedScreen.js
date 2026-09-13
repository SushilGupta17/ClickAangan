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
} from 'react-native';

import Header from '../components/Header';
import Footer from '../components/Footer';

import RentalImageCarousel from '../components/Rentaldetails/RentalImageCarousel';
import RentalTitle from '../components/Rentaldetails/RentalTitle';
// import RentalStatusCard from '../components/Rentaldetails/RentalStatusCard';
import RentalPriceCard from '../components/Rentaldetails/RentalPriceCard';
import RentalOverviewCard from '../components/Rentaldetails/RentalOverviewCard';
import RentalDetailsCard from '../components/Rentaldetails/RentalDetailsCard';
import RentalAmenities from '../components/Rentaldetails/RentalAmenities';
import RentalDescription from '../components/Rentaldetails/RentalDescription';
// import RentalLocation from '../components/Rentaldetails/RentalLocation';
import RentalContactDetails from '../components/Rentaldetails/RentalContactDetails';
import RentalVideoSection from '../components/Rentaldetails/RentalVideoSection';
import RentalImagesSlider  from '../components/Rentaldetails/RentalImagesSlider';
import {getRentalProperties} from '../services/RentalService';

// =========================================================
// RENTAL DETAILS SCREEN
// =========================================================

const RentalDetailsScreen = ({route}) => {
  // =======================================================
  // ROUTE DATA
  // =======================================================

  const routeRental =
    route?.params?.property ||
    route?.params?.rental ||
    null;

  const rentalId =
    route?.params?.id ||
    routeRental?.id ||
    routeRental?.Id ||
    routeRental?.propertyId ||
    routeRental?.PropertyId;

  // =======================================================
  // STATES
  // =======================================================

  const [rental, setRental] = useState(routeRental);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // =======================================================
  // LOAD RENTAL DETAILS
  // =======================================================

  const loadRental = useCallback(async () => {
    try {
      if (!rentalId) {
        console.log('Rental ID not available');

        setLoading(false);
        setRefreshing(false);

        return;
      }

      console.log('=================================');
      console.log('LOADING RENTAL DETAILS');
      console.log('RENTAL ID:', rentalId);
      console.log('=================================');

      setLoading(true);

      // =====================================================
      // GET RENTAL PROPERTIES
      // =====================================================

      const response = await getRentalProperties();

      console.log(
        'RENTAL API RESPONSE:',
        JSON.stringify(response, null, 2),
      );

      // =====================================================
      // NORMALIZE API RESPONSE
      // =====================================================

      let data = [];

      if (Array.isArray(response)) {
        data = response;
      } else if (Array.isArray(response?.data)) {
        data = response.data;
      } else if (Array.isArray(response?.result)) {
        data = response.result;
      } else if (Array.isArray(response?.properties)) {
        data = response.properties;
      }

      console.log('TOTAL RENTALS:', data.length);

      // =====================================================
      // FIND CURRENT RENTAL
      // =====================================================

      const foundRental = data.find(item => {
        const itemId =
          item?.id ??
          item?.Id ??
          item?.propertyId ??
          item?.PropertyId;

        return String(itemId) === String(rentalId);
      });

      // =====================================================
      // MATCH FOUND
      // =====================================================

      if (foundRental) {
        console.log(
          'MATCHED RENTAL:',
          JSON.stringify(foundRental, null, 2),
        );

        setRental(foundRental);
      } else {
        console.log(
          'Rental not found in API response',
        );

        // ===================================================
        // KEEP ROUTE PROPERTY IF AVAILABLE
        // ===================================================

        if (!routeRental) {
          setRental(null);
        }
      }
    } catch (error) {
      console.log(
        'Rental Details Error:',
        error,
      );

      // =====================================================
      // IF API FAILS BUT ROUTE DATA EXISTS,
      // KEEP EXISTING PROPERTY
      // =====================================================

      if (!routeRental) {
        setRental(null);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [rentalId, routeRental]);

  // =======================================================
  // INITIAL LOAD
  // =======================================================

  useEffect(() => {
    loadRental();
  }, [loadRental]);

  // =======================================================
  // PULL TO REFRESH
  // =======================================================

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadRental();
  }, [loadRental]);

  // =======================================================
  // LOADING
  // =======================================================

  if (loading && !rental) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <StatusBar
          backgroundColor="#ffffff"
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
  // NO RENTAL
  // =======================================================

  if (!rental) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <StatusBar
          backgroundColor="#ffffff"
          barStyle="dark-content"
        />

        <View style={styles.noDataContainer}>
          {/* ICON */}
          <View style={styles.noDataIcon}>
            <Text style={styles.noDataIconText}>
              🏠
            </Text>
          </View>

          {/* TITLE */}
          <Text style={styles.noDataTitle}>
            Rental Property Not Found
          </Text>

          {/* MESSAGE */}
          <Text style={styles.noDataText}>
            Rental property details are not available.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // =======================================================
  // RETURN
  // =======================================================

  return (
    <SafeAreaView style={styles.container}>
      {/* =================================================
          STATUS BAR
      ================================================= */}

      <StatusBar
        backgroundColor="#ffffff"
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
        contentContainerStyle={styles.scrollContent}>

        {/* =================================================
            IMAGE / VIDEO
        ================================================= */}

        <RentalImageCarousel
          property={rental}
        />

        {/* =================================================
            TITLE
        ================================================= */}

        <RentalTitle
          property={rental}
        />

        <RentalPriceCard
          property={rental}
        />

        <RentalDetailsCard
          property={rental}
        />
     

        {/* =================================================
            AMENITIES
        ================================================= */}

        {Array.isArray(rental?.amenities) &&
          rental.amenities.length > 0 && (
            <RentalAmenities
              amenities={rental.amenities}
            />
          )}


<RentalContactDetails
            property={rental}
          />

        {/* =================================================
            DESCRIPTION
        ================================================= */}

        {rental?.description && (
          <RentalDescription
            property={rental}
          />
        )}

        {/* =================================================
            OWNER
        ================================================= */}

        {(rental?.contactperson ||
          rental?.contactmobile ||
          rental?.contactemail ||
          rental?.Owner ||
          rental?.Mobile ||
          rental?.OwnerName) && (
          <RentalContactDetails
            property={rental}
          />
        )}

<RentalImagesSlider property={rental} />


{(rental?.videoUrl || rental?.VideoUrl) && (
  <RentalVideoSection property={rental} />
)}



      </ScrollView>

      {/* =================================================
          STICKY BOTTOM BAR
      ================================================= */}

      {/* <RentalStickyBottomBar
        property={rental}
      /> */}

      {/* =================================================
          FOOTER
      ================================================= */}

      <Footer />
    </SafeAreaView>
  );
};

// =========================================================
// STYLES
// =========================================================

const styles = StyleSheet.create({
  // =======================================================
  // MAIN CONTAINER
  // =======================================================

  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },

  // =======================================================
  // SCROLL CONTENT
  // =======================================================

  scrollContent: {
    paddingBottom: 150,
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

  noDataIconText: {
    fontSize: 30,
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
});

export default RentalDetailsScreen;