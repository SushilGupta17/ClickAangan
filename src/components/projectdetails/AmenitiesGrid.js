import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AmenitiesGrid = ({amenities = []}) => {

  // JSON string ko array mein convert karna
  let amenityList = amenities;

  try {
    if (typeof amenities === 'string') {
      amenityList = JSON.parse(amenities);
    }
  } catch (error) {
    console.log('Amenities JSON Parse Error:', error);
    amenityList = [];
  }

  // Agar API object ke andar amenities bhej rahi hai
  if (!Array.isArray(amenityList)) {
    if (amenityList?.amenities && Array.isArray(amenityList.amenities)) {
      amenityList = amenityList.amenities;
    } else {
      amenityList = [];
    }
  }

  const renderItem = ({item}) => {

    // Agar item string hai
    const amenityName =
      typeof item === 'string'
        ? item
        : item?.name ||
          item?.Name ||
          item?.amenityName ||
          item?.AmenityName ||
          item?.title ||
          item?.Title ||
          '';

    if (!amenityName) {
      return null;
    }

    return (
      <View style={styles.item}>
        <Icon
          name="check-decagram"
          size={18}
          color="#2E7D32"
        />

        <Text style={styles.text}>
          {amenityName}
        </Text>
      </View>
    );
  };

  if (!amenityList || amenityList.length === 0) {
    return null;
  }

  return (
    <View style={styles.card}>

      <Text style={styles.heading}>
        Amenities
      </Text>

      <FlatList
        data={amenityList}
        keyExtractor={(item, index) =>
          `${index}-${typeof item === 'string' ? item : item?.name || item?.Name || index}`
        }
        numColumns={4}
        scrollEnabled={false}
        renderItem={renderItem}
        columnWrapperStyle={styles.row}
      />

    </View>
  );
};

export default AmenitiesGrid;

const styles = StyleSheet.create({

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 18,
    borderRadius: 15,
  },

  heading: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 15,
    color: '#222',
  },

  row: {
    flex: 1,
  },

  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    paddingHorizontal: 2,
    minWidth: 0,
  },

  text: {
    marginTop: 5,
    textAlign: 'center',
    fontSize: 10,
    color: '#444',
  },

});