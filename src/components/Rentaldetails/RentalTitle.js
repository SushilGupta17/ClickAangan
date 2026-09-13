import React from 'react';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const RentalTitle = ({property}) => {
  const title =
    property?.title ||
    property?.propertyTitle ||
    property?.propertyName ||
    'Rental Property';

  const propertyType =
    property?.propertyType ||
    property?.PropertyType ||
    '';

  const subCategory =
    property?.subCategory ||
    property?.SubCategory ||
    '';

  const location =
    property?.location ||
    property?.locality ||
    property?.address ||
    '';

  const city =
    property?.city ||
    '';

  return (
    <View style={styles.card}>

      {/* =====================================================
          PROPERTY TITLE
      ===================================================== */}

      <Text
        style={styles.propertyName}
        numberOfLines={2}>
        {title}
      </Text>

      {/* =====================================================
          PROPERTY TYPE
      ===================================================== */}

      {(propertyType || subCategory) && (
        <View style={styles.row}>
          <Icon
            name="home-city-outline"
            size={18}
            color="#1959A2"
          />

          <Text style={styles.type}>
            {propertyType}

            {subCategory
              ? ` • ${subCategory}`
              : ''}
          </Text>
        </View>
      )}

      {/* =====================================================
          LOCATION
      ===================================================== */}

      {(location || city) && (
        <View style={styles.row}>
          <Icon
            name="map-marker-outline"
            size={18}
            color="#E85D04"
          />

          <Text
            style={styles.location}
            numberOfLines={2}>
            {location}
            {city ? `, ${city}` : ''}
          </Text>
        </View>
      )}

    </View>
  );
};

export default RentalTitle;

// =========================================================
// STYLES
// =========================================================

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',

    marginHorizontal: 15,
    marginTop: 15,

    borderRadius: 15,

    padding: 18,

    elevation: 3,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },

  // =======================================================
  // TITLE
  // =======================================================

  propertyName: {
    fontSize: 13,

    fontWeight: '800',

    color: '#102A47',

    lineHeight: 20,
  },

  // =======================================================
  // ROW
  // =======================================================

  row: {
    flexDirection: 'row',

    alignItems: 'center',

    marginTop: 11,
  },

  // =======================================================
  // PROPERTY TYPE
  // =======================================================

  type: {
    flex: 1,

    marginLeft: 8,

    fontSize: 12,

    color: '#444',

    fontWeight: '500',
  },

  // =======================================================
  // LOCATION
  // =======================================================

  location: {
    flex: 1,

    marginLeft: 8,

    fontSize: 12,

    color: '#666',

    fontWeight: '500',

    lineHeight: 18,
  },
});